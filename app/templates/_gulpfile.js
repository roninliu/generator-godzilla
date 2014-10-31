'use strict';
// 引入 gulp
var gulp = require('gulp');
// 引入组件
var concat = require('gulp-concat');//合并文件
var rename = require('gulp-rename');//重命名文件
var del = require('del');//删除文件
var gutil = require('gulp-util');//gulp工具类
var jshint = require('gulp-jshint');//js检查
var uglify = require('gulp-uglify');//js压缩
var csslint = require('gulp-csslint');//css检查
var cssmin = require("gulp-minify-css");//压缩css
var htmlmin = require('gulp-prettify');


//清理build文件夹目录，防止重复文件生成
gulp.task("clean",function(cb){
  del(["./build/"],cb)
})

//检查javascript脚本，合并脚本
gulp.task("scripts",["clean"],function(){
  return gulp.src("./src/js/*.js")
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(concat('main.js'))
        .pipe(rename("<%= projectName%>.js"))
        .pipe(uglify())
        .pipe(gulp.dest('./build/js'));
})
//检查css样式表，压缩css样式表
var cssReporter = function(files){
  gutil.log("[CSSLint Error]"+
      gutil.colors.cyan(files.csslint.errorCount)
      + " error in " + gutil.colors.magenta(files.path));
  files.csslint.results.forEach(function(result){
    gutil.log(result.error.message + "on line "+ result.error.line);
  })
}
gulp.task("css",["clean"],function(){
  return gulp.src("./src/css/*.css")
         .pipe(csslint())
         .pipe(csslint.reporter(cssReporter))
         .pipe(concat("main.css"))
         .pipe(rename("<%=projectName%>.css"))
         .pipe(cssmin({keepBreaks:false}))
         .pipe(csslint())
         .pipe(csslint.reporter(cssReporter))
         .pipe(gulp.dest("./build/css"));
})

//处理html
gulp.task("html",["clean"],function(){
  return gulp.src("./src/*.html")
        .pipe(htmlmin({indent_size: 2}))
        .pipe(gulp.dest('./build/'));
})
//处理图片
gulp.task("images",["clean"],function(){
  return gulp.src("./src/img/*")
         .pipe(gulp.dest('./build/img'));
})

//观察者模式
gulp.task("watch",function(){
  gulp.watch("./src/js/*.js",["scripts"]);
  gulp.watch("./src/css/*.css",["css"]);
  gulp.watch("./src/*.html",["html"]);
  gulp.watch("./src/img/*",["images"]);
})
// 默认任务
gulp.task('default',["watch","scripts","css","html","images"],function(cb){
  gutil.log("[Godzilla INFO] :")
  gutil.log("Done ---- <%=projectName%> all task has been compiled!")
});
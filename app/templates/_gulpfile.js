"use strict";
// 引入 gulp
var gulp = require("gulp");
// 引入组件
var concat = require("gulp-concat");//合并文件
var rename = require("gulp-rename");//重命名文件
var del = require("del");//删除文件
var gutil = require("gulp-util");//gulp工具类
var jshint = require("gulp-jshint");//js检查
var uglify = require("gulp-uglify");//js压缩
var cssmin = require("gulp-minify-css");//压缩css
var mutuo = require("gulp-mutuo");//转化@2x图工具
var sprite = require("gulp-spriter");//雪碧图工具
var imageisux = require("gulp-imageisux")//智图压缩


//清理dist文件夹目录，防止重复文件生成
gulp.task("clean",function(cb){
  del(["./dist/*"],cb);
});


//检查javascript脚本，合并脚本
gulp.task("scripts",function(){
  return gulp.src("./src/js/*.js")
        .pipe(jshint())
        .pipe(jshint.reporter("default"))
        .pipe(concat("main.js"))
        .pipe(rename("<%= projectName%>.js"))
        .pipe(uglify())
        .pipe(gulp.dest("./dist/js"));
})
//处理@2x图为@1x图片
gulp.task("slice",function(){
  return gulp.src("./src/slice/*")
        .pipe(mutuo())
})
//处理css文件，合并雪碧图
gulp.task("css",["slice"],function(){
  return gulp.src("./src/css/*.css")
         .pipe(concat("main.css"))
         .pipe(rename("<%= projectName%>.css"))
         .pipe(sprite({
           outname:"<%= projectName%>.png",
           inpath:"./src/slice",
           outpath:"./src/sprite"
         }))
         .pipe(cssmin({keepBreaks:false}))
         .pipe(gulp.dest("./dist/css"));
})
//处理html
gulp.task("html",function(){
  return gulp.src("./src/*.html")
        .pipe(gulp.dest("./dist/"));
})
//处理雪碧图压缩
gulp.task("sprite",["css"],function(){
  return gulp.src("./src/sprite/*")
        .pipe(imageisux("../../dist/sprite"))
})
//处理图片
gulp.task("images",function(){
  return gulp.src("./src/img/*")
        .pipe(imageisux("../../dist/img"))
})

//观察者模式
gulp.task("watch",function(){
  gulp.watch("./src/js/*.js",["scripts"]);
  gulp.watch("./src/css/*.css",["css"]);
  gulp.watch("./src/*.html",["html"]);
  gulp.watch("./src/img/*",["images"]);
})
// 默认任务
gulp.task("default",["clean","watch","scripts","css","html","images","sprite"],function(cb){
  gutil.log(
    gutil.colors.green("[Godzilla]"),
    gutil.colors.yellow("[DONE]:All Task has been compiled of the <%= projectName%> project!")
  )
});
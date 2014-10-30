'use strict';
// 引入 gulp
var gulp = require('gulp');
// 引入组件
var jshint = require('gulp-jshint');//js检查
var concat = require('gulp-concat');//合并文件
var uglify = require('gulp-uglify');//js压缩
var rename = require('gulp-rename');//重命名文件
var mincss = require("gulp-minify-css");//压缩css
var del = require('del');//清理build文件夹内容
//var minhtml = require("gulp-htmlmin");//压缩html

var paths={
  scripts:"./src/js/*.js",
  images:"./src/img/*",
  slice:"./src/slice/*",
  css:"./src/css/*.css",
  html:"./src/*.html",
  buildHtml:"./build/*.html",
  buildCSS:"./build/css/*.css",
  buildImages:"./build/img/*",
  buildSlice:"./build/slice/*",
  buildScript:"./build/js/*.js"
}
//清理build文件夹，防止重复文件生成
gulp.task("cleanCSS",function(cb){
  del([paths.buildCSS],cb)
});
gulp.task("cleanHTML",function(cb){
  del([paths.buildHtml],cb)
});
gulp.task("cleanImages",function(cb){
  del([paths.buildImages],cb)
});
gulp.task("cleanSlice",function(cb){
  del([paths.buildSlice],cb)
});
gulp.task("cleanScript",function(cb){
  del([paths.buildScript],cb)
});

// 检查脚本
gulp.task('lint',function() {
  return gulp.src(paths.scripts)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});
// 合并，压缩js文件
gulp.task('scripts',["cleanScript"],function() {
  return gulp.src(paths.scripts)
        .pipe(concat('all.js'))
        .pipe(rename("<%= projectName%>.js"))
        .pipe(uglify())
        .pipe(gulp.dest('./build/js'));
});

//合并，压缩css文件
gulp.task("styles",["cleanCSS"],function(){
  return gulp.src(paths.css)
        .pipe(mincss({keepBreaks:false}))
        .pipe(gulp.dest("./build/css"));
})
//处理html
gulp.task("htmls",["cleanHTML"],function(){
  return gulp.src(paths.html)
        .pipe(gulp.dest('./build/'));
})
//处理图片
gulp.task("images",["cleanImages"],function(){
  return gulp.src(paths.images)
         .pipe(gulp.dest('./build/img'));
})
//观察者模式
gulp.task("watch",function(){
  gulp.watch(paths.scripts,["lint"]);
  gulp.watch(paths.scripts,["scripts"]);
  gulp.watch(paths.css,["styles"]);
  gulp.watch(paths.html,["htmls"]);
  gulp.watch(paths.images,["images"]);
})
// 默认任务
gulp.task('default',["watch","lint","scripts","styles","htmls","images"],function(cb){
  console.log("[Godzilla INFO] : Done ---- <%=projectName%> project has been compiled!")
});
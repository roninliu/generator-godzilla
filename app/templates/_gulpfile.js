'use strict';
// 引入 gulp
var gulp = require('gulp');
// 引入组件
var jshint = require('gulp-jshint');//js检查
var concat = require('gulp-concat');//合并文件
var uglify = require('gulp-uglify');//js压缩
var rename = require('gulp-rename');//重命名文件
var mincss = require("gulp-minify-css");//压缩css
//var minhtml = require("gulp-htmlmin");//压缩html

// 检查脚本
gulp.task('lint', function() {
    gulp.src('./src/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
    console.log("Lint Scripts Task Synchronization Completed ");
});
// 合并，压缩js文件
gulp.task('scripts', function() {
    gulp.src('./src/js/*.js')
        .pipe(concat('all.js'))
        .pipe(rename("<%= projectName%>.js"))
        .pipe(uglify())
        .pipe(gulp.dest('./build/js'));
    console.log("Scripts Task Synchronization Completed ");
});

//合并，压缩css文件
gulp.task("styles",function(){
  gulp.src("./src/css/*.css")
      .pipe(mincss({keepBreaks:false}))
      //.pipe(rename({suffix:".min"}))
      .pipe(gulp.dest("./build/css"));
  console.log("CSS Task Synchronization Completed ");
})
//处理html
gulp.task("htmls",function(){
  gulp.src('./src/*.html')
      .pipe(gulp.dest('./build/'));
  console.log("HTML Task Synchronization Completed ");
})
//处理图片
gulp.task("images",function(){
   gulp.src('./src/img/*')
      .pipe(gulp.dest('./build/img'));
  console.log("Image Task Synchronization Completed ");

})
// 默认任务
gulp.task('default',function(){
    gulp.run('lint', 'scripts',"styles","htmls","images");
    gulp.watch("./src/*.html",["htmls"]);
    gulp.watch("./src/js/*.js",['lint', 'scripts']);
    gulp.watch("./src/css/*.css",["styles"]);
    gulp.watch("./src/img/*",["images"]);
    console.log("Task Completed ");
});
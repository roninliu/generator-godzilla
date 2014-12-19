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
var ftp = require("gulp-iftp");//部署任务

//清理依赖环境
gulp.task("clean",function(){
  del.sync("./debug/*");
  del.sync("./dist/*")
})
//检查javascript脚本，合并脚本
gulp.task("js",function(){
  return gulp.src(["./src/js/*.js"])
        .pipe(jshint())
        .pipe(jshint.reporter("jshint-stylish"))
        .pipe(concat("main.js"))
        .pipe(rename("<%= projectName%>.js"))
        .pipe(uglify())
        .pipe(gulp.dest("./debug/js"));
})
//处理@2x图片为@1x图片
gulp.task("cover",function(){
  return gulp.src(["./src/img/*","./src/img/slice/*"])
        .pipe(mutuo());
})
//处理html
gulp.task("html",function(){
  return gulp.src(["./src/*.html"])
        .pipe(gulp.dest("./debug/"));
})
//处理css文件，合并雪碧图
gulp.task("css",function(){
  return gulp.src("./src/css/*.css")
         .pipe(concat("main.css"))
         .pipe(rename("<%= projectName%>.css"))
         .pipe(sprite({
           outname:"<%= projectName%>.png",
           inpath:"./src/img/slice",
           outpath:"./debug/img/sprite"
         }))
         .pipe(cssmin({keepBreaks:false}))
         .pipe(gulp.dest("./debug/css"));
})
//压缩图片，同步图片到debug环境
gulp.task("img",function(){
  return gulp.src(["./src/img/*.png","./src/img/*.jpg","!./src/img/sprite/*"])
        .pipe(imageisux("../../debug/img"))
})
//压缩雪碧图，同步到dist环境
gulp.task("sprite",function(){
  return gulp.src(["./debug/img/sprite/*.png"])
        .pipe(imageisux("../../../dist/img/sprite"))
})
//观察者模式
gulp.task("watch",function(){
  gulp.watch("./src/js/*.js",["js"]);
  gulp.watch("./src/css/*.css",["css"]);
  gulp.watch("./src/*.html",["html"]);
})

//发布debug环境
gulp.task("debug",["clean"],function(){
  gulp.start(["html","css","img","js"]);
})
//发布dist环境。准备上传使用
gulp.task("dist",function(){
  gulp.start(["sprite"]);
  gulp.src("./debug/*")
  .pipe(gulp.dest("./dist"));
  gulp.src("./debug/css/*")
  .pipe(gulp.dest("./dist/css"));
  gulp.src("./debug/js/*")
  .pipe(gulp.dest("./dist/js"));
  gulp.src("./debug/img/*")
  .pipe(gulp.dest("./dist/img"));
  gulp.src("./debug/img/sprite/*")
  .pipe(gulp.dest("./dist/img/sprite"));
});
//发布体验环境任务
gulp.task("upload",function(){
  gulp.src("./dist/index.html")
        .pipe(ftp({
          host:"xx",
          port:"xx",
          user:"xx",
          pass:"xx",
          logger:"logger.txt",
          froot:"/usr/local/imgcache/htdocs",
          remote:"xx",
          exp:"xx",
          pro:"xx"
        }))
})
// 默认任务
gulp.task("default",function(){
  gutil.log(
    gutil.colors.green("[Info]:"),
    gutil.colors.yellow("When your completed code, execute following command:")
  );
  gutil.log(
    gutil.colors.green("[Step 1]:"),
    gutil.colors.yellow("gulp cover")
  )
   gutil.log(
    gutil.colors.green("[Step 2]:"),
    gutil.colors.yellow("gulp debug")
  )
  gutil.log(
    gutil.colors.green("[Step 3]:"),
    gutil.colors.yellow("gulp dist")
  )
  gutil.log(
    gutil.colors.green("[Step 4]:"),
    gutil.colors.yellow("gulp upload")
  )
  gutil.log(
    gutil.colors.green("[Info]:"),
    gutil.colors.yellow("If any error, plase try again!")
  );
});
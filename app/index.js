'use strict';
var yeoman = require('yeoman-generator');
var yosay = require('yosay');

var _templates = [];//存放模版列表key
var _templatesPaths = [];//模版数据

var GodzillaGenerator = yeoman.generators.Base.extend({
  //初始化文件，获取模版列表
  initializing: function () {
    this.pkg = require('../package.json');
    this.config = this.fs.readJSON(this.templatePath("src/config.json"));
    if(this.config != null){
      var _templatesList = this.config.package;
      for(var i=0;i<_templatesList.length;i++){
        var _tmpPackage = _templatesList[i];
        var indexKey = i + 1;
        var _tmpKey = indexKey +"."+ _tmpPackage.name;
        var _tmpObject = {
          index:indexKey,
          path:_tmpPackage
        }
        _templates.push(_tmpKey);
        _templatesPaths.push(_tmpObject);
      }
    }
  },
  //相关用户参数
  prompting: function () {
    var done = this.async();
    this.log(yosay(
      'Welcome to use Godzilla Project build tools!\n Support By Roninliu\r version 1.1.3'
    ),{maxLength:100});
    var prompts = [
      {
        type:"input",
        name:"projectName",
        message:"Please enter your project name?",
        default:this.appname.replace(/\s+/g,"-")
      },
      {
        type:"input",
        name:"author",
        message:"Please enter your name?",
        default:"Godzilla"
      },
      {
        type:"confirm",
        name:"gulpenable",
        message:"Enable gulp.js compiled file",
        default:true
      },
      {
        type:"list",
        name:"category",
        message:"Please select the type you want to create a template?",
        choices:_templates,
        filter:function(val){
          var type = parseInt(val.slice(0, val.indexOf(".")).toLowerCase().replace(/\s+/g,""));
          if(isNaN(type)){
            type = 1;
          }
          return type;
        }
      }
    ];
    this.prompt(prompts, function (props) {
      this.projectName = props.projectName;
      this.author = props.author;
      this.version = "0.1.0";
      this.category = props.category;
      this.gulpenable = props.gulpenable;
      done();
    }.bind(this));
  },
  //写入文件
  writing: {
    app: function () {
      if(this.gulpenable){
        this.dest.mkdir("src");//开发目录
        this.dest.mkdir("debug");//debug目录
        this.dest.mkdir("dist");//正式目录
        this.template('_gulpfile.js', 'gulpfile.js');
        this.template('_package.json', 'package.json');
        for(var i=0;i<_templatesPaths.length;i++){
          if(this.category == _templatesPaths[i].index){
            var _currentTemplate = _templatesPaths[i].path.path;
            for(var j=0;j<_currentTemplate.length;j++){
              var file = _currentTemplate[j];
              var local = file.slice(file.indexOf("/")+1,file.length);
              if(local.indexOf(".") < 0){
                this.dest.mkdir("src/"+local);
              }else{
                this.template(this.templatePath("src/"+ file), this.destinationPath("src/"+local));
              }
            }
          }
        }
      }else{
        for(var i=0;i<_templatesPaths.length;i++){
          if(this.category == _templatesPaths[i].index){
            var _currentTemplate = _templatesPaths[i].path.path;
            for(var j=0;j<_currentTemplate.length;j++){
              var file = _currentTemplate[j];
              var local = file.slice(file.indexOf("/")+1,file.length);
              if(local.indexOf(".") < 0){
                this.dest.mkdir(local);
              }else{
                this.template(this.templatePath("src/"+ file), this.destinationPath(local));
              }
            }
          }
        }
      }
    },
    projectfiles: function () {}
  },

  install: function () {
    if(this.gulpenable){
      this.installDependencies({
         skipInstall: this.options['skip-install'],
         bower:false
      });
    }
  }
});

module.exports = GodzillaGenerator;

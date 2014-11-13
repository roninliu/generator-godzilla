'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');




var GodzillaGenerator = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../package.json');
  },

  prompting: function () {
    var done = this.async();
    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to use project build tools of the Godzilla Generator!\n Support By Roninliu'
    ),{maxLength:100});
    var prompts = [
      {
        type:"input",
        name:"projectName",
        message:"Please enter your project name?",
        default:this.appname
      },
      {
        type:"input",
        name:"author",
        message:"Please enter your name?",
        default:"Godzilla"
      },
      {
        type:"input",
        name:"version",
        message:"Please enter your project version?",
        default:"0.0.1"
      },
      {
        type:"list",
        name:"category",
        message:"Please select the type you want to create a template?",
        choices:[
          "1.PC Template",
          "2.Mobile Template",
          "3.Blank Template"
        ],
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
      this.version = props.version;
      this.category = props.category;
      done();
    }.bind(this));
  },

  writing: {
    app: function () {
      this.dest.mkdir('src');
      this.dest.mkdir('dist');
      this.dest.mkdir('src/css');
      this.dest.mkdir('src/img');
      this.dest.mkdir("src/js");
      this.dest.mkdir("src/slice");
      switch(this.category){
        case 1:
          this.template('src/_index_1.html', 'src/index.html');
          this.template('src/css/_style.css', 'src/css/<%= projectName%>.css');
          this.template('src/js/_common.js', 'src/js/<%= projectName%>.js');
        break;
        case 2:
          this.template('src/_index_2.html', 'src/index.html');
          this.template('src/css/_style.css', 'src/css/<%= projectName%>.css');
          this.template('src/js/_common.js', 'src/js/<%= projectName%>.js');
        break
        default:
          this.template('src/_index_3.html', 'src/index.html');
          this.template('src/css/_style_3.css', 'src/css/<%= projectName%>.css');
          this.template('src/css/_reset.import.css', 'src/css/reset.import.css');
          this.template('src/js/_common.js', 'src/js/<%= projectName%>.js');
      }
      this.template('_README.md', 'README.md');
      this.template('_gulpfile.js', 'gulpfile.js');
      this.template('_package.json', 'package.json');
      this.template('_bower.json', 'bower.json');
    },

    projectfiles: function () {
      //this.src.copy('editorconfig', '.editorconfig');
      //this.src.copy('jshintrc', '.jshintrc');
    }
  },

  end: function () {
    this.installDependencies();
  }
});

module.exports = GodzillaGenerator;

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
      'Welcome to use the  Godzilla generator!'
    ));
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
        default:"Roninliu"
      },
      {
        type:"input",
        name:"version",
        message:"Please enter your project version?",
        default:"0.0.1"
      }
    ];

    this.prompt(prompts, function (props) {
      this.projectName = props.projectName;
      this.author = props.author;
      this.version = props.version;
      this.someOption = props.someOption;
      done();
    }.bind(this));
  },

  writing: {
    app: function () {
      this.dest.mkdir('src');
      this.dest.mkdir('build');
      this.dest.mkdir('test');
      this.dest.mkdir('src/css');
      this.dest.mkdir('src/img');
      this.dest.mkdir("src/js");
      this.dest.mkdir("src/img/slice");



      this.template('src/_index.html', 'src/index.html');
      this.template('src/css/style.css', 'src/css/<%= projectName%>.css');
      this.template('src/js/common.js', 'src/js/<%= projectName%>.js');
      
      this.template('_README.md', 'README.md');
      this.template('_gulpfile.js', 'gulpfile.js');
      this.template('_package.json', 'package.json');
      this.template('_bower.json', 'bower.json');
    },

    projectfiles: function () {
      this.src.copy('editorconfig', '.editorconfig');
      this.src.copy('jshintrc', '.jshintrc');
    }
  },

  end: function () {
    this.installDependencies();
  }
});

module.exports = GodzillaGenerator;

/* eslint-disable */
var gulp = require('gulp');
var sass = require('gulp-sass');
var size = require('gulp-size');
var util = require('gulp-util');
var copy = require('gulp-copy');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var webpack = require('webpack-stream');
var generateWebpackConfig = require('./webpack.config.js');
var eslint = require('gulp-eslint');
var scsslint = require('gulp-scss-lint');
var serve = require('gulp-serve');
var fs = require('fs');

// pull the build environment from the '--type <foo>' arg
var environment = util.env.type || 'development';

var buildDir = './build/';
var srcDir = './src/';
var htmlEntry = 'index.html';
var htmlEntryFull = srcDir + htmlEntry;
var htmlArtifact = 'index.html';
var htmlArtifactFull = buildDir + htmlArtifact;
var jsEntry = 'entrypoint.js';
var jsEntryFull = srcDir + jsEntry;
var jsxArtifact = 'app.js';
var jsxArtifactFull = buildDir + jsxArtifact;
var scssEntry = 'entrypoint.scss';
var scssEntryFull = srcDir + scssEntry;
var scssArtifact = 'app.css';
var scssArtifactFull = buildDir + scssArtifact;

var webpackConfig = generateWebpackConfig(jsEntryFull, jsxArtifact);

function fsExistsSync(filePath) {
  try {
    var stats = fs.statSync(filePath);
    return true;
  } catch (err) {
    return false;
  }
}

function doWebpack(config) {
  return gulp.src(config.entry)
    .pipe(webpack(config))
    .pipe(environment === 'production' ? uglify() : util.noop())
    .pipe(gulp.dest(buildDir))
    .pipe(size({title: 'js'}))
    ;
}

var taskFuncs = {
  'setup-build': function() {
    if (!fsExistsSync(buildDir)) {
      fs.mkdirSync(buildDir);
    }
  },
  'clean-html': function() {
    if (fsExistsSync(htmlArtifactFull)) fs.unlinkSync(htmlArtifactFull);
  },
  'clean-jsx': function() {
    if (fsExistsSync(jsxArtifactFull)) fs.unlinkSync(jsxArtifactFull);
  },
  'clean-scss': function() {
    if (fsExistsSync(scssArtifactFull)) fs.unlinkSync(scssArtifactFull);
  },
  'compile-html': function() {
    gulp.src(htmlEntryFull).pipe(copy(buildDir, {prefix: 1}));
  },
  'compile-jsx': function() {
    return doWebpack(webpackConfig.getConfig(environment));
  },
  'compile-scss': function() {
    return gulp.src(scssEntryFull)
      .pipe(sass({
         includePaths: [
           './node_modules/bootstrap-sass/assets/stylesheets'
         ]
      }).on('error', sass.logError))
      .pipe(rename(scssArtifact))
      .pipe(gulp.dest(buildDir))
      .pipe(size({title: 'css'}))
      ;
  },
  'watch-html': function() {
    return gulp.watch([srcDir + '**/*.html'], ['compile-html']);
  },
  'watch-jsx': function() {
    var config = webpackConfig.getConfig(environment);
    config.watch = true;
    return doWebpack(config);
  },
  'watch-scss': function() {
    return gulp.watch([srcDir + '**/*.scss'], ['compile-scss']);
  },
  'lint-jsx': function() {
    return gulp.src(['src/**/*.{js,jsx}', '!node_modules/**'])
      .pipe(eslint())
      .pipe(eslint.format())
      .pipe(eslint.failAfterError())
      ;
  },
  'lint-scss': function() {
    return gulp.src(['src/**/*.scss'])
      .pipe(scsslint())
    ;
  },
  'serve': function() {
    return serve(buildDir)();
  }
};

gulp.task('setup-build', taskFuncs['setup-build']);

gulp.task('clean-html', ['setup-build'], taskFuncs['clean-html']);
gulp.task('clean-jsx', ['setup-build'], taskFuncs['clean-jsx']);
gulp.task('clean-scss', ['setup-build'], taskFuncs['clean-scss']);
gulp.task('clean', ['clean-html', 'clean-jsx', 'clean-scss']);

gulp.task('compile-html', ['setup-build'], taskFuncs['compile-html']);
gulp.task('compile-jsx', ['setup-build'], taskFuncs['compile-jsx']);
gulp.task('compile-scss', ['setup-build'], taskFuncs['compile-scss']);
gulp.task('compile', ['compile-html', 'compile-jsx', 'compile-scss']);

gulp.task('watch-html', ['compile-html'], taskFuncs['watch-html']);
gulp.task('watch-jsx', taskFuncs['watch-jsx']);
gulp.task('watch-scss', ['compile-scss'], taskFuncs['watch-scss']);
gulp.task('watch', ['watch-html', 'watch-jsx', 'watch-scss']);

gulp.task('lint-jsx', taskFuncs['lint-jsx']);
gulp.task('lint-scss', taskFuncs['lint-scss']);
gulp.task('lint', ['lint-jsx', 'lint-scss']);

gulp.task('serve', taskFuncs['serve']);

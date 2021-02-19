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
var jsArtifact = 'app.js';
var jsArtifactFull = buildDir + jsArtifact;
var scssEntry = 'entrypoint.scss';
var scssEntryFull = srcDir + scssEntry;
var scssArtifact = 'app.css';
var scssArtifactFull = buildDir + scssArtifact;

var webpackConfig = generateWebpackConfig(jsEntryFull, jsArtifact);

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
  'clean-js': function() {
    if (fsExistsSync(jsArtifactFull)) fs.unlinkSync(jsArtifactFull);
  },
  'clean-scss': function() {
    if (fsExistsSync(scssArtifactFull)) fs.unlinkSync(scssArtifactFull);
  },

  'build-assets': function() {
    gulp.src('assets/*').pipe(copy(buildDir));
  },

  'compile-html': function() {
    gulp.src(htmlEntryFull).pipe(copy(buildDir, {prefix: 1}));
  },
  'copy-libs': function() {
    gulp.src('lib/crafty.js')
      .pipe(copy(buildDir, {prefix: 1}));
  },
  'compile-js': function() {
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
  'watch-js': function() {
    var config = webpackConfig.getConfig(environment);
    config.watch = true;
    return doWebpack(config);
  },
  'watch-scss': function() {
    return gulp.watch([srcDir + '**/*.scss'], ['compile-scss']);
  },
  'lint-js': function() {
    return gulp.src(['src/**/*.js', '!node_modules/**'])
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
gulp.task('clean-js', ['setup-build'], taskFuncs['clean-js']);
gulp.task('clean-scss', ['setup-build'], taskFuncs['clean-scss']);
gulp.task('clean', ['clean-html', 'clean-js', 'clean-scss']);

gulp.task('copy-libs', ['setup-build'], taskFuncs['copy-libs']);

gulp.task('build-assets', ['setup-build'], taskFuncs['build-assets']);
gulp.task('compile-html', ['setup-build'], taskFuncs['compile-html']);
gulp.task('compile-js', ['setup-build', 'copy-libs'], taskFuncs['compile-js']);
gulp.task('compile-scss', ['setup-build'], taskFuncs['compile-scss']);
gulp.task('compile', ['build-assets', 'compile-html', 'compile-js', 'compile-scss']);

gulp.task('watch-html', ['compile-html'], taskFuncs['watch-html']);
gulp.task('watch-js', ['compile-js'], taskFuncs['watch-js']);
gulp.task('watch-scss', ['compile-scss'], taskFuncs['watch-scss']);
gulp.task('watch', ['watch-html', 'watch-js', 'watch-scss']);

gulp.task('lint-js', taskFuncs['lint-js']);
gulp.task('lint-scss', taskFuncs['lint-scss']);
gulp.task('lint', ['lint-js', 'lint-scss']);

gulp.task('serve', taskFuncs['serve']);

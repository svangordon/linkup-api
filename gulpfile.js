var gulp        = require('gulp'),
    gutil       = require('gulp-util'),
    jshint      = require('gulp-jshint')
    sourcemaps  = require('gulp-sourcemaps'),
    concat      = require('gulp-concat'),
    babel       = require('gulp-babel'),
    data        = require('gulp-data'),
    stylus      = require('gulp-stylus'),
    htmlmin     = require('gulp-htmlmin'),
    del         = require('del'),
    es          = require('event-stream'),
    nodemon     = require('gulp-nodemon'),
    Cache       = require('gulp-file-cache');

const cache = new Cache();

const paths = {
  scripts: ['./src/**/*.js']
};

gulp.task('default', ['clean'], () => {
  gulp.start('dev', 'compile');
});

gulp.task('clean', () => {
  return del(['dist']);
});

gulp.task('dev', ['compile'], () => {
  const stream = nodemon({
    script: 'dist/server.js'
    , env: {'NODE_ENV': 'development'}
    , ext: 'js'
    , watch: 'src'
    , tasks: ['compile']
  });
  return stream;
})

gulp.task('compile', () => {
  const stream = gulp.src(paths.scripts)
      .pipe(sourcemaps.init())
      // .pipe(cache.filter())
      .pipe(babel({
        presets: ['es2015']
      }))
      // .pipe(cache.cache())
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('dist'));

  return stream // forces compile to by synchronous
});

gulp.task('watch', () => {
  gulp.watch([paths.scripts, paths.json], ['build-server'])
});

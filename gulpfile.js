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
    es          = require('event-stream');

const paths = {
  scripts: ['src/**/*.js']
};

gulp.task('default', ['watch', 'build-server']);

gulp.task('clean', () => {
  return del(['build'])
});

gulp.task('build-server', () => {
  return gulp.src(paths.scripts)
      .pipe(sourcemaps.init())
      .pipe(babel({
        presets: ['es2015']
      }))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('build');
  }
);

gulp.task('watch', () => {
  gulp.watch([paths.scripts, paths.json], ['build-server'])
});

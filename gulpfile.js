import gulp from 'gulp';
import { deleteAsync as del } from 'del'; // Correct import for del in ESM
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import ngHtml2Js from 'gulp-ng-html2js';
import minifyHtml from 'gulp-minify-html';
import css2js from 'gulp-css2js';
import gulpSass from 'gulp-sass'; // Import gulp-sass
import sassCompiler from 'sass'; // Import the sass compiler (Dart Sass)
import autoprefixer from 'gulp-autoprefixer'; // Import autoprefixer

const sass = gulpSass(sassCompiler);  // Initialize gulp-sass with the sass compiler

// Define Sass options
const sassOptions = {
  indentWidth: 4,
  outputStyle: 'expanded',
  errorLogToConsole: true,
};

// Define Autoprefixer options
const autoprefixerOptions = {
  browsers: [
    '> 1%',
    'last 2 versions',
    'firefox >= 4',
    'safari 7',
    'safari 8',
    'IE 9',
    'IE 10',
    'IE 11',
  ],
};

// HTML to JS task
gulp.task('html2js', function () {
  return gulp.src(['./src/*.html'])
    .pipe(minifyHtml())
    .pipe(ngHtml2Js({
      moduleName: 'ionic-datepicker.templates',
    }))
    .pipe(concat('templates.js'))
    .pipe(gulp.dest('./dist'));
});

// CSS to JS task
gulp.task('css2js', function () {
  return gulp.src('./src/**/ionic-datepicker.styles.scss')
    .pipe(concat('ionic-datepicker.styles.css'))
    .pipe(sass(sassOptions).on('error', sass.logError))  // Use the sass compiler here
    .pipe(autoprefixer(autoprefixerOptions))  // Apply autoprefixer here
    .pipe(css2js())
    .pipe(uglify())
    .pipe(gulp.dest('./dist/'));
});

// Delete dist files task
gulp.task('del', function () {
  return del(['./dist/*']);
});

// Make bundle task
gulp.task('make-bundle', gulp.series('del', 'html2js', 'css2js', function () {
  return gulp.src(['./dist/*', './src/*.js'])
    .pipe(concat('ionic-datepicker.bundle.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/'));
}));

// Delete temporary files task
gulp.task('del-temp-files', gulp.series('make-bundle', function () {
  return del(['./dist/templates.js', './dist/ionic-datepicker.styles.js']);
}));

// Build task
gulp.task('build', gulp.series('del-temp-files'));

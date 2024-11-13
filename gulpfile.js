import gulp from 'gulp';
import { deleteAsync as del } from 'del'; // Correct import for del in ESM
import fs from 'fs';
import sass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';
import del from 'del';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import ngHtml2Js from 'gulp-ng-html2js';
import minifyHtml from 'gulp-minify-html';
import css2js from 'gulp-css2js';

const sassOptions = {
  indentWidth: 4,
  outputStyle: 'expanded',
  errorLogToConsole: true
};

const autoprefixerOptions = {
  browsers: [
    '> 1%',
    'last 2 versions',
    'firefox >= 4',
    'safari 7',
    'safari 8',
    'IE 9',
    'IE 10',
    'IE 11'
  ]
};

// Ensure dist directory exists
if (!fs.existsSync('./dist')) {
  fs.mkdirSync('./dist');
}

gulp.task('html2js', function () {
  return gulp.src(['./src/*.html'])
    .pipe(minifyHtml())
    .pipe(ngHtml2Js({ moduleName: "ionic-datepicker.templates" }))
    .pipe(concat("templates.js"))
    .pipe(gulp.dest("./dist"));
});

gulp.task('css2js', function () {
  return gulp.src("./src/**/ionic-datepicker.styles.scss")
    .pipe(concat("ionic-datepicker.styles.css"))
    .pipe(sass(sassOptions).on('error', sass.logError))
    .pipe(autoprefixer(autoprefixerOptions))
    .pipe(css2js())
    .pipe(uglify())
    .pipe(gulp.dest("./dist/"));
});

gulp.task('make-bundle', gulp.series('del', 'html2js', 'css2js', function () {
  return gulp.src(['./dist/*', './src/*.js'])
    .pipe(concat('ionic-datepicker.bundle.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/'));
}));

gulp.task('del-temp-files', gulp.series('make-bundle', function () {
  return del(['./dist/templates.js', './dist/ionic-datepicker.styles.js']);
}));

gulp.task('del', function () {
  return del(['./dist/*']);
});

gulp.task('build', gulp.series('del-temp-files', function(done) {
  console.log("Building...");
  console.log("Current directory:", process.cwd());
  console.log("Listing files in dist:", fs.readdirSync('./dist'));
  done();
}));

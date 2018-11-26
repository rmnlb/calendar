'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify-es').default;
const imagemin = require('gulp-imagemin');
const autoprefixer = require('gulp-autoprefixer');

gulp.task('sass', () => {
    return gulp.src('./src/style/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('./public/style'));
});

gulp.task('sass:watch', () => {
    gulp.watch('./src/style/**/*.scss', ['sass']);
});

gulp.task("uglify", () => {
    return gulp.src("./src/script/*.js")
        .pipe(uglify())
        .pipe(gulp.dest("./public/script"));
});

gulp.task('img', () =>
    gulp.src('./src/images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./public/images'))
);

gulp.task('build', ['sass', 'uglify', 'img']);
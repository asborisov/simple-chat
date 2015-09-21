'use strict';

var gulp = require('gulp');
// SASS preprocessor
var sass = require('gulp-sass');
// Concatenation
var concat = require('gulp-concat');
// JS minify
var uglify = require('gulp-uglify');
// JS validation
var jshint = require('gulp-jshint');

// SASS preprocessing
gulp.task('sass', function () {
	return gulp.src('scss/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('dist'));
});
// JS minify
gulp.task('uglify:front', function () {
	return gulp.src(['src/*.js'])
		.pipe(jshint())
		.pipe(concat('main.js'))
		.pipe(uglify())
		.pipe(gulp.dest('dist'));
});
gulp.task('uglify:server', function () {
	return gulp.src(['server.js'])
		.pipe(jshint())
		.pipe(uglify())
		.pipe(gulp.dest('dist'));
});
// Copy index.html
gulp.task('html', function () {
	return gulp.src(['index.html'])
		.pipe(gulp.dest('dist'));
});
// Default task
gulp.task('default', ['html', 'sass', 'uglify:front', 'uglify:server'], function () {
});
// dev watcher
gulp.task('dev', ['server-jshint', 'html', 'sass', 'uglify'], function () {
	gulp.watch(['index.html', 'scss/*.scss', 'src/*.js', 'server.js'], ['html', 'sass', 'uglify:front', 'server-jshint']);
});
// server code validator
gulp.task('server-jshint', function () {
	return gulp.src('server.js')
		.pipe(jshint());
});
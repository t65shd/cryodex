"use strict";

// Initialize modules
// Importing specific gulp API functions lets us write them below as series() instead of gulp.series()
const { src, dest, watch, series, parallel } = require('gulp');
// Importing all the Gulp-related packages we want to use
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const gulpif = require('gulp-if');
const uglify = require('gulp-uglify');
const terser  = require('gulp-terser');
const notify  = require('gulp-notify');

function _compileJavascript(opts) {
    opts = Object.assign({}, { minify: true, sourcemaps: true, filename: false }, opts );
	return src(opts.source)
		.pipe(gulpif(opts.sourcemaps, sourcemaps.init()))
		.pipe(gulpif(opts.filename != false, concat(opts.filename)))
		.pipe(terser())
		.on('error', notify.onError({
			message: "<%= error.toString() %>",
			title: "Terser JS Error"
		}))
		.pipe(gulpif(opts.minify, uglify()))
        .pipe(gulpif(opts.sourcemaps, sourcemaps.write('.')))
		.pipe(dest(opts.destination));
}

exports.compile = _compileJavascript;
"use strict";

// Initialize modules
// Importing specific gulp API functions lets us write them below as series() instead of gulp.series()
const { src, dest, watch, series, parallel } = require('gulp');
// Importing all the Gulp-related packages we want to use
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const gulpif = require('gulp-if');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const rename = require('gulp-rename');

function _compileSass(opts) {
    opts = Object.assign({}, { minify: true, sourcemaps: true, rename: false }, opts );
    return src(opts.source)
        .pipe(gulpif(opts.sourcemaps, sourcemaps.init()))
        .pipe(sass({ outputStyle: 'normal', includePaths: opts.paths }))
        .pipe(gulpif(opts.minify, postcss([ autoprefixer(), cssnano() ])))
        .pipe(gulpif(!opts.minify, postcss([ autoprefixer() ])))
        .pipe(gulpif(opts.rename != false, rename({ suffix: opts.rename })))
        .pipe(gulpif(opts.sourcemaps, sourcemaps.write('.')))
        .pipe(dest(opts.destination)
    );
}


exports.compile = _compileSass;
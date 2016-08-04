/// <binding BeforeBuild='build' ProjectOpened='default' />
/*
This file in the main entry point for defining Gulp tasks and using Gulp plugins.
Click here to learn more. http://go.microsoft.com/fwlink/?LinkId=518007
*/

var $ = require('gulp-load-plugins')();
var polyfill = require('es6-promise').polyfill();
var argv = require('yargs').argv;
var gulp = require('gulp');
var sequence = require('run-sequence');
var cleanCSS = require('gulp-clean-css');

var paths = {
	javascript: [
		'./js/jquery.cryodex.js'
	],
	scss: "./scss/*.scss"
};

// Browsers to target when prefixing CSS.
var COMPATIBILITY = ['last 2 versions', 'ie >= 9'];

gulp.task('sass', function () {
	var minifycss = cleanCSS({ compatibility: 'ie8' });

	gulp.src(paths.scss)
		.pipe($.sass())
		.pipe($.autoprefixer({ browsers: COMPATIBILITY }))
		.pipe(gulp.dest("./css"));

	gulp.src(paths.scss)
		.pipe($.sass())
		.pipe($.autoprefixer({ browsers: COMPATIBILITY }))
		.pipe(minifycss)
		.pipe($.rename({ suffix: '.min' }))
		.pipe(gulp.dest("./css"));
});

gulp.task('javascript', function () {
	gulp.src('./js/jquery.cryodex.js')
		.pipe($.sourcemaps.init())
		.pipe($.uglify())
		.pipe($.rename({ suffix: '.min' }))
		.pipe(gulp.dest('./js'));
		
	gulp.src(['./node_modules/chart.js/dist/Chart.bundle.js', './js/jquery.cryodex.js'])
		.pipe($.sourcemaps.init())
		.pipe($.concat('jquery.cryodex.bundle.js'))
		.pipe(gulp.dest('./js'));
		
	gulp.src(['./node_modules/chart.js/dist/Chart.bundle.js', './js/jquery.cryodex.js'])
		.pipe($.sourcemaps.init())
		.pipe($.concat('jquery.cryodex.bundle.min.js'))
		.pipe($.uglify())
		.pipe(gulp.dest('./js'));
});

// Build task
// Runs copy then runs sass & javascript in parallel
gulp.task('build', function (done) {
	sequence(['sass', 'javascript'], done);
});

// Default
gulp.task('default', function (done) {
	sequence(['build'], done);
});
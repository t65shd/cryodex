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
	sass: [
		'node_modules/foundation-sites/scss',
		'node_modules/motion-ui/src',
		'node_modules/font-awesome/scss',
		'bower_components/weather-icons/sass'
	],
	javascript: [
		'./js/jquery.cryodex.js'
	],
	scss: "./scss/jquery.cryodex.sample.scss"
};

// Browsers to target when prefixing CSS.
var COMPATIBILITY = ['last 2 versions', 'ie >= 9'];

gulp.task('sass', function () {
	var minifycss = cleanCSS({ compatibility: 'ie8' });

	gulp.src(paths.scss)
		.pipe($.sass({ includePaths: paths.sass }).on('error', $.sass.logError))
		.pipe($.autoprefixer({ browsers: COMPATIBILITY }))
		.pipe(gulp.dest("./css"));

	gulp.src(paths.scss)
		.pipe($.sass({ includePaths: paths.sass }).on('error', $.sass.logError))
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

gulp.task('watch', ['build'], function (done) {
	sequence(['sass:watch', 'javascript:watch'], done);
});

gulp.task('sass:watch', function (done) {
	gulp.watch('./scss/*.scss', ['sass']);
});

gulp.task('javascript:watch', function (done) {
	gulp.watch('./js/jquery.cryodex.js', ['javascript']);
});

// Default
gulp.task('default', function (done) {
	sequence(['build'], done);
});
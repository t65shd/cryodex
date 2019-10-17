// Initialize modules
// Importing specific gulp API functions lets us write them below as series() instead of gulp.series()
const { src, dest, watch, series, parallel } = require('gulp');
const scss = require('./gulp-tasks/scss');
const js = require('./gulp-tasks/javascript');

var paths = {
	sass: [
		'node_modules/foundation-sites/scss',
		'node_modules/motion-ui/src',
		'node_modules/font-awesome/scss',
		'node_modules/weathericons/sass'
	],
	javascript: [
		'./js/jquery.cryodex.js'
	],
	scss: "./scss/jquery.cryodex.sample.scss"
};

const sass = series(
	() => scss.compile({
			source: './scss/jquery.cryodex.sample.scss',
			paths: paths.sass,
			destination: './css',
			minify: false
		}),
	() => scss.compile({
			source: './scss/jquery.cryodex.sample.scss',
			paths: paths.sass,
			destination: './css',
			rename: '.min'
		})
);

const javascript = series (
	() => js.compile({
			source: './js/jquery.cryodex.js',
			destination: './js',
			filename: 'jquery.cryodex.min.js'
		}),
	() => js.compile({
			source: ['./node_modules/chart.js/dist/Chart.bundle.js', './js/jquery.cryodex.js'],
			destination: './js',
			filename: 'jquery.cryodex.bundle.js',
			minify: false
		}),
	() => js.compile({
			source: ['./node_modules/chart.js/dist/Chart.bundle.js', './js/jquery.cryodex.js'],
			destination: './js',
			filename: 'jquery.cryodex.bundle.min.js'
		})
);

/*
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
*/

function watchSass() {
	watch('./scss/*.scss', sass);
}

function watchJs() {
	watch('./js/jquery.cryodex.js', javascript)
}

exports.build = parallel(sass, javascript);
exports.sass = sass;
exports.js = javascript;
exports.watch = series(parallel(sass, javascript), parallel(watchSass, watchJs));

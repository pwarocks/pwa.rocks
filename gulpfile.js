const autoprefixer = require('autoprefixer');
const beml = require('gulp-beml');
const csso = require('postcss-csso');
const del = require('del');
const gulp = require('gulp');
const hash = require('hash-files');
const htmlmin = require('gulp-htmlmin');
const postcss = require('gulp-postcss');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const sass = require('gulp-sass');
const sync = require('browser-sync').create();

const shortHash = function(files) {
	return hash.sync({
		files: files
	}).slice(0, 8);
};

gulp.task('clean', () => {
	return del('dest/**/*');
});

gulp.task('cache', ['copy'], () => {
	const assetsHash = shortHash([
		'dest/favicon.ico',
		'dest/screen.css',
		'dest/fonts/*',
		'dest/images/*',
	]);

	gulp.src('dest/service-worker.js')
		.pipe(replace(
			/(const HASH = ')(';)/g,
			'$1' + assetsHash + '$2'
		))
		.pipe(replace(
			/('\/)(screen)(\.css',)/g,
			'$1' + assetsHash + '$3'
		))
		.pipe(rename(function(path) {
			path.basename = assetsHash;
		}))
		.pipe(gulp.dest('dest/'));

	gulp.src('dest/index.html')
		.pipe(replace(
			/(<link rel="stylesheet" href="\/)(screen)(\.css">)/g,
			'$1' + assetsHash + '$3'
		))
		.pipe(replace(
			/(\/)(service-worker)(\.js)/g,
			'$1' + assetsHash + '$3'
		))
		.pipe(gulp.dest('dest/'));

	gulp.src('dest/screen.css')
		.pipe(rename(function(path) {
			path.basename = assetsHash;
		}))
		.pipe(gulp.dest('dest/'));

	return del([
		'dest/screen.css',
		'dest/service-worker.js'
	]);
});

gulp.task('styles', () => {
	return gulp.src('src/styles/screen.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(postcss([
			autoprefixer,
			csso
		]))
		.pipe(gulp.dest('dest'))
		.pipe(sync.stream());
});

gulp.task('html', () => {
	return gulp.src('src/index.html')
		.pipe(beml({
			elemPrefix: '__',
			modPrefix: '--' }))
		.pipe(htmlmin({
			removeComments: true,
			collapseWhitespace: true
		}))
		.pipe(gulp.dest('dest'))
		.pipe(sync.stream());
});

gulp.task('copy', ['clean'], () => {
	return gulp.src('src/assets/**', { dot: true })
		.pipe(gulp.dest('dest'))
		.pipe(sync.stream({ once: true }));
});

gulp.task('server', () => {
	sync.init({
		notify: false,
		server: {
			baseDir: 'dest'
		},
		rewriteRules: [{
			match: /location\.href = 'https:\/\/pwa\.rocks\/';/,
			replace: '// Redirect removed during development.'
		}]
	});
});

gulp.task('watch', () => {
	gulp.watch('src/styles/*.scss', ['styles']);
	gulp.watch('src/index.html', ['html']);
	gulp.watch('src/assets/**', ['copy']);
});

gulp.task('build', [
	'clean',
	'styles',
	'html',
	'copy',
	'cache'
]);

gulp.task('default', [
	'build',
	'server',
	'watch'
]);

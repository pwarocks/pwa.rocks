const autoprefixer = require('autoprefixer');
const beml = require('gulp-beml');
const csso = require('postcss-csso');
const gulp = require('gulp');
const htmlmin = require('gulp-htmlmin');
const postcss = require('gulp-postcss');
const sass = require('gulp-sass');
const sync = require('browser-sync').create();

gulp.task('styles', () => {
	return gulp.src('src/styles/screen.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(postcss([
			autoprefixer,
			csso
		]))
		.pipe(gulp.dest('dest/styles'))
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

gulp.task('copy', () => {
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
			match: /<script>.*\n.*pwa\.rocks.*\n.*<\/script>/gm,
	        replace: ''
		}]
	});
});

gulp.task('watch', () => {
	gulp.watch('src/styles/*.scss', ['styles']);
	gulp.watch('src/index.html', ['html']);
	gulp.watch('src/assets/**', ['copy']);
});

gulp.task('build', [
	'styles',
	'html',
	'copy'
]);

gulp.task('default', [
	'build',
	'server',
	'watch'
]);

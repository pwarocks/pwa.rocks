var gulp = require('gulp'),
	sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	cssmin = require('gulp-cleancss'),
	beml = require('gulp-beml'),
	htmlmin = require('gulp-htmlmin'),
	sync = require('browser-sync').create();

gulp.task('styles', function () {
	return gulp.src('src/styles/screen.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer())
		.pipe(cssmin())
		.pipe(gulp.dest('dest/styles'))
		.pipe(sync.stream());
});

gulp.task('html', function () {
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

gulp.task('copy', function () {
	return gulp.src('src/assets/**')
		.pipe(gulp.dest('dest'))
		.pipe(sync.stream({
			once: true
		}));
});

gulp.task('server', function() {
	sync.init({
		notify: false,
		server: {
			baseDir: 'dest'
		}
	});
});

gulp.task('watch', function () {
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

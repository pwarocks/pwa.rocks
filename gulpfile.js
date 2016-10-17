const gulp = require('gulp');
const postcss = require('gulp-postcss');
const posthtml = require('gulp-posthtml');
const replace = require('gulp-replace');
const sync = require('browser-sync').create();
const uglify = require('gulp-uglify');

const assets = [
	'src/**',
	'!src/index.html',
	'!src/styles{,/**}',
	'!src/screen.css',
	'!src/script.js'
];

gulp.task('html', () => {
	return gulp.src('src/index.html')
		.pipe(replace(
			/(href="|src="|url\()([^\/].+\.(?:css|js|svg|png))/g,
			'$1/$2', { skipBinary: true }
		))
		.pipe(posthtml([
			require('posthtml-minifier')({
				removeComments: true,
				collapseWhitespace: true
			}),
			require('posthtml-postcss')([
				require('autoprefixer')(),
				require('postcss-csso')()
			]),
		]))
		.pipe(gulp.dest('dest'))
		.pipe(sync.stream());
});

gulp.task('styles', () => {
	return gulp.src('src/screen.css')
		.pipe(postcss([
			require('postcss-import')(),
			require('autoprefixer')(),
			require('postcss-csso')()
		]))
		.pipe(gulp.dest('dest'))
		.pipe(sync.stream());
});

gulp.task('scripts', () => {
	return gulp.src('src/script.js')
		.pipe(uglify())
		.pipe(gulp.dest('dest'))
		.pipe(sync.stream());
});

gulp.task('copy', () => {
	return gulp.src(assets)
		.pipe(gulp.dest('dest'))
		.pipe(sync.stream({ once: true }));
});

gulp.task('server', () => {
	sync.init({
		notify: false,
		server: {
			baseDir: 'dest'
		}
	});
});

gulp.task('watch', () => {
	gulp.watch('src/index.html', ['html']);
	gulp.watch('src/styles/*.css', ['styles']);
	gulp.watch('src/script.js', ['scripts']);
	gulp.watch(assets, ['copy']);
});

gulp.task('build', [
	'html',
	'styles',
	'scripts',
	'copy'
]);

gulp.task('default', [
	'build',
	'server',
	'watch'
]);

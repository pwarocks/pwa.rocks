const del = require('del');
const glob = require('glob');
const gulp = require('gulp');
const hash = require('hash-files');
const jsesc = require('jsesc');
const postcss = require('gulp-postcss');
const posthtml = require('gulp-posthtml');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const sync = require('browser-sync').create();
const uglify = require('gulp-uglify');

const stringify = function(value) {
	return jsesc(value, {
		wrap: true,
		compact: false,
		indentLevel: 3,
	});
};

const shortHash = function(files) {
	return hash.sync({
		files: files
	}).slice(0, 8);
};

const assets = [
	'src/**',
	'!src/index.html',
	'!src/styles{,/**}',
	'!src/screen.css',
	'!src/script.js',
];

gulp.task('clean', () => {
	return del('dest/**/*');
});

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

gulp.task('copy', ['clean'], () => {
	return gulp.src(assets)
		.pipe(gulp.dest('dest'))
		.pipe(sync.stream({ once: true }));
});

gulp.task('cache', ['copy'], () => {

	const assets = [
		'dest/favicon.ico',
		'dest/screen.css',
		...glob.sync('dest/fonts/*'),
		...glob.sync('dest/images/*'),
		...glob.sync('dest/apps/*'),
	];
	const assetsHash = shortHash(assets);
	const assetCacheList = [
		'/',
		...assets
			// Remove all `images/icon-*` files except for the one used in
			// the HTML.
			.filter(path => !path.includes('images/icon-') || path.includes('icon-228x228.png'))
			.map(path => path
				.replace(/^dest\//, '/')
				.replace('screen.css', `${assetsHash}.css`)),
	];

	gulp.src('dest/service-worker.js')
		.pipe(replace(
			'%HASH%',
			stringify(assetsHash)
		))
		.pipe(replace(
			'%CACHE_LIST%',
			stringify(assetCacheList)
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
		'dest/service-worker.js',
	]);
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
	// TODO: Figure out why uncommenting this breaks `gulp`.
	//gulp.watch(assets, ['copy', 'cache']);
});

gulp.task('build', [
	'clean',
	'html',
	'styles',
	'scripts',
	'copy',
	'cache',
]);

gulp.task('default', [
	'build',
	'server',
	'watch',
]);

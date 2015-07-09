var gulp = require('gulp'),
	less = require('gulp-less'),
	watch = require('gulp-watch'),
	path = require('path'),
	browserSync = require('browser-sync').create(),
	LessPluginCleanCSS = require('less-plugin-clean-css'),
	LessPluginAutoPrefix = require('less-plugin-autoprefix'),
	cleancss = new LessPluginCleanCSS({ advanced: true }),
	autoprefix = new LessPluginAutoPrefix({ browsers: ["last 2 versions"] });

function swallowError (error) {
    console.log(error.toString());
    this.emit('end');
}

gulp.task('less', function () {
	return gulp.src('./less/*.less')
		.pipe(less({
			plugins: [autoprefix, cleancss],
			paths: [ path.join(__dirname, 'less', 'includes') ]
		}))
		.on('error', swallowError)
		.pipe(gulp.dest('./app/css'))
		.pipe(browserSync.stream());
});

gulp.task('watch', function() {
	gulp.watch('./**/*.less', ['less']);
});

gulp.task('browser-sync', function() {
    browserSync.init({
        proxy: "localhost:8000/app/"
    });
});

gulp.task('default', ['watch']);

gulp.task('dev', ['browser-sync'], function() {
	gulp.watch('./less/*.less', ['less']);
	gulp.watch('./app/css/*.css');
	gulp.watch('./app/**/*.js').on('change', browserSync.reload);
	gulp.watch('./app/**/*.html').on('change', browserSync.reload);
});

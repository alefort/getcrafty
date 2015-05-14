var gulp = require('gulp'),
	less = require('gulp-less'),
	watch = require('gulp-watch'),
	path = require('path'),
	LessPluginCleanCSS = require('less-plugin-clean-css'),
	LessPluginAutoPrefix = require('less-plugin-autoprefix'),
	cleancss = new LessPluginCleanCSS({ advanced: true }),
	autoprefix = new LessPluginAutoPrefix({ browsers: ["last 2 versions"] });

gulp.task('less', function () {
	return gulp.src('./less/**/*.less')
		.pipe(less({
			plugins: [autoprefix, cleancss],
			paths: [ path.join(__dirname, 'less', 'includes') ]
		}))
		.pipe(gulp.dest('./app/css'));
});

gulp.task('watch', function() {
	gulp.watch('./**/*.less', ['less']);
});

gulp.task('default', ['watch']);

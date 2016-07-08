const gulp = require('gulp');
const browserify = require('gulp-browserify');
const compass = require('gulp-compass');
const insert = require('gulp-insert');
const babel = require("gulp-babel");
//const merge = require('merge-stream');
//const concat = require('gulp-concat');
const es = require('event-stream');
const ftp = require('vinyl-ftp');

gulp.task("watch", ["build"], function () {
	gulp.watch(['src/js/**/*.js'], ["build"]);
	gulp.watch(['src/css/**/*.scss'], ["build"]);
});

gulp.task("build", ['sass', 'js'], function () {

});

gulp.task("deploy", function () {
	var conn = ftp.create({
		host    : 'fincha.com',
		user    : 'f00b822d',
		password: 'wCfSmc8Luc3yLYqH',
		parallel: 10
	});

	var globs = [
		'build/**',
		'php/**',
		'mrmoney.php',
		'titan-framework-checker.php'
	];

	return gulp.src(globs, {base: '.', buffer: false})
		// .pipe( conn.newer( '/' ) ) // only upload newer files
		.pipe(conn.newerOrDifferentSize('/'))
		.pipe(conn.dest("/"));
});

gulp.task('sass', function () {
	return es.concat(
		gulp.src('src/css/**/*.scss')
			.pipe(compass({
				css  : 'build/css',
				sass : 'src/css',
				image: 'src/img'
			}))
			.pipe(gulp.dest('./build/css')),
		gulp.src('src/css/vendor/nouislider.css')
			.pipe(gulp.dest('./build/css')),
		gulp.src('src/css/vendor/jquery.qtip.min.css')
			.pipe(gulp.dest('./build/css'))
	)
});

gulp.task('js', function () {

	var fs = require("fs");
	var browserify = require("browserify");

	browserify("src/js/app.js")
		.transform("babelify", {presets: ["es2015"]})
		.bundle()
		.pipe(fs.createWriteStream("./build/js/app.js"));

	return es.concat(
		gulp.src('src/js/vendor/nouislider.min.js')
			.pipe(gulp.dest('./build/js')),
		gulp.src('src/js/vendor/jquery.colorbox-min.js')
			.pipe(gulp.dest('./build/js')),
		gulp.src('src/js/vendor/jquery.qtip.min.js')
			.pipe(gulp.dest('./build/js'))
	);
});

// define tasks here
gulp.task('default', ["build", "watch"]);
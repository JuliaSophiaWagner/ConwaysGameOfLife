const gulp = require('gulp');
const ts = require('gulp-typescript');

var paths = {
    tsSrc: '*.ts',
    tsDist: 'scripts'
}

gulp.task('ts', function () {
    return gulp.src(paths.tsSrc)
            .pipe(ts({
            target: "es2015",
            noImplicitAny: true,
            outFile: 'index.js'
        }))
        .pipe(gulp.dest(paths.tsDist));
});

gulp.task('compile', gulp.parallel(['ts']));
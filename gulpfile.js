//works 

var gulp = require('gulp');
var typescript = require('gulp-typescript');

gulp.task('typescript', function() {  
    return gulp.src('*.ts')
    .pipe(typescript({
        module: 'system',   
        target:'ES2015' 
    }))
    .pipe(gulp.dest('./dist'));
});


// didn't work
// Ich hab den Code unten nicht komplett zum rennen gebracht und habe immer den den error "try npm install gulp" bekommen

// const { src, dest, parallel } = require('gulp');
// const htmlhint = require('gulp-htmlhint');
// const debug = require('gulp-debug');
// const eslint = require('gulp-eslint');
// const uncomment = require('gulp-uncomment');
// var tslint = require('gulp-tslint');

// async function tsLint() {
//     return src('*.ts')
//         .pipe(tslint({
//             formatter: 'verbose'
//         }))
//         .pipe(tslint.report())
//         .pipe(dest('./dist'));
// }

// async function html() {
//     return src('*.html')
//         .pipe(debug({ title: 'html:' }))
//         .pipe(htmlhint())
//         .pipe(htmlhint.failOnError())
//         .pipe(dest('./dist'));
// }

// async function unComment() {
//     return src('*.js')
//         .pipe(uncomment({
//             removeEmptyLines: true
//         }))
//         .pipe(dest('./dist'));
// }

// async function copyLibs() {
//     return src('css/.css')
//         .pipe(debug({ title: 'dep :' }))
//         .pipe(dest('./dist'));
// }

// async function esLint() {
//     return src(['ts/*.js'])
//         .pipe(eslint())
//         .pipe(eslint.format())
//         .pipe(eslint.failAfterError());
// }

// exports.tslint = tsLint;
// exports.eslint = esLint;
// exports.html = html;
// exports.uncomment = unComment;
// exports.default = parallel(html, eslint, tslint, unComment);
// exports.default = parallel(typeScript);
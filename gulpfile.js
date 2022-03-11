const gulp = require('gulp');
const clean = require('gulp-clean');
const exec = require('child_process').exec;

// const devPath = '/Users/mac/test'
// const devPath = '/Users/mac/ciic-ui'
const devPath = '/Users/mac/shuzhou/ciic-ihr-pc'

gulp.task('clean', function () {
    return gulp.src([
        'dist',
        'out',
        'deployment',
    ], {
        read: false,
        allowEmpty: true
    })
        .pipe(clean());
});


gulp.task('qwer', function () {
    const sourceFiles = [
      
    ];
    const destination = 'deployment/';
    return gulp.src(sourceFiles, {
        base: "."
    }).pipe(gulp.dest(destination));
});



gulp.task('deploy:copyfiles', function () {
    const sourceFiles = [
        'LICENSE',
        'node_modules/**/*',
        'package.json',
        'README.md',
        'CHANGELOG.md',
    ];
    const destination = 'deployment/';
    return gulp.src(sourceFiles, {
        base: "."
    }).pipe(gulp.dest(destination));
});

gulp.task('dev:copyfiles', function () {
    const sourceFiles = [
        'deployment/**/*'
    ];
    const destination = devPath + '/node_modules/@ciic/core';
    return gulp.src(sourceFiles, {
        base: "./deployment"
    }).pipe(gulp.dest(destination));
});

gulp.task('publish:action', function (cb) {
    exec('npm publish ./deployment --access public');
});

//打包
gulp.task('deploy', gulp.series('deploy:copyfiles'));

//打开发包，需要自己配置开发路径
gulp.task('dev', gulp.series('deploy:copyfiles', 'dev:copyfiles'));

//自动发布
gulp.task('pub', gulp.series('clean','deploy:copyfiles', 'publish:action'));
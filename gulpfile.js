var bump = require('gulp-bump'),
    del = require('del'),
    exec = require('child_process').exec,
    gulp = require('gulp'),
    merge = require('merge2'),
    typescript = require('gulp-typescript'),
    fs = require('fs');

gulp.task('clean', function () {
    del(['dist/*']);
});

gulp.task('bump', ['clean'], function () {
    gulp.src('./package.json')
        .pipe(bump({
            type: 'patch'
        }))
        .pipe(gulp.dest('./'));
});

gulp.task('bundle', ['bump'], function () {
    var tsResult = gulp.src('src/*.ts')
        .pipe(typescript({
            module: "commonjs",
            target: "es5",
            noImplicitAny: true,
            experimentalDecorators: true,
            outDir: "dist/",
            rootDir: "src/",
            sourceMap: true,
            declaration: true,
            moduleResolution: "node",
            removeComments: false,
            lib: [
                "es2015",
                "dom"
            ],
            types: ["jasmine"]
        }));

    return merge([
        tsResult.dts.pipe(gulp.dest('dist/')),
        tsResult.js.pipe(gulp.dest('dist/'))
    ]);
});

gulp.task('copy', ['bundle'], () => {

    gulp.src(['src/adal-angular.d.ts', 'README.md', 'LICENSE'])
        .pipe(gulp.dest('dist/'));
});

gulp.task('package', ['copy'], () => {

    const pkgjson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

    delete pkgjson.scripts;

    delete pkgjson.devDependencies;

    const filepath = './dist/package.json';

    fs.writeFileSync(filepath, JSON.stringify(pkgjson, null, 2), 'utf-8');

});

gulp.task('git-add', ['package'], function (cb) {
    exec('git add -A', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});


gulp.task('git-commit', ['git-add'], function (cb) {

    var package = require('./package.json');

    exec('git commit -m "Version ' + package.version + ' release."', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

gulp.task('git-push', ['git-commit'], function (cb) {

    exec('git push', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

gulp.task('publish', ['git-push'], function (cb) {

    exec('npm publish ./dist', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});
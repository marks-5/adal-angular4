var
    bump = require('gulp-bump'),
    del = require('del'),
    exec = require('child_process').exec,
    gulp = require('gulp'),
    replace = require('gulp-replace'),
    watch = require('gulp-watch'),
    fs = require('fs');


/*
// build ./dist folder
gulp.task('default', gulp.series(
[
    'clean',
    'compile',
    'package',
    'replace'
], function () { }));

// watch for changes and rebuild ./dist folder
gulp.task('watch', gulp.series('default', function (done) {
return watch('*', function () {
    gulp.start('default');
});
}));
*/
const { series } = require('gulp');

function clean(cb) {
    del(['./dist/*', '!dist/index.js']);
    cb();
}

function compile(cb) {
    exec('npm run compile', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    })
}


function package(cb) {
    const pkgjson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
    delete pkgjson.scripts;
    delete pkgjson.devDependencies;
    const filepath = './dist/package.json';
    fs.writeFileSync(filepath, JSON.stringify(pkgjson, null, 2), 'utf-8');
    console.log('package.json Copied to Dist Directory');
    cb();
}

function copy(cb) {
    gulp.src(['adal-angular.d.ts']).pipe(gulp.dest('./dist/'));
    console.log('adal-angular.d.ts Copied to Dist Directory');
    cb();
}

function replace_d(cb) {
    gulp.src('./dist/adal.service.d.ts')
    .pipe(replace('../adal-angular.d.ts', './adal-angular.d.ts'))
    .pipe(gulp.dest('./dist/'));
    console.log('adal.service.d.ts Path Updated');
    cb();
}

function bump_version(cb) {
    gulp.src('./package.json')
    .pipe(bump({
        type: 'patch'
    }))
    .pipe(gulp.dest('./'));
    console.log('Version Bumped');
    cb();
}

function git_add(cb) {
    exec('git add -A', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
}

function git_commit(cb) {
    var package = require('./package.json');
    exec('git commit -m "Version ' + package.version + ' release."', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
}

function git_push(cb) {
    // body omitted
    cb();
}

function npm_publish(cb) {
    // body omitted
    cb();
}

exports.build = series(clean, compile, package, copy, replace_d);

exports.commit = series(clean, compile, package, copy, replace_d, bump_version, git_add, git_commit, git_push);

exports.publish = series(clean, compile, package, copy, replace_d, bump_version, git_add, git_commit, git_push, npm_publish);

/*
// 1. delete contents of dist directory


// 2. compile to dist directory


// 3. include package.json file in ./dist folder
g
// 4. include type definition file for adal-angular

// 5. rewrite type definition file path for adal-angular in adal.service.d.ts
gulp.task('replace', function (done) {
    gulp.src('./dist/adal.service.d.ts')
        .pipe(replace('../adal-angular.d.ts', './adal-angular.d.ts'))
        .pipe(gulp.dest('./dist/'));
        done();


});

// 6. increase the version in package.json
gulp.task('bump', function (done) {
    gulp.src('./package.json')
        .pipe(bump({
            type: 'patch'
        }))
        .pipe(gulp.dest('./'));
    done();
});

// 7. git add
gulp.task('git-add', function (done) {
    exec('git add -A', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
    });
    done();
});

// 8. git commit
gulp.task('git-commit', function (done) {
    var package = require('./package.json');
    exec('git commit -m "Version ' + package.version + ' release."', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
    });
    done();
});

// 9. git push
gulp.task('git-push', function (done) {
    exec('git push', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
    });
    done();
});

// publish ./dist directory to npm
gulp.task('publish', gulp.series(
    [
        'clean',
        'compile',
        'package',
        'copy',
        'replace',
        'bump',
        'git-add',
        'git-commit',
        'git-push'
    ], function (done) {
        exec('npm publish ./dist', function (err, stdout, stderr) {
            console.log(stdout);
            console.log(stderr);
            cb(err);
        });
        done();
    }));

*/
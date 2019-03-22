var gulp = require('gulp'),
    runSequence = require('run-sequence'),
    autoprefixer = require('gulp-autoprefixer'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    clean = require('gulp-clean'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    connect = require('gulp-connect'),
    replace = require('gulp-replace'),
    htmlmin = require('gulp-htmlmin'),
    livereload = require('gulp-livereload'),
    stripDebug = require('gulp-strip-debug'),
    rev = require('gulp-rev'),
    //- 对文件名加MD5后缀
    revCollector = require('gulp-rev-collector'),
    less = require('gulp-less'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    plumber = require('gulp-plumber'),
    minifycss = require('gulp-minify-css'),
    watch = require('gulp-watch');

var readline = require('readline');
var os = require('os');
var fs = require('fs');
var jsonFile = "./package.json";
var result = JSON.parse(fs.readFileSync(jsonFile));

gulp.task('publicCss', function() {
    return gulp.src('app/publicViews/css/**')
        .pipe(minifycss()) // 压缩css文件
        .pipe(gulp.dest('dist/publicViews/css/'))
        .pipe(rev())
        .pipe(gulp.dest('dist/publicViews/css/')) // 输出hash后all.css
        .pipe(rev.manifest())
        .pipe(gulp.dest('dist/rev/public/css/'));
})
gulp.task('publicJs', function() {
    gulp.src('app/scripts/aconfig.js')
        .pipe(rev())
        .pipe(gulp.dest('dist/scripts/'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('dist/rev/public/configjs/'))
    gulp.src('app/scripts/aconfig.js')
        .pipe(gulp.dest('dist/scripts/'))

    return gulp.src('app/publicViews/js/**')
        .pipe(stripDebug())
        .pipe(uglify())
        .pipe(gulp.dest('dist/publicViews/js/'))
        .pipe(rev())
        .pipe(gulp.dest('dist/publicViews/js/')) // 输出hash后all.css
        .pipe(rev.manifest())
        .pipe(gulp.dest('dist/rev/public/js/'));
})
gulp.task('publicView', ['publicCss', 'publicJs'], function() {
    gulp.src('app/publicViews/plug/**')
        .pipe(gulp.dest('dist/publicViews/plug'))
    gulp.src('app/publicViews/toast/**')
        .pipe(gulp.dest('dist/publicViews/toast'))
    gulp.src('app/publicViews/resource/**')
        .pipe(gulp.dest('dist/publicViews/resource'))
    gulp.src('app/publicViews/faq/**')
        .pipe(gulp.dest('dist/publicViews/faq'))
        .pipe(gulp.dest('dist/publicViews/faq'))
    return gulp.src('app/publicViews/*.html')
        .pipe(htmlmin({
            removeComments: true, //清除HTML注释
            collapseWhitespace: true, //压缩HTML
            collapseBooleanAttributes: true, //省略布尔属性的值 <input checked="true"/> ==> <input />
            removeEmptyAttributes: true, //删除所有空格作属性值 <input id="" /> ==> <input />
            removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
            removeStyleLinkTypeAttributes: true, //删除<style>和<link>的type="text/css"
            minifyJS: true, //压缩页面JS
            minifyCSS: true //压缩页面CSS
        }))
        .pipe(gulp.dest('dist/publicViews/'))
})
gulp.task('publicRev', ['publicView'], function() {
    return gulp.src(['dist/rev/public/**/*.json', 'dist/publicViews/**']) //- 读取 rev-manifest.json 文件以及需要进行文件名替换的文件
        .pipe(revCollector()) //- 执行文件内后缀名的替换
        .pipe(gulp.dest('dist/publicViews/'));
})

gulp.task('less', function() {
    return gulp.src('app/less/**/*.less')
        .pipe(plumber())
        .pipe(less({
            compress: true
        }))
        .on('error', function(e) {
            console.log(e);
        })
        .pipe(autoprefixer({ browsers: ['last 2 versions', 'Android >= 4.0'] }))
        .pipe(concat('all.css')) // 合并文件为all.css
        .pipe(gulp.dest('dist/css/'));

});
gulp.task('lessF', ['less'], function() {
    return gulp.src('dist/css/all.css')
        .pipe(minifycss()) // 压缩css文件
        .pipe(rev())
        .pipe(gulp.dest('dist/css/')) // 输出hash后all.css
        .pipe(rev.manifest())
        .pipe(gulp.dest('dist/rev/css/'));
});


// 开发版的脚本
gulp.task('scripts', function() {
    gulp.src('app/scripts/router-*.js')
        .pipe(clean())
    return gulp.src('app/scripts/**/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('dist/scripts'))
});
//正式脚本
gulp.task('routerClean', function() {
    return gulp.src('app/scripts/router-*.js')
        .pipe(clean())
})
gulp.task('routerRev', ['routerClean'], function() {
    return gulp.src(['dist/rev/html/*.json', 'app/scripts/router.js']) //- 读取 rev-manifest.json 文件以及需要进行文件名替换的文件
        .pipe(revCollector()) //- 执行文件内后缀名的替换
        .pipe(rev())
        .pipe(gulp.dest('app/scripts/')); //- 替换后的文件输出的目录
});
gulp.task('scriptsF', ['routerRev'], function() {
    return gulp.src(['app/scripts/**/*.js', '!app/scripts/router.js'])
        .pipe(concat('all.js'))
        .pipe(gulp.dest('dist/scripts'))
        //清除console
        .pipe(stripDebug())
        .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest('dist/scripts/'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('dist/rev/scripts/'));
});

// 文件名后缀
gulp.task('rev', function() {
    return gulp.src(['dist/rev/**/*.json', 'dist/index.html']) //- 读取 rev-manifest.json 文件以及需要进行文件名替换的文件
        .pipe(revCollector()) //- 执行文件内后缀名的替换
        .pipe(gulp.dest('dist/')); //- 替换后的文件输出的目录
});
// 图片
gulp.task('images', function() {
    return gulp.src(['app/imgs/**/**'])
        // .pipe(cache(imagemin({
        //     optimizationLevel: 3,
        //     progressive: true,
        //     interlaced: true
        // })))
        .pipe(gulp.dest('dist/imgs'));
});
//
gulp.task('icon', function() {
    return gulp.src(['app/*.ico'])
        .pipe(cache(imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest('dist'));
});
//font
gulp.task('font', function() {
    return gulp.src('app/font/**/**')
        .pipe(gulp.dest('dist/font'));
});

//bower
gulp.task('bower', function() {
    return gulp.src("bower_components/**/**/**/**")
        .pipe(gulp.dest("dist/bower_components"));
});

//html
gulp.task('index', function() {
    return gulp.src("app/*.html")
        .pipe(gulp.dest('dist/'))
});
gulp.task('views', ['index'], function() {
    return gulp.src("app/views/*.html")
        .pipe(gulp.dest('dist/views/'))
});
gulp.task('viewsF', ['index'], function() {
    return gulp.src("app/views/*.html")
        .pipe(htmlmin({
            removeComments: true, //清除HTML注释
            collapseWhitespace: true, //压缩HTML
            collapseBooleanAttributes: true, //省略布尔属性的值 <input checked="true"/> ==> <input />
            removeEmptyAttributes: true, //删除所有空格作属性值 <input id="" /> ==> <input />
            removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
            removeStyleLinkTypeAttributes: true, //删除<style>和<link>的type="text/css"
            minifyJS: true, //压缩页面JS
            minifyCSS: true //压缩页面CSS
        }))
        .pipe(rev())
        .pipe(gulp.dest('dist/views/'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('dist/rev/html/'));
})

// 清理
gulp.task('clean', function() {
    return gulp.src(['dist/*'], {
            read: false
        })
        .pipe(clean());
});

// 预设任务
gulp.task('default', ['clean'], function() {
    gulp.start('scripts', 'images', 'views', 'font');
});

gulp.task('version', function() {
    result.build++;
    fs.writeFileSync(jsonFile, JSON.stringify(result));
    var destDir = './wx-transfer-release-v' + result.version + "-" + result.build;
    fs.mkdirSync(destDir);
    // fs.mkdirSync('C:/phpStudy/PHPTutorial/WWW');
    return gulp.src('dist/**/*')
        .pipe(gulp.dest(destDir))
})
gulp.task('cleanVersion', function() {
        return gulp.src(['./wx-transfer-release*'], {
                read: false
            })
            .pipe(clean());
    })
    // 看守
gulp.task('watch', function() {


    watch('app/less/**/*.less', function() {
        gulp.start('less');
    });
    watch('app/scripts/**/*.js', function() {
        gulp.start('scripts');
    });
    watch('app/imgs/**/*', function() {
        gulp.start('images');
    });
    watch('app/font/**', function() {
        gulp.start('font');
    });
    watch('app/**/**/**/**.html', function() {
        gulp.start('views');
    });
    watch('app/index.html', function() {
        gulp.start('views');
    });
    watch('dist/**', function() {
        livereload.reload("dist/index.html");
    });

    // 看守所有.scss档
    // gulp.watch('app/less/**/*.less', ['less']);

    // // 看守所有.js档
    // gulp.watch('app/scripts/**/*.js', ['scripts']);
    // // 看守所有图片档
    // gulp.watch('app/imgs/**/*', ['images']);
    // //看守所有字体
    // gulp.watch('app/font/**', ['font']);

    // // 看守所有的页面
    // gulp.watch('app/**/**/**/**.html', ['views']);
    // //看守首页
    // gulp.watch('app/index.html', ['views']);

    // 建立即时重整伺服器
    var webServer = livereload();

    // 看守所有位在 dist/  目录下的档案，一旦有更动，便进行重整

    // gulp.watch(['dist/**']).on('change', function(file) {
    //     livereload.reload("dist/index.html");
    // });

});
gulp.task('env', function() {
    var fReadName = process.env.MODE_ENV == "production" ? './config/prod.env.js' : './config/test.env.js';
    var fWriteName = './app/scripts/aconfig.js';
    var fRead = fs.createReadStream(fReadName);
    var fWrite = fs.createWriteStream(fWriteName);
    var objReadline = readline.createInterface({
        input: fRead,
        // 这是另一种复制方式，这样on('line')里就不必再调用fWrite.write(line)，当只是纯粹复制文件时推荐使用
        // 但文件末尾会多算一次index计数   sodino.com
        //  output: fWrite, 
        //  terminal: true
    });
    objReadline.on('line', (line) => {
        fWrite.write(line + os.EOL); // 下一行
    });

    objReadline.on('close', () => {
        // console.log('readline close...');
    });
})

gulp.task('build', function(done) {
    process.env.MODE_ENV = "develop";
    runSequence(['env'], ['images'], ['font'], ['bower'], ['views'], ['scripts'], ['less'], ['icon'], ['publicView'], done);
});
gulp.task('test', function(done) {
    process.env.MODE_ENV = "test";
    runSequence(['env'], ['clean'], ['images'], ['font'], ['bower'], ['viewsF'], ['scriptsF'], ['lessF'], ['icon'], ['rev'], ['publicRev'], ["cleanVersion"], ["version"], done);
});
gulp.task('buildF', function(done) {
    process.env.MODE_ENV = "production";
    runSequence(['env'], ['clean'], ['images'], ['font'], ['bower'], ['viewsF'], ['scriptsF'], ['lessF'], ['icon'], ['rev'], ['publicRev'], ["cleanVersion"], ["version"], done);
});


// 启动服务
gulp.task('serve', ['build'], function() {
    connect.server({
        root: 'dist',
        prot: '8081',
        livereload: true
    });
});
// gulp.task('serve', ['build', 'watch'], function() {
//     connect.server({
//         root: 'dist',
//         prot: '8081',
//         livereload: true
//     });
// });
const { src, dest, lastRun, series, parallel, watch } = require('gulp');
const server = require('browser-sync').create();
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const imagemin = require('gulp-imagemin');
const imagemin_options = [
    imagemin.gifsicle({ interlaced: true }),
    imagemin.mozjpeg({ quality: 76.5, progressive: true }),
    imagemin.optipng({ optimizationLevel: 5 }),
    imagemin.svgo({
        plugins: [
            { removeViewBox: true },
            { cleanupIDs: false }
        ]
    })
];
const del = require('del');

const base_files_dest = 'dist'
const html_files_src = [
    'src/pug/**/*.pug'
];
const css_files_src = [
    'src/scss/**/*.scss'
];
const css_files_dest = 'dist/frontend/css';
const js_files_src = [
    'src/js/jquery-2.2.4.min.js',
    'src/js/customEvents-99.1.0.min.js',
    'src/js/libs/general.js',
    'src/js/libs/mobileDetect.js',
    'src/js/libs/jqueryEasing.js',
    'src/js/libs/swiper.min.js',
    'src/js/libs/minusLoc.js',
    'src/js/libs/minusSwiper.js',
    'src/js/libs/minusTab.js',
    'src/js/libs/minusLazyLoad.js',
    'src/js/libs/iStyler.js',
    //'src/js/libs/unveil.js',
    // 'src/js/libs/minusPopup.js',
    // 'src/js/libs/minusSystemWidget.js',
    // 'src/js/libs/minusMenu.js',
    // 'src/js/libs/minusDropDown.js',
    // 'src/js/libs/minusCustomSearch.js',
    // 'src/js/libs/minusSearchPopularWorlds.js',
    // 'src/js/libs/MinusCategorySwiper.js',
    // 'src/js/libs/MinusCategoryFilter.js',
    // 'src/js/libs/minusLoadMoreButton.js',
    // 'src/js/libs/minusViewer.js',
    // 'src/js/libs/minusListSort.js',
    // 'src/js/libs/minusHTML5Video.js',
    // 'src/js/libs/minusCounter.js',
    // 'src/js/libs/minusSocialShare.js',
    // 'src/js/libs/minusZoomGallery.js',
    // 'src/js/libs/jqueryConfirm.js',
    // 'src/js/libs/toast.js',
    // 'src/js/libs/imagesLoaded.js',
    //'src/js/libs/mediaElement.js',
    'src/js/config.js',
    'src/js/allScripts.js',
    //'src/js/utils.js'
]
const js_vanilla_files_src = [
    'src/vanilla_js/helper/BrowserDetector.js',
    'src/vanilla_js/helper/cookies.js',
    'src/vanilla_js/helper/customEvents-99.1.0.min.js',
    'src/vanilla_js/helper/dispatcher.js',
    'src/vanilla_js/helper/utils.js',
    'src/vanilla_js/helper/lazyImages.js',
    'src/vanilla_js/helper/minusLoc.js',
    'src/vanilla_js/libs/swiper.min.js',
    'src/vanilla_js/libs/minusSwiper.js',
    'src/vanilla_js/libs/minusTab.js',
    'src/vanilla_js/libs/iStyler.js',
    'src/vanilla_js/libs/menu.js',
    'src/vanilla_js/libs/minusWayPoint.js',
    'src/vanilla_js/config.js',
    'src/vanilla_js/main.js',
    'src/vanilla_js/utils.js'
];
const js_files_dest = 'dist/frontend/js';
const font_files_src = [
    'src/fonts/**'
];
const font_files_dest = 'dist/frontend/fonts';
const pwa_files_src = [
    'src/manifest-min.json',
    'src/sw.js'
];
const image_files_src = [
    'src/images/**'
];
const image_files_dest = 'dist/frontend/images';
const upload_files_src = [
    'src/upload/**'
];
const upload_files_dest = 'dist/upload';

function clean(done) {
    return del([
        'dist'
    ]);
    done();
}

function html(done) {
    return src(html_files_src, { since: lastRun(html) })
        .pipe(pug({
            pretty: true
        }))
        .pipe(dest(base_files_dest))
    done();
}

function css(done) {
    return src(css_files_src)
        .pipe(sass({
            outputStyle: 'compressed'
        }))
        .pipe(autoprefixer({
            cascade: false,
            grid: false
        }))
        .pipe(dest(css_files_dest))
        .pipe(server.stream())
    done();
}

function js(done) {
    return src(js_files_src)
        .pipe(uglify())
        .pipe(concat('all.js'))
        .pipe(dest(js_files_dest))
    done();
}

function js_uncompress(done) {
    return src(['src/js/utils.js'])
        .pipe(dest(js_files_dest))
    done();
}

function js_vanilla(done) {
    return src(js_vanilla_files_src)
        .pipe(concat('vanilla-all.js'))
        .pipe(dest(js_files_dest))
    done();
}

function fonts(done) {
    return src(font_files_src)
        .pipe(dest(font_files_dest))
    done();
}

function pwa(done) {
    return src(pwa_files_src)
        .pipe(dest(base_files_dest))
    done();
}

function images(done) {
    return src(image_files_src)
        .pipe(imagemin(imagemin_options))
        .pipe(dest(image_files_dest))
    done();
}

function uploads(done) {
    return src(upload_files_src)
        .pipe(imagemin(imagemin_options))
        .pipe(dest(upload_files_dest))
    done();
}

function reload(done) {
    server.reload();
    done();
}

function serve(done) {
    server.init({
        server: {
            baseDir: base_files_dest
        }
    });
    done();
}

function watchFiles(done) {
    watch(html_files_src, series(html, reload));
    watch(css_files_src, series(css));
    watch(js_vanilla_files_src, series(js_vanilla, reload));
    watch(js_files_src, series(js, reload));
    watch(js_files_src, series(js_uncompress, reload));
    watch(font_files_src, series(fonts, reload));
    watch(pwa_files_src, series(pwa, reload));
    watch(image_files_src, series(images, reload));
    watch(upload_files_src, series(uploads, reload));
}
exports.default = series(clean, css, parallel(html, js, js_uncompress, js_vanilla, fonts, pwa, images, uploads), serve, watchFiles);
exports.clean = clean;
exports.css = series(clean, css);
exports.html = series(clean, css, html);
exports.js = series(clean, js);
exports.tiny = series(clean, uploads, images);
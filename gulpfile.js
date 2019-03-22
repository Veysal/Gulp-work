const gulp = require('gulp');
const babel = require('gulp-babel');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const cleanCSS = require('gulp-clean-css');
const del = require('del');
const imagemin = require('gulp-imagemin');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require("browser-sync").create();


//Указываем пути
const paths = {
    styles: {
      src: 'src/css/**/*.scss',
      dest: 'dist/styles/'
    },
    js: {
      src: 'src/js/**/*.js',
      dest: 'dist/scripts/'
    },
    images:{
        src: 'src/img/**/*.{jpg,jpeg,png}',
        dest: 'dist/img/'
    },
    // html:{
    //   src: 'src/templates/*.pug',
    // }
  };

  function clean() {
    return del([ 'dist' ]);
  }

  // function html() {
  //   return src('src/templates/*.pug')
  //     .pipe(pug())
  //     .pipe(dest('dist/html'))
  // }

  //Работа со стилями
 function styles(){
    return gulp.src(paths.styles.src)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(cleanCSS({
      compatibility: 'ie8',
      level: 2
    }))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(browserSync.reload({stream: true}));
  }

  //Работа со скриптами
function scripts(){
    return gulp.src(paths.js.src)
    .pipe(babel({
			presets: ['@babel/preset-env']
		}))
    .pipe(uglify({
      toplevel: true
    }))
    .pipe(concat('main.js'))
    .pipe(gulp.dest(paths.js.dest))
    .pipe(browserSync.reload({stream: true}));
  }

  //Работа с изображениями
function images(){
    return gulp.src(paths.images.src)
    .pipe(imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.jpegtran({progressive: true}),
      imagemin.optipng({optimizationLevel: 5}),
      imagemin.svgo({
        plugins: [
            {removeViewBox: true},
            {cleanupIDs: false}
        ]
      })
    ]))
  }

function watch(){
    browserSync.init({
      server: {
          baseDir: "./"
      },
      notify: false,
		// open: false,
		// online: false, // Work Offline Without Internet Connection
		// tunnel: true, tunnel: "projectname", // Demonstration page: http://projectname.localtunnel.me
  });

  gulp.watch(paths.js.src, scripts);
  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.images.src, images);
  gulp.watch("./*.html").on('change', browserSync.reload);

}


gulp.task('watch', watch);
gulp.task('dist', gulp.series(clean, gulp.parallel(styles, scripts, images)))
gulp.task('build', gulp.series('dist', 'watch'))
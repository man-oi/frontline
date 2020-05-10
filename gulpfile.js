const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');

const autoprefixer = require('autoprefixer');
const browserSync = require('browser-sync').create();
const cssnano = require('cssnano');
const del = require('del');


// CONFIG
const config = {
  paths: {
    src: {
      html: 'src/html',
      scss: 'src/scss'
    },

    dist: {
      root: 'dist',
      css: 'dist/css'
    }
  }
}


// FUNCTIONS
const startServer = (done) => {
  browserSync.init({
    server: {
      baseDir: './dist/'
    },
    open: false
  });
  done();
};

const reloadServer = (done) => {
  browserSync.reload();
  done();
}

const cleanDist = async (done) => {
  const deletedPaths = await del([config.paths.dist.root], {});
  console.log('Files and directories that would be deleted:\n', deletedPaths.join('\n'));
  done();
}

const buildCSS = () => {
  return gulp.src(`${config.paths.src.scss}/*.scss`)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer(),
      cssnano()
    ]))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(config.paths.dist.css))
    .pipe(browserSync.stream());
}

const buildHTML = () => {
  return gulp.src(`${config.paths.src.html}/*.html`)
    .pipe(gulp.dest(`${config.paths.dist.root}/`));
}


// WATCHERS
const watch = () => {
  gulp.watch(`${config.paths.src.scss}/**/*.scss`, gulp.series(
    buildCSS,
  ));
  gulp.watch(`${config.paths.src.html}/**/*.html`, gulp.series(
    buildHTML,
    reloadServer,
  ));
}


// TASKS
exports.dev = gulp.series(
  cleanDist,
  gulp.parallel(
    buildCSS,
    buildHTML,
  ),
  startServer,
  watch,
);

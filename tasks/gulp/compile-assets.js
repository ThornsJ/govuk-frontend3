'use strict'

const gulp = require('gulp')
const configPaths = require('../../config/paths.json')
const sass = require('gulp-sass')
const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')
const merge = require('merge-stream')
const concat = require('gulp-concat')
const taskArguments = require('./task-arguments')
const gulpif = require('gulp-if')
const uglify = require('gulp-uglify')
const eol = require('gulp-eol')
const rename = require('gulp-rename')
const cssnano = require('cssnano')
const postcssnormalize = require('postcss-normalize')
const postcsspseudoclasses = require('postcss-pseudo-classes')

// Compile CSS and JS task --------------
// --------------------------------------

const isProduction = taskArguments.isProduction

gulp.task('scss:compile', () => {
  let compile = gulp.src(configPaths.globalScss + 'govuk-frontend.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulpif(isProduction, postcss([
      autoprefixer,
      cssnano,
      postcssnormalize
    ])))
    .pipe(gulpif(!isProduction, postcss([
      autoprefixer,
      // Auto-generate 'companion' classes for pseudo-selector states - e.g. a
      // :hover class you can use to simulate the hover state in the review app
      postcsspseudoclasses
    ])))
    .pipe(gulpif(isProduction,
      rename({
        extname: '.min.css'
      })
    ))
    .pipe(gulp.dest(taskArguments.destination + '/css/'))

  let compileOldIe = gulp.src(configPaths.globalScss + 'govuk-frontend-oldie.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulpif(isProduction, postcss([
      autoprefixer,
      cssnano,
      postcssnormalize,
      require('oldie')({
        rgba: {filter: true},
        rem: {disable: true},
        unmq: {disable: true},
        pseudo: {disable: true}
        // more rules go here
      })
    ])))
    .pipe(gulpif(!isProduction, postcss([
      autoprefixer,
      require('oldie')({
        rgba: {filter: true},
        rem: {disable: true},
        unmq: {disable: true},
        pseudo: {disable: true}
        // more rules go here
      })
    ])))
    .pipe(gulpif(isProduction,
      rename({
        extname: '.min.css'
      })
    ))
    .pipe(gulp.dest(taskArguments.destination + '/css/'))

  return merge(compile, compileOldIe)
})

// Compile js task for preview ----------
// --------------------------------------
gulp.task('js:compile', () => {
  return gulp.src([configPaths.src + '**/*.js'])
    .pipe(concat('govuk-frontend.js'))
    .pipe(gulpif(isProduction, uglify()))
    .pipe(gulpif(isProduction,
      rename({
        extname: '.min.js'
      })
    ))
    .pipe(eol())
    .pipe(gulp.dest(taskArguments.destination + '/js/'))
})

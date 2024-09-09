'use strict'

const configPath = require('../../config/paths.json')
const gulp = require('gulp')
const nunjucksRender = require('gulp-nunjucks-render')
const rename = require('gulp-rename')
const data = require('gulp-data')
const vinylPaths = require('vinyl-paths')
const path = require('path')
const fs = require('fs')
const toMarkdown = require('gulp-to-markdown')
const vinylInfo = {}

function getDataForFile (file) {
  let finalData = {}
  finalData = Object.assign(finalData, vinylInfo)
  return finalData
}

const manageEnvironment = function (environment) {
  environment.addGlobal('isReadme', 'true')
  environment.opts.lstripBlocks = true
  environment.opts.trimBlocks = true
}

gulp.task('generate:readme', () => {
  return gulp.src(['!' + configPath.components + '_component-example/index.njk', configPath.components + '**/index.njk'])
  .pipe(vinylPaths(paths => {
    vinylInfo.componentName = paths.split(path.sep).slice(-2, -1)[0]
    vinylInfo.componentPath = vinylInfo.componentName
    vinylInfo.componentNunjucksFile = fs.readFileSync(configPath.components + vinylInfo.componentName + '/' + vinylInfo.componentName + '.njk', 'utf8')
    return Promise.resolve()
  }))
  .pipe(data(getDataForFile))
  .pipe(nunjucksRender({
    path: [configPath.src + 'views', configPath.components],
    manageEnv: manageEnvironment
  }))
  .pipe(toMarkdown({
    gfm: true // github flavoured markdown https://github.com/domchristie/to-markdown#gfm-boolean
  }))
  .pipe(rename(function (path) {
    path.basename = 'README'
    path.extname = '.md'
  }))
  .pipe(gulp.dest(configPath.src + 'components/'))
})

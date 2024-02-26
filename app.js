const express = require('express')
const app = express()
const nunjucks = require('nunjucks')
const fs = require('fs')
const path = require('path')
const port = (process.env.PORT || 3000)
const herokuApp = process.env.HEROKU_APP
const dirTree = require('directory-tree')

// Set up views
const appViews = [
  path.join(__dirname, '/src/views/'),
  path.join(__dirname, '/src/components/'),
  path.join(__dirname, '/src/examples/')
]

// Configure nunjucks
nunjucks.configure(appViews, {
  autoescape: true,
  express: app,
  noCache: true,
  watch: true
})

// Set view engine
app.set('view engine', 'njk')

// Set up middleware to serve static assets
app.use('/public', express.static(path.join(__dirname, '/public')))

app.listen(port, () => {
  console.log('Listening on port ' + port + '   url: http://localhost:' + port)
})

// Routes

// Get a directory tree of the components folder
const tree = dirTree('./src/components/')
// console.log(tree)

// Pass the tree object to all routes
app.locals.componentsDirectory = tree

// Index page - render the component list template
app.get('/', function (req, res) {
  res.render('component-list')
})

// Examples
app.get('/examples*', function (req, res) {
  res.render('index')
})

// Components
app.get('/components*', function (req, res) {
  var path = (req.params[0]).replace(/\//g, '')

  // Get component path, component njk and component html files
  try {
    var componentNjk = fs.readFileSync('src/components/' + path + '/' + path + '.njk', 'utf8')
    var componentHtml = fs.readFileSync('src/components/' + path + '/' + path + '.html', 'utf8')

    res.locals.componentPath = path
    res.locals.componentNunjucksFile = componentNjk
    res.locals.componentHtmlFile = componentHtml
  } catch (e) {
    console.log('Error:', e.stack)
  }

  res.render(path, { componentPath: res.locals.componentPath, componentNunjucksFile: res.locals.componentNunjucksFile, componentHtmlFile: res.locals.componentHtmlFile }, function (err, html) {
    if (err) {
      res.render(path + '/' + 'index', function (err2, html) {
        if (err2) {
          res.status(404).send(err + '<br>' + err2)
        } else {
          res.end(html)
        }
      })
    } else {
      res.end(html)
    }
  })
})

// Component isolated preview
app.get('/components/*/preview', function (req, res) {
  var path = (req.params[0]).replace(/\//g, '')
  console.log(path)
  res.render(path, function (err, html) {
    if (err) {
      res.render(path + '/' + path, function (err2, html) {
        if (err2) {
          res.status(404).send(err + '<br>' + err2)
        } else {
          res.end(html)
        }
      })
    } else {
      res.end(html)
    }
  })
})

// Config for Heroku

// If this is the Heroku demo app
if (herokuApp === 'DEMO') {
  app.use('/', express.static(path.join(__dirname, 'demo')))
}

// Disallow search index indexing
app.use(function (req, res, next) {
  // none - Equivalent to noindex, nofollow
  // noindex - Do not show this page in search results and do not show a "Cached" link in search results.
  // nofollow - Do not follow the links on this page
  res.setHeader('X-Robots-Tag', 'none')
  next()
})

app.get('/robots.txt', function (req, res) {
  res.type('text/plain')
  res.send('User-agent: *\nDisallow: /')
})

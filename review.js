const express = require('express')
const app = express()
const path = require('path')

// Get config vars for Heroku apps
var herokuApp = process.env.HEROKU_APP

console.log('herokuApp var:' + herokuApp)

// Define the port to run on
app.set('port', (process.env.PORT || 3000))

// If this is the Heroku review app
if (herokuApp === 'REVIEW') {
  app.use('/', express.static(path.join(__dirname, 'preview')))
}

// If this is the Heroku demo app
if (herokuApp === 'DEMO') {
  app.use('/', express.static(path.join(__dirname, 'demo')))
}

app.get('/', (req, res) => {
  res.render('index.html')
})

app.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port'))
})

const express = require('express')
const bodyParser = require('body-parser')
const database = require('./database')
const routes = require('./routes')
const passport = require('passport')
const cookieParser = require('cookie-parser')
const cookieSession = require('cookie-session')
const app = express()

require('ejs')
app.set('view engine', 'ejs');

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(cookieSession({
	name: 'session',
	keys: [process.env.SESSION_KEY]
}))
app.use(passport.initialize())
app.use(passport.session())
require('./config/local')
app.use((request, response, next) => {
	request.isLoggedIn = request.user ? true: false
	next()
})
app.use('/', routes)

app.use((request, response) => {
  response.status(404).render('not_found')
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}...`)
})

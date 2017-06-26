const express = require('express')
const path = require('path')
const logger = require('morgan')
const bodyParser = require('body-parser')
const database = require('./database')
const routes = require('./routes')
const passport = require('passport')
const Auth0Strategy = require('passport-auth0')
// const LocalStrategy = require('passport-local')
const cookieParser = require('cookie-parser')
// const cookieSession = require('cookie-session')
const session = require('express-session')
const dotenv = require('dotenv')

dotenv.load()

const strategy = new Auth0Strategy({
	domain: 'pporche87.auth0.com',
	clientID: 'X66pWaYnjn-aeOL2OwG11i61GsReAZbb',
	clientSecret: 'MTyv-IazhLK-RmPW9tvWw6h2NLCvFfW3_119SVXvk5h0yTOFTDjur9ZEhrl-Nllw',
	callbackURL: '/callback'
}, (accessToke, refreshToken, extraParams, profile, done) => {
	return done(null, profile)
})

passport.use(strategy)

passport.serializeUser((user, done) => {
	done(null, user)
})

passport.deserializeUser((user, done) => {
	done(null, user)
})

const app = express()

passport.use(new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password'
},
function(email, password, callback) {
	database.getUserByEmail({ email: email }, function(error, user) {
		if (error) {
			return callback(error)
		}
		if (!user[0]) {
			return callback(null, false, { message: 'Incorrect email.' })
		}
		if (user[0].password != password) {
			return callback(null, false, { message: 'Incorrect password.' })
		}
		return callback(null, user[0])
	})
}))

passport.serializeUser(function(user, callback) {
	callback(null, user.id)
})

passport.deserializeUser(function(id, callback) {
	database.getUserById(id, function(error, user) {
		if (error) { return callback(error) }
		if (user.length === 0) { return callback(null, null) }
		callback(null, user[0])
		// return callback(error, user)
	})
})

require('ejs')
app.set('view engine', 'ejs');

app.use(logger('dev'))
app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(session({
	secret: 'shhhhh',
	resave: true,
	saveUnitialized: true
}))
// app.use(cookieSession({
// 	name: 'session',
// 	keys: [process.env.SESSION_KEY]
// }))
app.use(passport.initialize())
app.use(passport.session())
// app.use((request, response, next) => {
// 	request.isLoggedIn = request.user ? true : false
// 	next()
// })
app.use('/', routes)

app.use((request, response) => {
  response.status(404).render('not_found', {
		isLoggedIn: request.isLoggedIn
	})
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}...`)
})

const express = require('express')
const passport = require('passport')
const database = require('../database')
const users = require('./users')

const router = express.Router()

router.use('/users', users)

router.get('/', (request, response) => {
	response.render('landing')
})


router.get('/home', (request, response, next) => {
  database.getAlbums((error, albums) => {
		if (error) { return next(error) }
		database.getRecentReviews((error, reviews) => {
			response.render('index', {
				albums: albums,
				reviews: reviews
			})
		})
	})
})



router.get('/signin', (request, response) => {
	response.render('signin', {
		error: request.query.error,
		windowTitle: 'Sign In',
		isLoggedIn: request.isLoggedIn
	})
})

router.post('/signin', passport.authenticate('local'), (request, response) => {
	const loggedInUser = { id } = request.body
	database.getUserByEmail(loggedInUser, (request, response) => {
		console.log(response[0].id)
	})
	response.redirect(`/users/1`)
})

router.get('/signup', (request, response) => {
	response.render('signup', {
		error: request.query.error,
		windowTitle: 'Sign Up',
		isLoggedIn: request.isLoggedIn
	})
})

router.post('/signup', (request, response) => {
	const newUser = { name, email, password } = request.body
	database.newUser(name, email, password, (error) => {
		if (error) {
			response.status(500).render('error', {
				error: error,
				windowTitle: 'Error',
				isLoggedIn: request.isLoggedIn
			})
		} else {
			response.render('signin')
		}
	})
})

router.get('/albums/:albumID', (request, response) => {
  const albumID = request.params.albumID

  database.getAlbumsByID(albumID, (error, albums, next) => {
    if (error) { return next(error) }
		database.getRecentReviews((error, reviews, next) => {
			if (error) { return next(error) }
			const album = albums[0]
			response.render('album', {
				album: album,
				reviews: reviews
			})
		})
	})
})

router.get('/reviews/:albumID', (request, response) => {
	const albumID = request.params.albumID
	database.getAlbumsByID(albumID, (error, albums, next) => {
		if (error) { return next(error) }
		const album = albums[0]
		response.render('review', {
			album: album
		})
	})
})

router.post('/reviews/:albumID', (request, response) => {
	const albumID = request.params.albumID
	const comment = { comments } = request.body
	database.insertReview(albumID, comment.comments, (error) => {
	})
	response.redirect(`/albums/${albumID}`)
})

// const userLoggedIn = (request, response, next) => {
// 	if (request.isAuthenticated())
// 		return next()
// 	res.redirect('/home')
// }


module.exports = router

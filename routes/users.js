const express = require('express')
const passport = require('passport')
const database = require('../database')

const router = express.Router()

router.get('/user', (request, response) => {
	console.log(request.params);
})

router.get('/:userId', (request, response) => {
	const { userId } = request.params

	database.getUserById(userId, (error, result) => {
		if (error || result.length === 0) {
			if (!error) {
				console.log('User does not exist');
				error = new Error('User does not exist')
			}
			response.status(500).render('error', {
				error: error,
				isLoggedIn: request.isLoggedIn
			})
		} else {
			response.render('profile', {
				profile: result[0],
				isLoggedIn: request.isLoggedIn
			})
		}
	})
})

module.exports = router

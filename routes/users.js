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
		 if (error) { return error }
		 database.getReviewByUser(userId, (error, reviews) => {
			 if (error) { return error }
			 response.render('profile', {
 					profile: result[0],
 					reviews: reviews
 				})
		 })
	 })
})


module.exports = router

const pg = require('pg')

const dbName = 'vinyl'
const connectionString = process.env.DATABASE_URL || `postgres://localhost:5432/${dbName}`
const client = new pg.Client(connectionString)

client.connect()

// Query helper function
const query = function(sql, variables, callback){
  console.log('QUERY ->', sql.replace(/[\n\s]+/g, ' '), variables)

  client.query(sql, variables, function(error, result){
    if (error){
      console.log('QUERY <- !!ERROR!!')
      console.error(error)
      callback(error)
    }else{
      console.log('QUERY <-', JSON.stringify(result.rows))
      callback(error, result.rows)
    }
  })
}

const getAlbums = function(callback) {
  query("SELECT * FROM albums", [], callback)
}

const getAlbumsByID = function(albumID, callback) {
  query("SELECT * FROM albums WHERE id = $1", [albumID], callback)
}

const getUserById = function(userID, callback) {
	query("SELECT * FROM users WHERE id = $1", [userID], callback)
}

const getUserByEmail = function(userEmail, callback) {
	query("SELECT * FROM users WHERE email = $1", [userEmail.email], callback)
}

const newUser = function(name, email, password, callback) {
	query("INSERT INTO users (name, email, password) VALUES($1, $2, $3)", [name, email, password], callback)
}

const getRecentReviews = function(callback) {
	query("SELECT albums.id, albums.title, reviews.created_at, reviews.comments FROM reviews JOIN albums ON reviews.user_id=albums.id ORDER BY created_at DESC LIMIT 3", [], callback)
}

const getReviewByAlbum = function(albumID, callback) {
	query("SELECT albums.title, reviews.created_at, reviews.comments FROM reviews JOIN user ON reviews.user_id=albums.id ORDER BY created_at DESC WHERE album_id=$1", [albumID], callback)
}

const getReviewByUser = function(userID, callback) {
	query("SELECT user_id, comments, created_at FROM reviews WHERE user_id=$1", [userID], callback)
}

const insertReview = function(albumID, comment, callback) {
	query("INSERT INTO reviews (user_id, album_id, comments) VALUES (1, $1, $2)", [albumID, comment], callback)
}

const deleteReview = function(commentID, callback) {
	query("DELETE FROM reviews WHERE id=$1", [commentID], callback)
}


module.exports = {
  getAlbums,
  getAlbumsByID,
	getUserById,
	getUserByEmail,
	newUser,
	getRecentReviews,
	insertReview,
	getReviewByUser,
	deleteReview
}

CREATE TABLE albums (
  id SERIAL UNIQUE,
  title VARCHAR(255) NOT NULL,
  artist VARCHAR(255) NOT NULL
);

CREATE TABLE users (
	id SERIAL UNIQUE,
	name VARCHAR(255) NOT NULL,
	email VARCHAR(255) NOT NULL,
	password VARCHAR(255) NOT NULL,
	join_date TIMESTAMP DEFAULT NOW()
);

CREATE TABLE reviews (
	id SERIAL,
	user_id INT NOT NULL,
	album_id INT NOT NULL,
	comments VARCHAR(255),
	FOREIGN KEY (user_id) REFERENCES users(id),
	FOREIGN KEY (album_id) REFERENCES albums(id),
	created_at TIMESTAMP DEFAULT NOW()

INSERT INTO
  albums (title, artist)
VALUES
  ('Malibu', 'Anderson .Paak'),
  ('A Seat at the Table', 'Solange Knowles'),
  ('Melodrama', 'Lorde'),
  ('In Rainbows', 'Radiohead')
;

INSERT INTO
	users (name, email, password)
VALUES
	('Patrick Porche', 'pjporche@gmail.com', '1234'),
	('Kitty Porche', 'kittyporche@gmail.com', '1234'),
	('Miracle Porche', 'miracleporche@gmail.com', '1234')
;

INSERT INTO
	reviews (user_id, album_id, comments)
VALUES
	(1,1, 'What a great album'),
	(1,2, 'That was awful'),
	(1,4, 'I might buy the next one'),
	(2,4, 'Already downloaded my copy'),
	(2,1, 'I want my ears back'),
	(3,3, 'All the stars!')
;

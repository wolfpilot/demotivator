CREATE TABLE IF NOT EXISTS quotes (
  id SERIAL PRIMARY KEY,
  author VARCHAR(128),
  text TEXT NOT NULL
);

INSERT INTO quotes (id, author, text)
VALUES (1, 'Homer Simpson', 'Trying is the first step toward failure.');

INSERT INTO quotes (id, author, text)
VALUES (2, 'Robert Penn Warren', 'You have to make the good out of the bad because that is all you have got to make it out of.');

INSERT INTO quotes (id, author, text)
VALUES (3, '', 'The best things in life are actually really expensive.');

INSERT INTO quotes (id, author, text)
VALUES (4, 'Latrell Sprewell', 'Success is just failure that hasn''t happened yet.');

INSERT INTO quotes (id, author, text)
VALUES (5, 'Dwight Schrute', 'Not everything is a lesson. Sometimes you just fail.');

INSERT INTO quotes (id, author, text)
VALUES (6, 'W.C. Fields', 'If at first you don''t succeed, try, try again. Then quit. No use being a damn fool about it.');

INSERT INTO quotes (id, author, text)
VALUES (7, 'Dom Mazzetti', 'Challenging yourself...is a good way to fail.');

INSERT INTO quotes (id, author, text)
VALUES (8, 'John Benfield', 'Eagles may soar, but weasels don''t get sucked into jet engines.');

INSERT INTO quotes (id, author, text)
VALUES (9, 'Dorothy Parker', 'If you want to know what God thinks of money, just look at the people he gave it to.');

INSERT INTO quotes (id, author, text)
VALUES (10, 'Harry Hill', 'It''s only when you look at an ant through a magnifying glass on a sunny day that you realize how often they burst into flames.');

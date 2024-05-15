CREATE TABLE IF NOT EXISTS quotes (
  id SERIAL PRIMARY KEY,
  author VARCHAR(128),
  text TEXT NOT NULL
);

INSERT INTO quotes (author, text)
VALUES ('Homer Simpson', 'Trying is the first step toward failure.');

INSERT INTO quotes (author, text)
VALUES ('Robert Penn Warren', 'You have to make the good out of the bad because that is all you have got to make it out of.');

INSERT INTO quotes (author, text)
VALUES ('', 'The best things in life are actually really expensive.');

INSERT INTO quotes (author, text)
VALUES ('Latrell Sprewell', 'Success is just failure that hasn''t happened yet.');

INSERT INTO quotes (author, text)
VALUES ('Dwight Schrute', 'Not everything is a lesson. Sometimes you just fail.');

INSERT INTO quotes (author, text)
VALUES ('W.C. Fields', 'If at first you don''t succeed, try, try again. Then quit. No use being a damn fool about it.');

INSERT INTO quotes (author, text)
VALUES ('Dom Mazzetti', 'Challenging yourself...is a good way to fail.');

INSERT INTO quotes (author, text)
VALUES ('John Benfield', 'Eagles may soar, but weasels don''t get sucked into jet engines.');

INSERT INTO quotes (author, text)
VALUES ('Dorothy Parker', 'If you want to know what God thinks of money, just look at the people he gave it to.');

INSERT INTO quotes (author, text)
VALUES ('Harry Hill', 'It''s only when you look at an ant through a magnifying glass on a sunny day that you realize how often they burst into flames.');

-- Set the sequence ID to the last index of quotes rows
SELECT SETVAL('quotes_id_seq', (SELECT MAX(id) from "quotes"));

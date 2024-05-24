CREATE TABLE IF NOT EXISTS "quotes" (
	"id" serial PRIMARY KEY NOT NULL,
	"author" varchar(128),
	"text" text NOT NULL
);

--SELECT * from movie
CREATE EXTENSION dblink;
select * from dblink('dbname=vd user=postgres password=nononopwd hostaddr=localhost','SELECT * from "Movies"')
AS t1(id integer, name text, description text, release_number integer, poster_url text, 
large_poster_url text, release_date date, created_at timestamp);
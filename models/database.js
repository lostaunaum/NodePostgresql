var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://Marco:12345@localhost:5432/NodeTestProject';

var client = new pg.Client(connectionString);

client.connect();
var query = client.query("DROP TABLE IF EXISTS items")
var query = client.query("DROP TABLE IF EXISTS users")
var query = client.query("CREATE TABLE IF NOT EXISTS users(id SERIAL PRIMARY KEY, FirstName VARCHAR(40) not null, LastName VARCHAR(40) not null, MiddleName VARCHAR(40) not null, Email VARCHAR(40) not null, UserName VARCHAR(40) not null, Password VARCHAR(40) not null)");
var query = client.query("INSERT INTO users (FirstName, LastName, MiddleName, Email, UserName, Password) VALUES ('Marco', 'Lostaunau', 'Andre', 'lostaunaum@gmail.com', 'lostaunaum@gmail.com', 'Easye123'), ('Mason', 'Posch', 'Borgrammer', 'mason@gmail.com', 'mason@gmail.com', 'Easye123'), ('Bobby', 'Pickle', 'Aushvitz', 'bobbyTheNazi@gmail.com', 'bobbyTheNazi@gmail.com', 'Easye123'), ('Jimmy', 'PooCock', 'Travis', 'jimmy@gmail.com', 'jimmy@gmail.com', 'Easye123'), ('Masons Friend', 'Lonely', 'ForEverAlone', 'masonsFriend@gmail.com', 'masonsFriend@gmail.com', 'Easye123')");
query.on('end', function() { client.end(); });

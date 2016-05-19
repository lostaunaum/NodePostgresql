var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://Marco:12345@localhost:5432/NodeTestProject';
var client = new pg.Client(connectionString);

/*
 * SHOW all users to userlist.
 */
router.get('/userlist', function(req, res) {
    var results = [];
    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          return res.status(500).json({ success: false, data: err});
        }

        // SQL Query > Select Data
        var query = client.query("SELECT * FROM users ORDER BY user_id ASC;");

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            return res.json(results);
        });
    });
});

/*
 * ADD to adduser.
 */
router.post('/adduser', function(req, res) {
    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

        // SQL Query > Insert Data
        var query = client.query("INSERT INTO users (FirstName, MiddleName, LastName, Email, UserName) VALUES ($1, $2, $3, $4, $5)", [req.body["firstname"], req.body["middlename"], req.body["lastname"], req.body["email"], req.body["username"]]);
        
        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            return res.json({ success: true, data: "User added successfully!"});
        });
    });
});



/*
 * DELETE to deleteuser.
 */
router.delete('/deleteuser/:id', function(req, res) {

    // Grab data from the URL parameters
    var id = req.params.id;

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }
        
        // SQL Query > Delete Data
        var query = client.query("DELETE FROM users WHERE user_id = ($1)", [id]);
        
        // // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            return res.json({ success: true, data: "User successfully deleted!"});
        });
    });
});



/*
 * UPDATE to updateuser.
 */
router.post('/updateuser/:id', function(req, res) {

    // Grab data from the URL parameters
    var id = req.params.id;

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }
        
        var query = client.query("UPDATE users SET FirstName = ($1), MiddleName = ($2), LastName = ($3), Email = ($4), UserName = ($5)  WHERE user_id = ($6);", [req.body["firstname"], req.body["middlename"], req.body["lastname"], req.body["email"], req.body["username"], id]);

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            return res.json({ success: true, data: "User updated!"});
        });
    });
});

/*
 * GET singleuser.
 */
router.get('/getuser/:id', function(req, res) {

    // Grab data from the URL parameters
    var id = req.params.id;
    var results = [];

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }
        
        // SQL Query > Select Data
        var query = client.query("SELECT * FROM users WHERE user_id = ($1) ORDER BY user_id ASC;", [id]);

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            return res.json(results);
        });
    });
});


module.exports = router;

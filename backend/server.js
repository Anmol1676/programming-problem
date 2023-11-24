const express = require("express"); 
const bodyParser = require("body-parser");
const cors = require("cors");
const PORT = 4000;

app = express();
app.use(cors());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

const mysql = require('mysql2');


var db = mysql.createConnection({
  host: 'mysql2',
  user: 'root',
  password: 'asdf1234'
 
});

db.connect((err) => {
    if(err){
        console.error('Error connecting to the database:', err);
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection refused. Exiting application.');
            process.exit(1); // Exit with a failure code
        }
    }else
    {
        console.log('Connected to the database.');
        createDatabase();
    }
}); 

db.createDatabase((err)=>{
    // create database issues 
    db.qurey("CREATE DATABASE IF NOT EXISTS issues", (err,result)=>{
        if(err){
            console.log("error creating database", err);
            return;
        }console.log("database was created ");
        
    });

    db.qurey("USE issues",(err,result)=> {
        if(err){
            console.log("not able to use issues", err);
            return;
        }
        console.log("using the database issues");
    });

    createUserTable();
    createChannelsTable();
    createPostsTable();
    createCommentsTable();

});


//create user table 
// need a ranking system
function createUserTable() {
    db.query(
      "CREATE TABLE IF NOT EXISTS users (id INT NOT NULL AUTO_INCREMENT, username VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL, is_admin BOOLEAN NOT NULL, PRIMARY KEY (id)) ENGINE=InnoDB;",
      (err, results) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Users table created/checked");
        }
      }
    );
}

//create channel table 
function createChannelsTable() {
    dp.query(
      `CREATE TABLE IF NOT EXISTS channels (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255) NOT NULL UNIQUE)`,
      (err, results) => {
        if (err) {
          console.log(err);
        } else {
          console.log('Channels table created/checked');
        }
      }
    );
  }


//create post table 
function createPostsTable() {
    dp.query(
    `CREATE TABLE IF NOT EXISTS posts (
      id INT AUTO_INCREMENT PRIMARY KEY,
        content TEXT NOT NULL,
        author VARCHAR(255) NOT NULL,
      channel_id INT NOT NULL,
      likes INT DEFAULT 0,
      dislikes INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (channel_id) REFERENCES channels(id)
      )`,
      (err, results) => {
        if (err) {
          console.log(err);
        } else {
        console.log('Posts table created/checked');
        }
      }
    );
}

//create Comments table 
function createCommentsTable() {
  dp.query('CREATE TABLE IF NOT EXISTS comments (id INT NOT NULL AUTO_INCREMENT,content TEXT NOT NULL, author VARCHAR(255) NOT NULL, post_id INT NOT NULL, PRIMARY KEY (id), FOREIGN KEY (post_id) REFERENCES posts(id)) ENGINE=InnoDB', (err, results) => {
    if (err) {
      console.log(err);
    } else {
      console.log('Comments table created/checked');
    }
  });
};


//regitration 
app.post('/regitration', (req,res)=>{
    const {username, password} = req.body;
    if (!username || !password ) {
        res.status(400).send('Missing required fields');
        return;
    }

    db.query('SELECT * FROM users WHERE username = ?', username, (error,result)=>{
        if(error){
            console.log(error);
            res.status(500).send('Error registering user');
        }else if (results.length > 0) {
            res.status(409).send('Username already taken');
        }else{
            db.query('INSERT INTO users(username, password,is_admin) VALUES (?, ?, 0)', [username,password], (error,result)=>{
                if(error){
                    console.log(error);
                    res.status(500).send('Error registering user');
                }else{
                    res.status(201).send('User registered successfully ');
                }
            });
        }
    });
});


//login
    //TODO



//POST channel (add new channel)
    //TODO


//DELETE channel (the admin can delete channels)
    //TODO


//GET channel (show all the channels)
    //TODO


//POST post (make new posts in the a given channel )
    //TODO


//DELETE post ( the admin can delete post)
    //TODO


//GET post (get the post made)
    //TODO


//POST reply (make new reply and make nested reply to post made on the channel)
    //TODO


//DELETE reply ( the admin can delete replay)
    //TODO


//GET reply (get the replys made)
    //TODO


//search by string (search the post table)
    //TODO


//search by author (search the post by username)
    //TODO


//search by likes ( search by most like in the user table)
    //TODO


//search by ranks(search the post by rank )
    //TODO



app.listen(PORT, () => {
    console.log('server is running on port ' + PORT + ".");
});
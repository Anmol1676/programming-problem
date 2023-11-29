const express = require("express"); 
const bodyParser = require("body-parser");
const cors = require("cors");
const PORT = 4000;

app = express();
app.use(cors());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

const mysql = require('mysql2');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });


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
            process.exit(1);
        }
    } else {
        console.log('Connected to the database.');

        // Create the database
        db.query("CREATE DATABASE IF NOT EXISTS issues", (err, result) => {
            if (err) {
              console.log("Error creating database", err);
              return;
            }
            console.log("Database 'issues' created/checked");

            // Use the database
            db.query("USE issues", (err, result) => {
              if (err) {
                console.log("Error selecting database 'issues'", err);
                return;
              }
              console.log("Using the database 'issues'");

              // Create tables
              createUserTable();
              createChannelsTable();
              createPostsTable();
              createCommentsTable();
              //createAdminUser()
            });
        });
    }
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
    db.query(
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
  db.query(
      `CREATE TABLE IF NOT EXISTS posts (
          id INT AUTO_INCREMENT PRIMARY KEY,
          content TEXT NOT NULL,
          author VARCHAR(255) NOT NULL,
          channel_id INT NOT NULL,
          likes INT DEFAULT 0,
          dislikes INT DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          image_url VARCHAR(255) -- New column for image URL
      )`,
      (err, results) => {
          if (err) {
              console.log(err);
          } else {
              console.log('Posts table updated/checked');
          }
      }
  );
}

//create Comments table 
function createCommentsTable() {
  db.query('CREATE TABLE IF NOT EXISTS comments (id INT NOT NULL AUTO_INCREMENT,content TEXT NOT NULL, author VARCHAR(255) NOT NULL, post_id INT NOT NULL, PRIMARY KEY (id), FOREIGN KEY (post_id) REFERENCES posts(id)) ENGINE=InnoDB', (err, results) => {
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
        }else if(result.length > 0) {
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


//login backend
app.post('/login', (req, res) => {
  const { username, password } = req.body; 
  db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (error, result) => {
      if (error) {
          console.log(error); // Use console.log to print the error
          res.status(500).send('Unable to login');
      } else if (result.length === 0) { // Corrected variable name
          console.log('Invalid username or password');
          res.status(401).send('Invalid username or password');
      } else { // User found, login successful
          console.log('Login successful'); 
          res.status(200).send('Login successful');
      }
  });
});


//POST channel (add new channel)
app.post('/channels', (req, res) => {
    const name = req.body.name;
  
    db.query('INSERT INTO channels (name) VALUES (?)', [name], (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send('Error creating channel');
      } else {
        res.status(201).send('Channel created successfully');
      }
    });
});

//GET channel (show all the channels)
app.get('/channels', (req, res) => {
    db.query('SELECT * FROM channels', (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send('Error fetching channels');
      } else {
        res.status(200).json(results);
      }
    });
});

//DELETE Channels 





//POST post (make new posts in the a given channel )
app.post('/channels/:channelId/posts', upload.single('image'), (req, res) => {
  const channelId = req.params.channelId;
  const { content, author } = req.body;
  const imagePath = req.file ? req.file.path : null;
  console.log(req.file);

  db.query('INSERT INTO posts (content, author, channel_id, likes, image_url) VALUES (?, ?, ?, 0, ?)',
        [content, author, channelId, imagePath], (err, results) => {
      if (err) {
          console.log(err);
          res.status(500).send('Error creating post');
      } else {
          res.status(201).send('Post created successfully');
      }
  });
});

app.use('/uploads', express.static('uploads'));



//GET post (get the post made)
app.get('/channels/:channelId/posts', (req, res) => {
    const channelId = req.params.channelId;
    console.log(req.params);
    db.query('SELECT * FROM posts WHERE channel_id = ?', [channelId], (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send('Error fetching posts');
      } else {
        // Fetch comments for each post and include them in the response
        let fetchedPosts = results;
        let postCount = fetchedPosts.length;
        let fetchedPostCount = 0;
  
        fetchedPosts.forEach((post, index) => {
          db.query('SELECT * FROM comments WHERE post_id = ?', [post.id], (err, comments) => {
            if (err) {
              console.log(err);
              res.status(500).send('Error fetching comments');
            } else {
              fetchedPosts[index] = { ...post, comments };
              fetchedPostCount++;
  
              if (fetchedPostCount === postCount) {
                res.status(200).json(fetchedPosts);
              }
            }
          });
        });
  
        if (postCount === 0) {
          res.status(200).json([]);
        }
      }
    });
  });

  //DELETE Post 

  // add like and dislike to the post 

  

//POST reply (make new reply and make nested reply to post made on the channel)
app.post('/posts/:postId/comments', (req, res) => {
  const postId = req.params.postId;
  const content = req.body.content;
  const author = req.body.author;

  if (!content) {
    return res.status(400).send('Comment content cannot be empty');
  }

  db.query('INSERT INTO comments (content, author, post_id) VALUES (?, ?, ?)', [content, author, postId], (err, insertResults) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error creating comment');
    } else {
      // Send back the ID of the new comment, along with any other relevant data
      res.status(201).json({
        message: 'Comment created successfully',
        comment: {
          id: insertResults.insertId,
          content,
          author,
          post_id: postId
        }
      });
    }
  });
});




//DELETE reply ( the admin can delete replay)
    //TODO


//GET reply (get the replys made)
app.get('/posts/:postId/comments', (req, res) => {
  const postId = req.params.postId;

  db.query('SELECT * FROM comments WHERE post_id = ?', [postId], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error fetching comments');
    } else {
      res.status(200).json(results);
    }
  });
});


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
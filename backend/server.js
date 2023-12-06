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
      "CREATE TABLE IF NOT EXISTS users (id INT NOT NULL AUTO_INCREMENT, username VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL, is_admin BOOLEAN NOT NULL, classification VARCHAR(255) NOT NULL, PRIMARY KEY (id)) ENGINE=InnoDB;",
      (err, results) => {
        if (err) {
          console.log(err);
        } else {
          
          console.log("Users table created/checked");
          db.query("INSERT INTO users (username, password, is_admin, classification) VALUES ('admin', 'admin123', 1, 'Expert')", (error, results) => {
            if(error){
                console.log("Admin not added" + error );
            }else{
                console.log("admin was added!!");
            }

          });
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
  db.query(`
    CREATE TABLE IF NOT EXISTS comments (
      id INT NOT NULL AUTO_INCREMENT,
      content TEXT NOT NULL,
      author VARCHAR(255) NOT NULL,
      image_url VARCHAR(255),
      post_id INT NOT NULL,
      parent_id INT,
      PRIMARY KEY (id),
      FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
      FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE
    ) ENGINE=InnoDB;`, (err, results) => {
    if (err) {
      console.log('Error creating comments table:', err);
    } else {
      console.log('Comments table created/checked');
    }
  });
}



//regitration 
app.post('/registration', (req, res) => {
  const { username, password, classification } = req.body;
  if (!username || !password) {
      res.status(400).send('Missing required fields');
      return;
  }

  db.query('SELECT * FROM users WHERE username = ?', [username], (error, result) => {
      if (error) {
          console.log(error);
          res.status(500).send('Error registering user');
      } else if (result.length > 0) {
          res.status(409).send('Username already taken');
      } else {
          db.query('INSERT INTO users (username, password, is_admin, classification) VALUES (?, ?, 0, ?)', 
          [username, password, classification], (error, result) => {
              if (error) {
                  console.log(error);
                  res.status(500).send('Error registering user');
              } else {
                  res.status(201).send('User registered successfully');
              }
          });
      }
  });
});
app.get('/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => { // Corrected SQL query
    if (err) {
      console.error(err);
      res.status(500).send('Error fetching users');
    } else {
      res.status(200).json(results);
    }
  });
});

app.delete('/users/:userId', (req, res) => {
  const userId = req.params.userId;

  if (!userId) {
      return res.status(400).send('User ID is required');
  }

  db.query('DELETE FROM users WHERE id = ?', [userId], (err, result) => {
      if (err) {
          console.log(err);
          return res.status(500).send('Error deleting user');
      }

      if (result.affectedRows === 0) {
          return res.status(404).send('User not found');
      }

      res.status(200).send(`User with ID ${userId} deleted successfully`);
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

// Delete a channel by ID
app.delete('/channels', (req, res) => {
  const name = req.body.name;
  db.query('SELECT id FROM channels WHERE name = ?', [name], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error deleting channel');
    } else {
      const channelId = results[0].id;
      db.query('DELETE FROM posts WHERE channel_id = ?', [channelId], (err, results) => {
        if (err) {
          console.log(err);
          res.status(500).send('Error deleting posts');
        } else {
          db.query('DELETE FROM channels WHERE name = ?', [name], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error deleting channel');
    } else {
      res.status(200).send('Channel deleted successfully');
    }
  });
        }
      });
    }
  });
});



//POST post (make new posts in the a given channel )
app.post('/channels/:channelId/posts', upload.single('image'), (req, res) => {
  const channelId = req.params.channelId;
  const { content, author } = req.body;
  const imagePath = req.file ? req.file.path : null;
  console.log(req.file);
  console.log("Request body:", req.body);

  db.query('INSERT INTO posts (content, author, channel_id, likes, image_url) VALUES (?, ?, ?, 0, ?)',
        [content, author, channelId, imagePath], (err, results) => {
      if (err) {
          console.log(err);
          res.status(500).send('Error creating post');
      } else {
          res.status(201).send('Post created successfully');
          console.log("content:"+ content + "author: " +author);
      }
  });
});

app.use('/uploads', express.static('uploads'));

//like
app.post('/posts/:postId/like', (req, res) => {
  const postId = req.params.postId;
  db.query('UPDATE posts SET likes = likes + 1 WHERE id = ?', [postId], (err, result) => {
      if (err) {
          res.status(500).send('Error updating post');
      } else {
          res.status(200).send('Post liked successfully');
      }
  });
});

//dislike
app.post('/posts/:postId/dislike', (req, res) => {
  const postId = req.params.postId;
  db.query('UPDATE posts SET dislikes = dislikes + 1 WHERE id = ?', [postId], (err, result) => {
      if (err) {
          res.status(500).send('Error updating post');
      } else {
          res.status(200).send('Post liked successfully');
      }
  });
});



//GET post (get the post made)
app.get('/channels/:channelId/posts', upload.single('image'), (req, res) => {
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
  app.delete('/channels/:channelId/posts/:postId', (req, res) => {
    const channelId = req.params.channelId;
    const postId = req.params.postId;
    const author = req.body.author;
  
    // Add a condition to check if the author is 'admin'
    if (author === 'admin') {
      // First, delete comments associated with the post
      db.query('DELETE FROM comments WHERE post_id = ?', [postId], (err, results) => {
        if (err) {
          console.log(err);
          res.status(500).send('Error deleting comments');
        } else {
          // Then, delete the post itself
          db.query('DELETE FROM posts WHERE id = ? AND channel_id = ?', [postId, channelId], (err, results) => {
            if (err) {
              console.log(err);
              res.status(500).send('Error deleting post');
            } else {
              res.status(200).send('Post deleted successfully');
            }
          });
        }
      });
    } else {
      res.status(403).send('Unauthorized action');
    }
  });



  

//POST reply (make new reply and make nested reply to post made on the channel)
app.post('/posts/:postId/comments', upload.single('image'), (req, res) => {
  const { postId } = req.params;
  const { content, author, parent_id } = req.body;
  const imagePath = req.file ? req.file.path : null;
  
  if (!content) {
    return res.status(400).send('Comment content cannot be empty');
  }

  // Convert 'null' string to actual NULL value for SQL
  const parentId = parent_id === 'null' ? null : parent_id;

  db.query('INSERT INTO comments (content, author, image_url, post_id, parent_id) VALUES (?, ?, ?, ?, ?)',
    [content, author, imagePath, postId, parentId], (err, insertResults) => {
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



//DELETE reply ( the admin can delete replay)
app.delete('/comments/:commentId', (req, res) => {
  const { commentId } = req.params;

  db.query('DELETE FROM comments WHERE id = ?', [commentId], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send('Error deleting comment');
    }

    if (result.affectedRows === 0) {
      return res.status(404).send('Comment not found');
    }

    res.status(200).send('Comment deleted successfully');
  });
});



//search by string (search the post table)

app.get('/searchString', (req, res) => {
  const searchString = req.query.searchString;
  db.query('SELECT * FROM posts WHERE content LIKE ?', [`%${searchString}%`], (error, result) => {
    if (error) {
      console.log(error);
      res.status(500).send('Error fetching post');
    } else {
      res.status(200).json(result); // Corrected from 'results' to 'result'
    }
  });
});


//search by author (search the post by username)
app.get('/searchauthor', (req, res) => {
  const searchString = req.query.searchString;
  db.query('SELECT * FROM posts WHERE author LIKE ?', [`%${searchString}%`], (error, result) => {
    if (error) {
      console.log(error);
      res.status(500).send('Error fetching post');
    } else {
      res.status(200).json(result); // Corrected from 'results' to 'result'
    }
  });
});


//search by likes ( search by most like in the user table)
app.get('/searchlike', (req, res) => {
  db.query('SELECT * FROM posts ORDER BY likes DESC', (error, result) => {
    if (error) {
      console.log(error);
      res.status(500).send('Error fetching posts');
    } else {
      res.status(200).json(result);
    }
  });
});


app.listen(PORT, () => {
    console.log('server is running on port ' + PORT + ".");
});
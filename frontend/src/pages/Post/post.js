
// ./pages/Post/post.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Comment from '../Commit/Comment';

const Posts = ({ channelId }) => {
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState('');

  // Fetch posts when the component mounts or channelId changes
  useEffect(() => {
    fetchPosts();
  }, [channelId]);


  const fetchPosts = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:4000/channels/${channelId}/posts`);
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  }, [channelId]); // Dependency array



  
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  //make new post 
  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!channelId) {
      console.error('Channel ID is undefined');
      return;
    }
    try {
      await axios.post(`http://localhost:4000/channels/${channelId}/posts`, {
        content: newPostContent,
        author: 'YourAuthorName', 
      });
      setNewPostContent('');
      fetchPosts();
    } catch (error) {
      console.error('Error submitting post:', error);
    }
  };

  //handel like
  const handellike = async (e) => {

  };



  return (
    <div>
      <h1>Posts in Channel</h1>
      <form onSubmit={handlePostSubmit}>
        <input
          type="text"
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          placeholder="Write a post..."
        />
        <button type="submit">Post</button>
      </form>
      <ul>
        {posts.map(post => (
          <li key={post.id}>
            <p>{post.content}</p>
            <Comment postId={post.id} />
          </li>
        ))}
      </ul>
    </div>
 );
};

export default Posts;

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const Posts = ({ channelId }) => {
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState('');
  useEffect(() => {
    fetchPosts();
  }, [channelId]);



  const fetchPosts = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:4000/channels/:${channelId}/posts`);
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  }, [channelId]); // Dependency array

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts, channelId]);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:4000/channels/:${channelId}/posts`, {
        content: newPostContent,
        author: 'YourAuthorName', 
      });
      setNewPostContent('');
      fetchPosts();
    } catch (error) {
      console.error('Error submitting post:', error);
    }
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
            {/* Optional: Display comments here */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Posts;

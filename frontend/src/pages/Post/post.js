import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Comment from '../Commit/Comment';

const Posts = ({ channelId }) => {
    const [posts, setPosts] = useState([]);
    const [newPostContent, setNewPostContent] = useState('');
    const [image, setImage] = useState(null);

    const fetchPosts = useCallback(async () => {
        try {
            const response = await axios.get(`http://localhost:4000/channels/${channelId}/posts`);
            setPosts(response.data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    }, [channelId]);

    useEffect(() => {
        fetchPosts();
    }, [channelId, fetchPosts]);

    const handlePostSubmit = async (e) => {
      e.preventDefault();
      if (!channelId) {
          console.error('Channel ID is undefined');
          return;
      }
  
      const formData = new FormData();
      formData.append('content', newPostContent);
      formData.append('author', 'YourAuthorName'); // Replace 'YourAuthorName' with the actual author name variable if needed
      
      // Append image only if it has been selected
      if (image) {
          formData.append('image', image);
      }
  
      try {
          const config = {
              headers: {
                  'Content-Type': 'multipart/form-data',
              },
          };
          // Post the formData to the server
          await axios.post(`http://localhost:4000/channels/${channelId}/posts`, formData, config);
          
          // Clear the input fields after successful submission
          setNewPostContent('');
          setImage(null); // Clear the image from the state
          fetchPosts(); // Refetch posts to update the list
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
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => setImage(e.target.files[0])}
                  />
                <button type="submit">Post</button>
            </form>
            <ul>
            {posts.map(post => (
   <li key={post.id}>
    <p>{post.content}</p>
    {post.image_url ? <img src={`http://localhost:4000/${post.image_url}`} alt="Post" /> : null}
    <Comment postId={post.id} />
    </li>
))}
            </ul>
        </div>
    );
};

export default Posts;

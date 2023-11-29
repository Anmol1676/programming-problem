import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Comment from '../Commit/Comment';
import './post.css';

const Posts = ({ channelId }) => {
    const [posts, setPosts] = useState([]);
    const [newPostContent, setNewPostContent] = useState('');
    const [image, setImage] = useState(null);
    const [showImageModal, setShowImageModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

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

    const openImageModal = (imageUrl) => {
      setSelectedImage(imageUrl);
      setShowImageModal(true);
  };

  const closeImageModal = () => {
      setShowImageModal(false);
      setSelectedImage(null);
  };

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
    <div className="posts-container">
        <h1 className="posts-header">Posts in Channel</h1>
        <form className="new-post-form" onSubmit={handlePostSubmit}>
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
            <ul className="posts-list">
  {posts.map(post => (
    <li key={post.id}>
      <p>{post.content}</p>
      {post.image_url ? (
        <img
          src={`http://localhost:4000/${post.image_url}`}
          alt="Post"
          onClick={() => openImageModal(`http://localhost:4000/${post.image_url}`)}
          style={{ width: '150px', cursor: 'pointer' }} // Inline styles for the thumbnail
        />
      ) : null}
      <Comment postId={post.id} />
    </li>
  ))}
</ul>
            <div className={`full-size-image-modal ${showImageModal ? 'show' : ''}`} onClick={closeImageModal}>
                {showImageModal && <img src={selectedImage} alt="Full Size Post" />}
            </div>
        </div>
    );
};

export default Posts;

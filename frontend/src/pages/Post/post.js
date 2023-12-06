import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Comment from '../Commit/Comment';
import Prism from 'prismjs';
import './post.css';
import 'prismjs/themes/prism.css';
 


const Posts = ({ channelId, username, channelName }) => {
    const [posts, setPosts] = useState([]);
    const [newPostContent, setNewPostContent] = useState('');
    const [image, setImage] = useState(null);
    const [showImageModal, setShowImageModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    console.log("Username in Posts:", username); 
    
    


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
    }, [channelId]);
    
    useEffect(() => {
        if (posts.length > 0) {
            Prism.highlightAll();
        }
    }, [posts]);

    const openImageModal = (imageUrl) => {
        setSelectedImage(imageUrl);
        setShowImageModal(true);
    };

    const closeImageModal = () => {
        setShowImageModal(false);
        setSelectedImage(null);
    };
    
    const handleLike = async (postId) => {
        try {
            await axios.post(`http://localhost:4000/posts/${postId}/like`);
            await fetchPosts(); 
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };
    const handleDislike = async (postId) => {
        try {
            await axios.post(`http://localhost:4000/posts/${postId}/dislike`);
            fetchPosts(); // Re-fetch posts to update likes count
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };
    const deletePost = async (postId) => {
        try {
            await axios.delete(`http://localhost:4000/channels/${channelId}/posts/${postId}`, {
                data: { author: username } // Change this to the current logged-in user
            });
            setPosts(posts.filter((post) => post.id !== postId));
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    const handlePostSubmit = async (e) => {
      e.preventDefault();
      if (!channelId) {
          console.error('Channel ID is undefined');
          return;
      }
  
      const formData = new FormData();
      formData.append('content', newPostContent);
      formData.append('author', username); 
      console.log("FormData before sending:", Array.from(formData));

      
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
        await axios.post(`http://localhost:4000/channels/${channelId}/posts`, formData, config);
        setNewPostContent('');
        setImage(null);
        fetchPosts();
    } catch (error) {
        console.error('Error submitting post:', error);
    }

    
  };
  

  return (
    <div className="posts-container">
        <h1 className="posts-header">Posts in {channelName}</h1>
        <form className="new-post-form" onSubmit={handlePostSubmit}>
                
                <textarea
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
        <div>Posted by: {post.author}</div>
        
        {post.image_url && (
            <img
                className='pic'
                src={`http://localhost:4000/${post.image_url}`}
                alt="Post"
                onClick={() => openImageModal(`http://localhost:4000/${post.image_url}`)}
                style={{ width: '150px', cursor: 'pointer' }}
            />
        )}

        <div className="post-content">
            {post.content && (
                <p>
                    <pre><code className="language-javascript">{post.content}</code></pre>
                </p>
                
            )}
            {username === 'admin' && (
                <button onClick={() => deletePost(post.id)}
                >Delete</button>
              )}
        </div>

        <div className="post-interactions">
            <div className='like'>
                <button onClick={() => handleLike(post.id)}>Like</button>
                <span>{post.likes}</span>
            </div>
            
            <div className='dislike'>
                <button onClick={() => handleDislike(post.id)}>Dislike</button>
                <span>{post.dislikes}</span>
            </div>
        </div>

        <Comment postId={post.id} username={username}/>
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

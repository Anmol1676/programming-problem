import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
//import './Comment.css';

const Comment = ({ postId, username }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [parentCommentId, setParentCommentId] = useState(null);
  const [replyComment, setReplyComment] = useState('');
  const [replyImage, setReplyImage] = useState(null);  // State for reply image
  const [replyingToCommentId, setReplyingToCommentId] = useState(null);
  const [image, setImage] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const fetchComments = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:4000/posts/${postId}/comments`);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
    setSelectedImage(null);
  };

  const deleteComment = async (commentId) => {
    try {
      await axios.delete(`http://localhost:4000/comments/${commentId}`, {
        data: { author: username } 
      });
      setComments(comments.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const addComment = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('content', newComment);
      formData.append('author', username);  // Using the provided loginUsername
      formData.append('parent_id', parentCommentId);  // Include the parent comment ID

      if (image) {
        formData.append('image', image);
      }

      await axios.post(`http://localhost:4000/posts/${postId}/comments`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setImage(null);
      setNewComment('');
      setParentCommentId(null);
      fetchComments();  // Refetch comments to update the list
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const addReply = async (commentId) => {
    try {
      const formData = new FormData();
      formData.append('content', replyComment);
      formData.append('author', username);
      formData.append('parent_id', commentId);

      if (replyImage) {
        formData.append('image', replyImage);
      }

      await axios.post(`http://localhost:4000/posts/${postId}/comments`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setReplyImage(null);
      setReplyComment('');
      setReplyingToCommentId(null);
      fetchComments();  // Refetch comments to update the list
    } catch (error) {
      console.error('Error adding reply:', error);
    }
  };

  const renderComments = (comments, parentCommentId = null) => {
    return (
      <ul>
        {comments
          .filter(comment => comment.parent_id === parentCommentId)
          .map((comment) => (
            <li key={comment.id}>
              <p>{comment.content}</p>
              {username === 'admin' && (
              <button onClick={() => deleteComment(comment.id)}>Delete</button>
              )}
              <button onClick={() => setReplyingToCommentId(comment.id)}>Reply</button>
              {replyingToCommentId === comment.id && (
              <div className="reply-section">
                <input
                  type="text"
                  className="reply-input"
                  value={replyComment}
                  onChange={(e) => setReplyComment(e.target.value)}
                  placeholder="Write your reply here"
                />
                 <button className="reply-button" onClick={() => addReply(comment.id)}>Submit Reply</button>
               </div>
                )}
              <div class="posted-by">
                Posted by: {username}
              </div>
              {renderComments(comments, comment.id)} 
            </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="comment-container">
    <input
        type="text"
        className="comment-input"
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Add a comment"
    />
    <button className="comment-button" onClick={addComment}>Comment</button>
    <ul className="comments-list">
        {renderComments(comments)}
    </ul>
</div>
  );
};

export default Comment;

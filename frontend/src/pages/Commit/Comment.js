import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';


const Comment = ({ postId, loginUsername }) => {
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

  const addComment = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('content', newComment);
      formData.append('author', loginUsername);  // Using the provided loginUsername
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
      formData.append('author', loginUsername);
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
              <button onClick={() => setReplyingToCommentId(comment.id)}>Reply</button>
              {replyingToCommentId === comment.id && (
                <div>
                  <input
                    type="text"
                    value={replyComment}
                    onChange={(e) => setReplyComment(e.target.value)}
                    placeholder="Write your reply here"
                  />
                  
                  <button onClick={() => addReply(comment.id)}>Submit Reply</button>
                </div>
              )}
              {renderComments(comments, comment.id)} {/* Recursively render child comments */}
            </li>
        ))}
      </ul>
    );
  };

  return (
    <div>
      <input
        type="text"
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Add a comment"
      />
      <button onClick={addComment}>Comment</button>
      {renderComments(comments)}
    </div>
  );
};

export default Comment;

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const Comment = ({ postId, loginUsername }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:4000/posts/${postId}/comments`);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  },[postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  



  const addComment = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:4000/posts/${postId}/comments`, { 
        content: newComment, 
        author: 'YourAuthorName' });
      setNewComment('');
      fetchComments();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const deleteComment = async (commentId) => {
    try {
      await axios.delete(`http://localhost:4000/comments/${commentId}`);
      fetchComments();
    } catch (error) {
      console.error(`Error deleting comment:`, error);
    }
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
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>
            {comment.content}
            {loginUsername === 'admin' && (
              <button onClick={() => deleteComment(comment.id)}>Delete</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Comment;

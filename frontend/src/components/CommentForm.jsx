import { useState } from 'react';
import { createComment } from '../api/comments';

function CommentForm({ postId, onCommentAdded }) {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const newComment = await createComment(postId, content);
      onCommentAdded(newComment);
      setContent('');
    } catch (err) {
      setError('Failed to add comment.');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
      <textarea
        placeholder="Add a comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
        style={{ width: '100%', padding: '0.5rem' }}
        required
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit">Post Comment</button>
    </form>
  );
}

export default CommentForm;
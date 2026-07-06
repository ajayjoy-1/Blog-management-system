import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateComment, deleteComment } from '../api/comments';

function CommentItem({ comment, onUpdated, onDeleted }) {
  const { user } = useAuth();
  const isOwner = comment.author.id === user.id;

  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(comment.content);
  const [error, setError] = useState('');

  const handleSave = async () => {
    setError('');
    try {
      const updated = await updateComment(comment.id, content);
      onUpdated(updated);
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update comment.');
    }
  };

  const handleCancel = () => {
    setContent(comment.content);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await deleteComment(comment.id);
      onDeleted(comment.id);
    } catch (err) {
      setError('Failed to delete comment.');
    }
  };

  return (
    <div style={{ borderBottom: '1px solid #eee', padding: '0.5rem 0' }}>
      <strong>{comment.author.username}</strong>

      {isEditing ? (
        <div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={2}
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
          />
          <button onClick={handleSave}>Save</button>
          <button onClick={handleCancel} style={{ marginLeft: '0.5rem' }}>Cancel</button>
        </div>
      ) : (
        <p>{comment.content}</p>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {isOwner && !isEditing && (
        <div>
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={handleDelete} style={{ marginLeft: '0.5rem' }}>Delete</button>
        </div>
      )}
    </div>
  );
}

export default CommentItem;
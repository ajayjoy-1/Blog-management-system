import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPost, deletePost } from '../api/posts';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const data = await getPost(id);
        setPost(data);
      } catch (err) {
        setError('Post not found.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this post? This cannot be undone.')) return;

    try {
      await deletePost(id);
      navigate('/');
    } catch (err) {
      setError('Failed to delete post.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  const isOwner = post.author.id === user.id;

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
        <h2>{post.title}</h2>
        <small>
          By {post.author.username} · {new Date(post.created_at).toLocaleDateString()}
        </small>

        {isOwner && (
          <div style={{ margin: '0.5rem 0' }}>
            <Link to={`/posts/${id}/edit`}>Edit</Link>
            <button onClick={handleDelete} style={{ marginLeft: '1rem' }}>Delete</button>
          </div>
        )}

        <p style={{ whiteSpace: 'pre-wrap' }}>{post.content}</p>

        <hr />

        <h3>Comments ({post.comments.length})</h3>
        {post.comments.length === 0 && <p>No comments yet.</p>}
        {post.comments.map((comment) => (
          <div key={comment.id} style={{ borderBottom: '1px solid #eee', padding: '0.5rem 0' }}>
            <strong>{comment.author.username}</strong>
            <p>{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PostDetailPage;
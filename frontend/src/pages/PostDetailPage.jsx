import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPost, deletePost } from '../api/posts';
import Navbar from '../components/Navbar';
import CommentItem from '../components/CommentItem';
import CommentForm from '../components/CommentForm';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { useAuth } from '../context/AuthContext';

function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const data = await getPost(id);
        setPost(data);
        setComments(data.comments);
      } catch (err) {
        setError('Post not found.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleDeletePost = async () => {
    if (!window.confirm('Delete this post? This cannot be undone.')) return;
    try {
      await deletePost(id);
      navigate('/');
    } catch (err) {
      setError('Failed to delete post.');
    }
  };

  const handleCommentAdded = (newComment) => {
    setComments((prev) => [...prev, newComment]);
  };

  const handleCommentUpdated = (updatedComment) => {
    setComments((prev) =>
      prev.map((c) => (c.id === updatedComment.id ? updatedComment : c))
    );
  };

  const handleCommentDeleted = (deletedId) => {
    setComments((prev) => prev.filter((c) => c.id !== deletedId));
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  const isPostOwner = post.author.id === user.id;

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
        <h2>{post.title}</h2>
        <small>
          By {post.author.username} · {new Date(post.created_at).toLocaleDateString()}
        </small>

        {isPostOwner && (
          <div style={{ margin: '0.5rem 0' }}>
            <Link to={`/posts/${id}/edit`}>Edit</Link>
            <button onClick={handleDeletePost} style={{ marginLeft: '1rem' }}>Delete</button>
          </div>
        )}

        <p style={{ whiteSpace: 'pre-wrap' }}>{post.content}</p>

        <hr />

        <h3>Comments ({comments.length})</h3>
        {comments.length === 0 && <p>No comments yet.</p>}
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onUpdated={handleCommentUpdated}
            onDeleted={handleCommentDeleted}
          />
        ))}

        <CommentForm postId={post.id} onCommentAdded={handleCommentAdded} />
      </div>
    </div>
  );
}

export default PostDetailPage;
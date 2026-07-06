import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPost } from '../api/posts';
import Navbar from '../components/Navbar';

function PostDetailPage() {
  const { id } = useParams();
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
        <h2>{post.title}</h2>
        <small>
          By {post.author.username} · {new Date(post.created_at).toLocaleDateString()}
        </small>
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
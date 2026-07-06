import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPost, createPost, updatePost } from '../api/posts';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

function PostFormPage() {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(isEditMode);

  useEffect(() => {
    if (!isEditMode) return;

    const fetchPost = async () => {
      try {
        const data = await getPost(id);
        if (data.author.id !== user.id) {
          navigate('/');
          return;
        }
        setTitle(data.title);
        setContent(data.content);
      } catch (err) {
        setError('Could not load post.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, isEditMode, user.id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isEditMode) {
        await updatePost(id, { title, content });
        navigate(`/posts/${id}`);
      } else {
        const newPost = await createPost({ title, content });
        navigate(`/posts/${newPost.id}`);
      }
    } catch (err) {
      const data = err.response?.data;
      if (data) {
        const firstError = Object.values(data)[0];
        setError(Array.isArray(firstError) ? firstError[0] : String(firstError));
      } else {
        setError('Something went wrong. Please try again.');
      }
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
        <h2>{isEditMode ? 'Edit Post' : 'New Post'}</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
              required
            />
          </div>
          <div>
            <textarea
              placeholder="Write your post..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
              required
            />
          </div>
          <button type="submit">{isEditMode ? 'Save Changes' : 'Publish'}</button>
        </form>
      </div>
    </div>
  );
}

export default PostFormPage;
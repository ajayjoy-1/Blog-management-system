import { Link } from 'react-router-dom';

function PostCard({ post }) {
  const preview =
    post.content.length > 150
      ? post.content.slice(0, 150) + '...'
      : post.content;

  return (
    <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
      <h3>
        <Link to={`/posts/${post.id}`}>{post.title}</Link>
      </h3>
      <p>{preview}</p>
      <small>
        By {post.author.username} · {new Date(post.created_at).toLocaleDateString()} ·{' '}
        {post.comments_count} comment{post.comments_count !== 1 ? 's' : ''}
      </small>
    </div>
  );
}

export default PostCard;
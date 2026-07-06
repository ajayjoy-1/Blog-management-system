import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid #ddd' }}>
      <div>
        <Link to="/">Blog</Link>
        <Link to="/posts/new" style={{ marginLeft: '1rem' }}>New Post</Link>
      </div>
      <div>
        <span>Hello, {user.username}</span>
        <button onClick={logout} style={{ marginLeft: '1rem' }}>Log Out</button>
      </div>
    </nav>
  );
}

export default Navbar;
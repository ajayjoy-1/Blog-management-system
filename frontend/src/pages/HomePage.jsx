import { useAuth } from '../context/AuthContext';

function HomePage() {
  const { user, logout } = useAuth();

  return (
    <div>
      <h2>Welcome, {user.username}!</h2>
      <button onClick={logout}>Log Out</button>
    </div>
  );
}

export default HomePage;
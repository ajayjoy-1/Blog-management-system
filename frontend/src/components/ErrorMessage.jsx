function ErrorMessage({ message }) {
  if (!message) return null;
  return <p style={{ color: '#c0392b', fontWeight: 'bold' }}>{message}</p>;
}

export default ErrorMessage;
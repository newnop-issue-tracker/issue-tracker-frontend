import { Link } from 'react-router-dom';

export function Logo() {
  return (
    <Link to="/" className="logo">
      <span className="logo-mark">/</span>IssueFlow
    </Link>
  );
}

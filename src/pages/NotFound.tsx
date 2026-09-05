import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="card flex flex-col items-center justify-center px-6 py-20 text-center">
      <div className="font-mono text-4xl text-brand">404</div>
      <p className="mt-3 text-sm text-ink-soft">That route does not exist in the Academy.</p>
      <Link to="/" className="btn-primary mt-4">Back to dashboard</Link>
    </div>
  );
}

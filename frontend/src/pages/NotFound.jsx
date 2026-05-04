import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-xl rounded-3xl bg-white p-10 shadow-xl text-center">
        <h1 className="text-5xl font-bold text-slate-900">404</h1>
        <p className="mt-4 text-xl text-slate-600">Page not found.</p>
        <Link to="/dashboard" className="mt-8 inline-flex rounded-2xl bg-slate-900 px-6 py-3 text-white hover:bg-slate-700">
          Back to dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

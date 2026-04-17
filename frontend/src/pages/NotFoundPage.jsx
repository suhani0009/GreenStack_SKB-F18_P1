import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="panel-surface max-w-lg px-8 py-10 text-center">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">404</p>
        <h1 className="mt-4 text-3xl font-semibold">Page not found</h1>
        <p className="mt-3 text-sm text-slate-500">The page you requested does not exist in this GreenStack workspace.</p>
        <Link className="btn-primary mt-6" to="/dashboard">
          Return to dashboard
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;

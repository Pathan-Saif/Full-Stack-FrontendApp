import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div className="max-w-md text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">404</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-800">Page not found</h1>
        <p className="mt-2 text-sm text-slate-500">The page you are looking for does not exist.</p>
        <Link to="/dashboard" className="btn-primary mt-6 inline-block">Go to dashboard</Link>
      </div>
    </div>
  )
}

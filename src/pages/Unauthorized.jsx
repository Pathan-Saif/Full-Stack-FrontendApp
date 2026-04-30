import { Link } from 'react-router-dom'
import { FiShield } from 'react-icons/fi'

export default function Unauthorized() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-red-100">
          <FiShield className="h-6 w-6 text-red-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800">Access denied</h1>
        <p className="mt-2 text-sm text-slate-500">You do not have permission to open this page.</p>
        <Link to="/dashboard" className="btn-primary mt-6 inline-block">Go to dashboard</Link>
      </div>
    </div>
  )
}

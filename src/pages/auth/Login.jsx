import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { getErrorMessage } from '../../utils/helpers'
import toast from 'react-hot-toast'
import { FiMail, FiLock, FiCheckSquare } from 'react-icons/fi'

export default function Login() {
  const [form, setForm]       = useState({ email: '', password: '' })
  const [errors, setErrors]   = useState({})
  const [loading, setLoading] = useState(false)
  const { login }   = useAuth()
  const navigate    = useNavigate()

  function validate() {
    const errs = {}
    if (!form.email)    errs.email    = 'Email is required'
    if (!form.password) errs.password = 'Password is required'
    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    try {
      const user = await login(form.email, form.password)
      toast.success(`Welcome back, ${user.name}!`)
      navigate(user.role === 'ADMIN' ? '/dashboard/admin' : '/dashboard/member')
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' })
  }

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 flex-col justify-center px-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
            <FiCheckSquare className="text-white w-5 h-5" />
          </div>
          <span className="text-white text-xl font-bold">TeamTask</span>
        </div>
        <h2 className="text-4xl font-bold text-white leading-tight mb-4">
          Manage projects.<br />Track tasks.<br />Ship together.
        </h2>
        <p className="text-slate-400 text-base">
          Role-based task management for teams that want to move fast and stay organized.
        </p>

        {/* Demo credentials */}
        <div className="mt-10 space-y-3">
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Demo Credentials</p>
          <div className="bg-slate-800 rounded-lg p-4 space-y-2 text-sm">
            <div>
              <p className="text-slate-400 text-xs mb-1">Admin</p>
              <p className="text-slate-200">admin@teamtask.com / <span className="text-indigo-400">Admin@123</span></p>
            </div>
            <div className="border-t border-slate-700 pt-2">
              <p className="text-slate-400 text-xs mb-1">Member</p>
              <p className="text-slate-200">member@teamtask.com / <span className="text-indigo-400">Member@123</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 lg:hidden">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <FiCheckSquare className="text-white w-4 h-4" />
              </div>
              <span className="font-bold text-slate-800 text-lg">TeamTask</span>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-slate-800 mb-2">Sign in</h1>
          <p className="text-slate-500 text-sm mb-8">Enter your credentials to access your workspace</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="label">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={`input-field pl-10 ${errors.email ? 'border-red-400 focus:ring-red-400' : ''}`}
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`input-field pl-10 ${errors.password ? 'border-red-400 focus:ring-red-400' : ''}`}
                />
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-2.5 text-sm"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-indigo-600 hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
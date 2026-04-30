import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FiCheckSquare, FiLock, FiMail, FiUser } from 'react-icons/fi'
import { useAuth } from '../../hooks/useAuth'
import { getErrorMessage } from '../../utils/helpers'

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'MEMBER' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const { signup } = useAuth()
  const navigate = useNavigate()

  function validate() {
    const next = {}
    if (!form.name.trim()) next.name = 'Name is required'
    if (!form.email.trim()) next.email = 'Email is required'
    if (!form.password || form.password.length < 6) next.password = 'Password must be at least 6 characters'
    return next
  }

  function handleChange(e) {
    setForm((current) => ({ ...current, [e.target.name]: e.target.value }))
    if (errors[e.target.name]) setErrors((current) => ({ ...current, [e.target.name]: '' }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const next = validate()
    if (Object.keys(next).length) {
      setErrors(next)
      return
    }

    setLoading(true)
    try {
      const user = await signup(form.name.trim(), form.email.trim(), form.password, form.role)
      toast.success(`Welcome, ${user.name}!`)
      navigate(user.role === 'ADMIN' ? '/dashboard/admin' : '/dashboard/member')
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-2">
      <div className="hidden bg-slate-900 px-16 lg:flex lg:flex-col lg:justify-center">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
            <FiCheckSquare className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white">TeamTask</span>
        </div>
        <h2 className="text-4xl font-bold leading-tight text-white">Create a workspace account.</h2>
        <p className="mt-4 text-sm text-slate-400">Admins manage projects and assignments. Members track and update their own work.</p>
      </div>

      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold text-slate-800">Sign up</h1>
          <p className="mb-8 mt-2 text-sm text-slate-500">Create your TeamTask account</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Name</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input name="name" value={form.name} onChange={handleChange} className={`input-field pl-10 ${errors.name ? 'border-red-400' : ''}`} placeholder="Your name" />
              </div>
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
            </div>

            <div>
              <label className="label">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input name="email" type="email" value={form.email} onChange={handleChange} className={`input-field pl-10 ${errors.email ? 'border-red-400' : ''}`} placeholder="you@example.com" />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input name="password" type="password" value={form.password} onChange={handleChange} className={`input-field pl-10 ${errors.password ? 'border-red-400' : ''}`} placeholder="At least 6 characters" />
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
            </div>

            <div>
              <label className="label">Role</label>
              <select name="role" value={form.role} onChange={handleChange} className="input-field">
                <option value="MEMBER">Member</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            <button disabled={loading} className="btn-primary w-full py-2.5 text-sm">
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account? <Link to="/login" className="font-medium text-indigo-600 hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

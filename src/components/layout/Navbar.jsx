import { useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

// Map routes to page titles
function getPageTitle(pathname) {
  if (pathname.includes('/dashboard/admin'))  return 'Admin Dashboard'
  if (pathname.includes('/dashboard/member')) return 'My Dashboard'
  if (pathname.includes('/projects/new'))     return 'New Project'
  if (pathname.includes('/edit'))             return 'Edit'
  if (pathname.includes('/projects'))         return 'Projects'
  if (pathname.includes('/tasks/new'))        return 'New Task'
  if (pathname.includes('/tasks/my'))         return 'My Tasks'
  return 'Team Task Manager'
}

export default function Navbar() {
  const { pathname } = useLocation()
  const { user } = useAuth()
  const title = getPageTitle(pathname)

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6 sticky top-0 z-20">
      <div className="flex-1">
        <h1 className="text-lg font-semibold text-slate-800">{title}</h1>
      </div>

      {/* Right side — greeting */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-500">
          Welcome, <span className="font-medium text-slate-700">{user?.name}</span>
        </span>
      </div>
    </header>
  )
}
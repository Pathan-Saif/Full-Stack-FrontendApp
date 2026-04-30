import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { getInitials } from '../../utils/helpers'
import {
  FiGrid, FiFolder, FiCheckSquare,
  FiLogOut, FiShield, FiUser
} from 'react-icons/fi'

// Sidebar nav items per role
const adminLinks = [
  { to: '/dashboard/admin', icon: FiGrid,        label: 'Dashboard' },
  { to: '/projects',        icon: FiFolder,      label: 'Projects'  },
  { to: '/tasks/my',        icon: FiCheckSquare, label: 'My Tasks'  },
]

const memberLinks = [
  { to: '/dashboard/member', icon: FiGrid,        label: 'Dashboard' },
  { to: '/projects',         icon: FiFolder,      label: 'Projects'  },
  { to: '/tasks/my',         icon: FiCheckSquare, label: 'My Tasks'  },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const links = user?.role === 'ADMIN' ? adminLinks : memberLinks

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <aside className="w-64 min-h-screen bg-slate-900 flex flex-col fixed left-0 top-0 z-30">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <FiCheckSquare className="text-white w-4 h-4" />
          </div>
          <span className="font-bold text-white text-base tracking-tight">TeamTask</span>
        </div>
      </div>

      {/* Role badge */}
      <div className="px-6 py-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          {user?.role === 'ADMIN'
            ? <FiShield className="text-indigo-400 w-3.5 h-3.5" />
            : <FiUser   className="text-slate-400 w-3.5 h-3.5" />
          }
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            {user?.role}
          </span>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`
            }
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User profile + Logout */}
      <div className="px-3 py-4 border-t border-slate-800">
        {/* User info */}
        <div className="flex items-center gap-3 px-3 py-2.5 mb-1">
          <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">{getInitials(user?.name)}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
        >
          <FiLogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  )
}
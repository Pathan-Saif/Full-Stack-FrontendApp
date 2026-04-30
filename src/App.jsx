import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'

// Layouts & Route Guards
import AppLayout     from './components/layout/AppLayout'
import ProtectedRoute  from './routes/ProtectedRoute'
import RoleBasedRoute  from './routes/RoleBasedRoute'

// Auth Pages
import Login   from './pages/auth/Login'
import Signup  from './pages/auth/Signup'

// Dashboard Pages
import AdminDashboard  from './pages/dashboard/AdminDashboard'
import MemberDashboard from './pages/dashboard/MemberDashboard'

// Project Pages
import ProjectList   from './pages/projects/ProjectList'
import ProjectDetail from './pages/projects/ProjectDetail'
import ProjectForm   from './pages/projects/ProjectForm'

// Task Pages
import MyTasks  from './pages/tasks/MyTasks'
import TaskForm from './pages/tasks/TaskForm'

// Error Pages
import NotFound      from './pages/NotFound'
import Unauthorized  from './pages/Unauthorized'

export default function App() {
  const { user } = useAuth()

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login"  element={!user ? <Login />  : <Navigate to="/dashboard" />} />
      <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/dashboard" />} />

      {/* Protected routes — all inside AppLayout (sidebar + navbar) */}
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>

        {/* Smart redirect: /dashboard → role-specific page */}
        <Route
          path="/dashboard"
          element={
            user?.role === 'ADMIN'
              ? <Navigate to="/dashboard/admin" />
              : <Navigate to="/dashboard/member" />
          }
        />

        {/* Admin-only dashboard */}
        <Route
          path="/dashboard/admin"
          element={<RoleBasedRoute allowedRoles={['ADMIN']}><AdminDashboard /></RoleBasedRoute>}
        />

        {/* Member-only dashboard */}
        <Route
          path="/dashboard/member"
          element={<RoleBasedRoute allowedRoles={['MEMBER']}><MemberDashboard /></RoleBasedRoute>}
        />

        {/* Projects — all authenticated users can view */}
        <Route path="/projects"        element={<ProjectList />} />
        <Route path="/projects/:id"    element={<ProjectDetail />} />

        {/* Create / Edit Project — ADMIN only */}
        <Route
          path="/projects/new"
          element={<RoleBasedRoute allowedRoles={['ADMIN']}><ProjectForm /></RoleBasedRoute>}
        />
        <Route
          path="/projects/:id/edit"
          element={<RoleBasedRoute allowedRoles={['ADMIN']}><ProjectForm /></RoleBasedRoute>}
        />

        {/* Tasks */}
        <Route path="/tasks/my" element={<MyTasks />} />

        {/* Create / Edit Task — ADMIN only */}
        <Route
          path="/projects/:projectId/tasks/new"
          element={<RoleBasedRoute allowedRoles={['ADMIN']}><TaskForm /></RoleBasedRoute>}
        />
        <Route
          path="/tasks/:taskId/edit"
          element={<RoleBasedRoute allowedRoles={['ADMIN']}><TaskForm /></RoleBasedRoute>}
        />
      </Route>

      {/* Error pages */}
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/"             element={<Navigate to="/dashboard" />} />
      <Route path="*"             element={<NotFound />} />
    </Routes>
  )
}
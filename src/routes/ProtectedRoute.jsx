import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Loader from '../components/common/Loader'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  // Wait for auth state to restore from localStorage
  if (loading) return <Loader fullScreen />

  return user ? children : <Navigate to="/login" replace />
}
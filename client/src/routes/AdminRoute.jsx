import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { selectCurrentRole } from '../features/auth/authSlice'

export default function AdminRoute({ children }){
  const isAuth = useSelector(s => s.auth.isAuthenticated)
  const role = useSelector(selectCurrentRole)
  if(!isAuth) return <Navigate to="/" replace />
  if(role !== 'admin') return <Navigate to="/app/reportar" replace />
  return children
}

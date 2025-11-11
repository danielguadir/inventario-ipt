import { useSelector } from 'react-redux'
export default function useAuthGuard(){
  const isAuth = useSelector(s => s.auth.isAuthenticated)
  const user = useSelector(s => s.auth.currentUserName)
  return { isAuth, user }
}

import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../features/auth/authSlice'
import { useNavigate } from 'react-router-dom'

export default function Topbar(){
  const user = useSelector(s => s.auth.currentUserName)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  return (
    <div className="topbar">
      <div>Bienvenido, <b>{user || '-'}</b></div>
      <button className="btn" onClick={()=>{
        dispatch(logout()); navigate('/', { replace:true })
      }}>Salir</button>
    </div>
  )
}

import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import { login } from '../features/auth/authSlice'
import { useNavigate } from 'react-router-dom'

export default function LoginPage(){
  const users = useSelector(s => s.auth.users)
  const error = useSelector(s => s.auth.error)
  const [user, setUser] = useState(users[0] || '')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const onSubmit = (e) => {
    e.preventDefault()
    dispatch(login({ user, password }))
    // usamos un timeout corto para leer el store ya actualizado
    setTimeout(()=> navigate('/app/reportar'), 50)
  }

  return (
    <div style={{display:'grid', placeItems:'center', height:'100vh'}}>
      <form onSubmit={onSubmit} className="card" style={{minWidth:360}}>
        <h2 style={{marginTop:0}}>Ingresar</h2>
        <label className="grid" style={{gap:6}}>
          <span>Usuario</span>
          <select className="select" value={user} onChange={e=>setUser(e.target.value)}>
            {users.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
        </label>
        <label className="grid" style={{gap:6}}>
          <span>Contraseña</span>
          <input className="input" type="password" value={password}
                 onChange={e=>setPassword(e.target.value)} placeholder="usuarioiptotal"/>
        </label>
        {error && <div style={{color:'crimson'}}>{error}</div>}
        <div style={{display:'flex', justifyContent:'flex-end', marginTop:12}}>
          <button className="btn" type="submit">Entrar</button>
        </div>
      </form>
    </div>
  )
}

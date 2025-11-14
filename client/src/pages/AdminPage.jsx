import { useSelector } from 'react-redux'
export default function AdminPage(){
  const user = useSelector(s => s.auth.currentUserName)
  return (
    <div className="card">
      <h2 style={{marginTop:0}}>Panel de administración</h2>
      <p>Bienvenido, <b>{user}</b>. Solo admins ven esta sección.</p>
    </div>
  )
}

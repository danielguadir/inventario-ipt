// client/src/components/Sidebar.jsx
import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectIsAdmin } from '../features/auth/authSlice'   // 

export default function Sidebar(){
  const isAdmin = useSelector(selectIsAdmin) // true solo para Daniel/Brandom

  return (
    <aside className="sidebar">
      <div style={{fontWeight:700, fontSize:18, marginBottom:8}}>
        Inventario IP Total
      </div>

      <NavLink to="/app/reportar">Reportar equipo</NavLink>
      <NavLink to="/app/stand">Stand de equipos</NavLink>
      <NavLink to="/app/mis">Mis solicitudes</NavLink>
      <NavLink to="/app/mias">Mis equipos</NavLink>

      {isAdmin && (
        <>
          <hr style={{opacity:.2, border:'none', borderTop:'1px solid rgba(255,255,255,.2)'}}/>
          <NavLink to="/app/admin">Panel admin</NavLink>
        </>
      )}

      <div style={{marginTop:'auto', fontSize:12, opacity:.85}}>
        IP TOTAL SOFTWARE
      </div>
    </aside>
  )
}

import { NavLink } from 'react-router-dom'

export default function Sidebar(){
  return (
    <aside className="sidebar">
      <div style={{fontWeight:700,fontSize:18, marginBottom:8}}>Inventario IP Total</div>
      <NavLink to="/app/reportar">Reportar equipo</NavLink>
      <NavLink to="/app/stand">Stand de equipos</NavLink>
      <NavLink to="/app/mis">Mis solicitudes</NavLink>
      <div style={{marginTop:'auto', fontSize:12, opacity:.85}}>
        Diseño estilo Odoo · MVP
      </div>
    </aside>
  )
}

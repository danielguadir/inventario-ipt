import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addUser, selectIsAdmin, deleteUser } from '../features/auth/authSlice'
import { assignItemToUser, unassignItemFromUser } from '../features/inventory/inventorySlice'
import { updateRequestStatus } from '../features/requests/requestsSlice'
import { selectNotifications, removeNotification } from '../features/notifications/notificationsSlice'

export default function AdminPage(){
  const dispatch = useDispatch()
  const isAdmin = useSelector(selectIsAdmin)
  const current = useSelector(s => s.auth.currentUserName)
  const users = useSelector(s => s.auth.users)
  const items = useSelector(s => s.inventory.items)
  const requests = useSelector(s => s.requests.list)
  const notifications = useSelector(selectNotifications)

  const [newUser, setNewUser] = useState('')
  const [selectedByItem, setSelectedByItem] = useState({})
  const [openUserMenu, setOpenUserMenu] = useState('')
  const [tab, setTab] = useState('Usuarios')

  if(!isAdmin) return (
    <div className="card">
      <h2 style={{marginTop:0}}>Acceso denegado</h2>
      <p>Necesitas permisos de administrador para ver esta sección.</p>
    </div>
  )

  return (
    <div style={{display:'grid', gap:12}}>
      <div className="card">
        <h2 style={{marginTop:0}}>Panel de administración</h2>
        <p>Bienvenido, <b>{current}</b>. Aquí puedes gestionar usuarios, inventario y solicitudes.</p>
      </div>

      <div className="card">
        <div className="admin-tabs">
          {['Usuarios','Inventario','Solicitudes','Notificaciones'].map(t => (
            <div key={t} className={`admin-tab ${t===tab ? 'active' : ''}`} onClick={()=>setTab(t)}>{t}</div>
          ))}
        </div>

        {tab === 'Usuarios' && (
          <div>
            <h3>Usuarios</h3>
            <div style={{display:'flex', gap:8}}>
              <input className="input" value={newUser} onChange={e=>setNewUser(e.target.value)} placeholder="Nombre usuario" />
              <button className="btn" onClick={()=>{ if(newUser.trim()){ dispatch(addUser(newUser.trim())); setNewUser('') } }}>Agregar</button>
            </div>
            <ul style={{listStyle:'none', padding:0}}>
              {users.map(u => (
                <li key={u} style={{display:'flex', alignItems:'center', justifyContent:'space-between', padding:'6px 0'}}>
                  <div>{u}</div>
                  <div style={{position:'relative'}}>
                    <button className="btn" onClick={()=>setOpenUserMenu(openUserMenu === u ? '' : u)}>Acciones ▾</button>
                    {openUserMenu === u && (
                      <div style={{position:'absolute', right:0, marginTop:6, background:'#fff', border:'1px solid #ddd', borderRadius:6, padding:6, zIndex:10}}>
                        <div style={{display:'flex', flexDirection:'column', gap:6}}>
                          <button className="btn" onClick={()=>{
                            setOpenUserMenu('')
                            if(window.confirm(`¿Seguro que quieres eliminar al usuario ${u}?`)){
                              dispatch(deleteUser(u))
                            }
                          }}>Eliminar</button>
                          <button className="btn" onClick={()=>setOpenUserMenu('')}>Cancelar</button>
                        </div>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {tab === 'Inventario' && (
          <div>
            <h3>Inventario (asignar a usuario)</h3>
            <div style={{display:'grid', gap:8}}>
              {(() => {
                const itemsSorted = [...items].sort((a,b) => (a.assignedTo ? 1 : 0) - (b.assignedTo ? 1 : 0))
                return itemsSorted.map(item => (
                  <div key={item.id} style={{display:'flex', alignItems:'center', gap:8, padding:8, background: item.assignedTo ? '#f3f3f3' : 'transparent', borderRadius:6}}>
                    <div style={{flex:1}}>
                      <b>{item.marca} {item.tipo}</b> · <small>{item.serial} · {item.id}</small>
                      <div>Estado: {item.estado} · Ubicación: {item.ubicacion} · {item.assignedTo ? `Asignado a ${item.assignedTo}` : 'Disponible'}</div>
                    </div>
                    {item.assignedTo ? (
                      <div style={{display:'flex', gap:8}}>
                        <button className="btn" disabled style={{opacity:0.8}}>Asignado</button>
                        <button className="btn" onClick={()=>dispatch(unassignItemFromUser({ id: item.id, user: item.assignedTo }))}>Retirar</button>
                      </div>
                    ) : (
                      <>
                        <select value={selectedByItem[item.id] || ''} onChange={e=>setSelectedByItem(s=>({...s, [item.id]: e.target.value}))}>
                          <option value="">-- seleccionar usuario --</option>
                          {users.map(u => <option key={u} value={u}>{u}</option>)}
                        </select>
                        <button className="btn" onClick={()=>{
                          const user = selectedByItem[item.id]
                          if(user) dispatch(assignItemToUser({ id: item.id, user }))
                        }}>Asignar</button>
                      </>
                    )}
                  </div>
                ))
              })()}
            </div>
          </div>
        )}

        {tab === 'Notificaciones' && (
          <div>
            <h3>Notificaciones</h3>
            <div style={{display:'grid', gap:8}}>
              {notifications.length === 0 && <div>No hay notificaciones</div>}
              {notifications.map(n => (
                <div key={n.id} style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                  <div>
                    <div><b>{n.type}</b> · {n.message}</div>
                    <div><small>{n.user} · {new Date(n.dateISO).toLocaleString()}</small></div>
                  </div>
                  <div style={{display:'flex', gap:8}}>
                    <button className="btn" onClick={()=>{
                      if(n.type === 'request_retire'){
                        dispatch(unassignItemFromUser({ id: n.itemId, user: n.user }))
                      }
                      dispatch(removeNotification(n.id))
                    }}>Procesar</button>
                    <button className="btn" onClick={()=>dispatch(removeNotification(n.id))}>Eliminar</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'Solicitudes' && (
          <div>
            <h3>Solicitudes</h3>
            <div style={{display:'grid', gap:8}}>
              {requests.length === 0 && <div>No hay solicitudes</div>}
              {requests.map(r => (
                <div key={r.id} style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                  <div>
                    <b>{r.tipo} {r.otroNombre || ''}</b> · <small>{r.serial}</small>
                    <div>Por: {r.userName} · Fecha: {new Date(r.fechaISO).toLocaleString()} · Estado: {r.status || 'pendiente'}</div>
                  </div>
                  <div style={{display:'flex', gap:8}}>
                    {(() => {
                      const isApproved = r.status === 'approved'
                      const isRejected = r.status === 'rejected'
                      if (isApproved) {
                        return <button className="btn" disabled style={{opacity:0.8}}>Aprobado</button>
                      }
                      if (isRejected) {
                        return <button className="btn" disabled style={{opacity:0.8}}>Rechazado</button>
                      }
                      // estado pendiente (o undefined): mostrar ambas opciones
                      return (
                        <>
                          <button className="btn" onClick={() => {
                            dispatch(updateRequestStatus({ id: r.id, status: 'approved' }))
                            const found = items.find(i => i.serial === r.serial)
                            if (found) dispatch(assignItemToUser({ id: found.id, user: r.userName }))
                          }}>Aprobar</button>
                          <button className="btn" onClick={() => dispatch(updateRequestStatus({ id: r.id, status: 'rejected' }))}>Rechazar</button>
                        </>
                      )
                    })()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

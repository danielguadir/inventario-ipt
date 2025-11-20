import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Table from '../components/Table'
import { addNotification } from '../features/notifications/notificationsSlice'
import { confirmItemByUser } from '../features/inventory/inventorySlice'

export default function MisEquiposPage(){
  const user = useSelector(s => s.auth.currentUserName)
  // usar inventory como fuente de la verdad: items asignados al usuario
  const allItems = useSelector(s => s.inventory.items)
  const items = allItems.filter(i => i.assignedTo === user)
  const dispatch = useDispatch()
  const [q, setQ] = useState('')
  const [acceptedIds, setAcceptedIds] = useState([])
  const [showGlobalCheck, setShowGlobalCheck] = useState(false)

  // Filtro (nombre, serial, categoría, estado, ubicación, obs)
  const filtered = useMemo(()=>{
    const s = q.trim().toLowerCase()
    if(!s) return items
    return items.filter(i =>
      (i.nombre||'').toLowerCase().includes(s) ||
      (i.serial||'').toLowerCase().includes(s) ||
      (i.categoria||'').toLowerCase().includes(s) ||
      (i.estado||'').toLowerCase().includes(s) ||
      (i.ubicacion||'').toLowerCase().includes(s) ||
      (i.obs||'').toLowerCase().includes(s)
    )
  }, [q, items])

  const columns = [
    { key:'marca', header:'Nombre' },
    { key:'serial', header:'Serial' },
    { key:'tipo', header:'Tipo' },
    { key:'estado', header:'Estado' },
    { key:'ubicacion', header:'Ubicación' },
    { key:'obs', header:'Obs.' },
    {
      key:'acc',
      header:'Acciones',
      render: r => (
        <div style={{display:'flex', alignItems:'center', gap:8}}>
              {(() => {
                const accepted = r.confirmedByUser || acceptedIds.includes(r.id)
                if(!accepted) {
                  return (
                    <button
                      className="btn"
                      onClick={() => {
                        // dispatch notification to admin that user accepted the equipo
                        dispatch(addNotification({ type: 'accepted', itemId: r.id, user, message: `Usuario ${user} acepta el equipo ${r.marca || r.tipo || r.id}` }))
                        // persist confirmation in inventory and show overlay briefly
                        dispatch(confirmItemByUser({ id: r.id, user }))
                        setAcceptedIds(a => [...a, r.id])
                        setShowGlobalCheck(true)
                        setTimeout(()=>setShowGlobalCheck(false), 1400)
                      }}
                    >
                      Aceptar
                    </button>
                  )
                }
                return <span className="inline-check">✓</span>
              })()}
        </div>
      )
    },
  ]

  return (
    <div>
      {showGlobalCheck && (
        <div className="global-check-overlay">
          <div className="global-check-card">
            <div className="global-check-icon">✓</div>
          </div>
        </div>
      )}

    <div className="grid" style={{gap:12}}>
      {/* Buscador */}
      <div className="card" style={{marginBottom:0}}>
        <input
          className="input"
          placeholder="Buscar por nombre, serial, tipo, estado, ubicación u obs."
          value={q}
          onChange={e=>setQ(e.target.value)}
        />
      </div>

      {/* Tabla */}
      <div className="card">
        <Table columns={columns} data={filtered}/>
      </div>
    </div>
    </div>
  )
}

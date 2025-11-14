import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Table from '../components/Table'
import { loadMyItemsFor, removeMyItem, selectMyItems } from '../features/myitems/myItemsSlice'

export default function MisEquiposPage(){
  const user = useSelector(s => s.auth.currentUserName)
  const items = useSelector(selectMyItems)
  const dispatch = useDispatch()
  const [q, setQ] = useState('')

  // Cargar mis items al entrar o si cambia el usuario
  useEffect(()=>{ if(user) dispatch(loadMyItemsFor(user)) }, [user, dispatch])

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
    { key:'nombre', header:'Nombre' },
    { key:'serial', header:'Serial' },
    { key:'categoria', header:'Categoría' },
    { key:'estado', header:'Estado' },
    { key:'ubicacion', header:'Ubicación' },
    { key:'obs', header:'Obs.' },
    {
      key:'acc',
      header:'Acciones',
      render: r => (
        <button className="btn" onClick={() => dispatch(removeMyItem(r.id))}>
          Eliminar
        </button>
      )
    },
  ]

  return (
    <div className="grid" style={{gap:12}}>
      {/* Buscador */}
      <div className="card" style={{marginBottom:0}}>
        <input
          className="input"
          placeholder="Buscar por nombre, serial, categoría, estado, ubicación u obs."
          value={q}
          onChange={e=>setQ(e.target.value)}
        />
      </div>

      {/* Tabla */}
      <div className="card">
        <Table columns={columns} data={filtered}/>
      </div>
    </div>
  )
}

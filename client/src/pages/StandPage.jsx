import { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectGroups, selectItemsByGroup } from '../features/inventory/inventorySlice'
import Table from '../components/Table'
import StandFilters from '../components/StandFilters'

export default function StandPage(){
  const groups = useSelector(selectGroups)
  const [tab, setTab] = useState(groups[0])
  const items = useSelector(selectItemsByGroup(tab))
  const [q, setQ] = useState('')

  const filtered = useMemo(()=>{
    const s = q.trim().toLowerCase()
    if(!s) return items
    return items.filter(i => (
      (i.serial||'').toLowerCase().includes(s) ||
      (i.marca||'').toLowerCase().includes(s) ||
      (i.tipo||'').toLowerCase().includes(s) ||
      (i.estado||'').toLowerCase().includes(s) ||
      (i.ubicacion||'').toLowerCase().includes(s)
    ))
  }, [q, items])

  const columns = [
    { key:'tipo', header:'Tipo' },
    { key:'serial', header:'Serial' },
    { key:'marca', header:'Marca' },
    { key:'disco', header:'Disco' },
    { key:'estado', header:'Estado' },
    { key:'ubicacion', header:'Ubicación' },
  ]

  return (
    <div className="grid" style={{gap:12}}>
      <div className="card" style={{display:'flex', gap:8}}>
        {groups.map(g => (
          <button key={g} className="btn" style={{background: g===tab ? 'var(--brand-1)' : '#bbb'}}
                  onClick={()=>setTab(g)}>{g}</button>
        ))}
      </div>

      <StandFilters onFilter={setQ}/>
      <div className="card">
        <Table columns={columns} data={filtered}/>
      </div>
    </div>
  )
}

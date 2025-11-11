import { useState } from 'react'

export default function StandFilters({ onFilter }){
  const [q, setQ] = useState('')
  return (
    <div className="card" style={{marginBottom:12}}>
      <div className="grid cols-3">
        <input className="input" placeholder="Buscar serial/marca/ubicación/estado"
               value={q} onChange={e=>{ setQ(e.target.value); onFilter(e.target.value) }}/>
      </div>
    </div>
  )
}

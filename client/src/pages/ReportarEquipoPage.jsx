import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import { Select, Input, Textarea } from '../components/FormControls'
import { REQUEST_TYPES, MAX_FAILA_LEN } from '../app/constants'
import { createRequest } from '../features/requests/requestsSlice'
import PdfButton from '../components/PdfButton'

export default function ReportarEquipoPage(){
  const user = useSelector(s => s.auth.currentUserName)
  const lastId = useSelector(s => s.requests.lastCreatedId)
  const req = useSelector(s => s.requests.list.find(r=>r.id===lastId))
  const dispatch = useDispatch()

  const [tipo, setTipo] = useState('')
  const [otroNombre, setOtroNombre] = useState('')
  const [serial, setSerial] = useState('')
  const [falla, setFalla] = useState('')
  const [foto, setFoto] = useState(null)

  function onFoto(e){
    const file = e.target.files?.[0]
    if(!file) return
    const reader = new FileReader()
    reader.onload = (ev)=> setFoto(String(ev.target.result))
    reader.readAsDataURL(file)
  }

  function onSubmit(e){
    e.preventDefault()
    if(!tipo) return alert('Seleccione un tipo')
    if(tipo==='Otro' && !otroNombre.trim()) return alert('Diligencie el nombre del "Otro"')
    dispatch(createRequest({ tipo, otroNombre, serial, falla, foto }))
  }

  return (
    <div className="grid" style={{gap:12}}>
      <div className="card">
        <h2 style={{marginTop:0}}>Reportar equipo</h2>
        <div style={{marginBottom:8}}>Usuario: <b>{user}</b></div>
        <form onSubmit={onSubmit} className="grid cols-2" style={{gap:12}}>
          <Select label="Tipo" value={tipo} onChange={e=>setTipo(e.target.value)} options={REQUEST_TYPES}/>
          {tipo==='Otro' ? <Input label='Nombre del "Otro"' value={otroNombre} onChange={e=>setOtroNombre(e.target.value)}/> : <div/>}
          <Input label="Serial" value={serial} onChange={e=>setSerial(e.target.value)} placeholder="Ej: HP-ABC-001"/>
          <label className="grid" style={{gap:6}}>
            <span>Foto (opcional)</span>
            <input className="input" type="file" accept="image/*" onChange={onFoto}/>
          </label>
          <div className="grid" style={{gridColumn:'1/-1'}}>
            <Textarea label="Descripción de la falla"
                      value={falla} onChange={e=>setFalla(e.target.value)}
                      maxLength={MAX_FAILA_LEN} rows={4}/>
          </div>
          <div style={{gridColumn:'1/-1', display:'flex', gap:8}}>
            <button className="btn" type="submit">Reportar</button>
            {req && <PdfButton blobUrl={req.pdfBlobUrl} fileName={`solicitud_${req.id}.pdf`}/>}
          </div>
        </form>
      </div>
    </div>
  )
}

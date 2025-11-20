import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import { Select, Input, Textarea } from '../components/FormControls'
import { REQUEST_TYPES, MAX_FAILA_LEN } from '../app/constants'
import { createRequest } from '../features/requests/requestsSlice'
import PdfButton from '../components/PdfButton'
import Check from '../components/Check'

export default function ReportarEquipoPage(){
  const user = useSelector(s => s.auth.currentUserName)
  const lastId = useSelector(s => s.requests.lastCreatedId)
  const req = useSelector(s => s.requests.list.find(r=>r.id===lastId))
  const dispatch = useDispatch()

  const confirmedItems = useSelector(s => (s.inventory.items || []).filter(i => i.assignedTo === user && i.confirmedByUser))

  const [tipo, setTipo] = useState('')
  const [otroNombre, setOtroNombre] = useState('')
  const [serial, setSerial] = useState('')
  const [falla, setFalla] = useState('')
  const [foto, setFoto] = useState(null)
  const [selectedConfirmed, setSelectedConfirmed] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function onFoto(e){
    const file = e.target.files?.[0]
    if(!file) return
    const reader = new FileReader()
    reader.onload = (ev)=> setFoto(String(ev.target.result))
    reader.readAsDataURL(file)
  }

  function validateFalla(){
    const text = (falla || '').trim()
    if(text.length > MAX_FAILA_LEN) return false
    const words = text.split(/\s+/).filter(Boolean)
    return words.length >= 2
  }

  function onSubmit(e){
    e.preventDefault()
    if(!tipo) return alert('Seleccione un tipo')
    if(tipo==='Otro' && !otroNombre.trim()) return alert('Diligencie el nombre del "Otro"')
    // si no seleccionó equipo confirmado, exigir descripción mínima 2 palabras
    if(!selectedConfirmed && !validateFalla()) return alert('Describa la falla con al menos 2 palabras (máx 100 caracteres)')
    if(submitting) return
    setSubmitting(true)
    dispatch(createRequest({ tipo, otroNombre, serial, falla, foto }))
    // limpiar formulario para nuevo reporte
    setTipo('')
    setOtroNombre('')
    setSerial('')
    setFalla('')
    setFoto(null)
    setSelectedConfirmed('')
    // evitar doble envío por 1s
    setTimeout(()=>setSubmitting(false), 1000)
  }

  return (
    <div className="grid" style={{gap:12}}>
      <div className="card">
        <h2 style={{marginTop:0}}>Reportar equipo</h2>
        <div style={{marginBottom:8}}>Usuario: <b>{user}</b></div>
        <form onSubmit={onSubmit} className="grid cols-2" style={{gap:12}}>
          <Select label="Tipo" value={tipo} onChange={e=>setTipo(e.target.value)} options={REQUEST_TYPES}/>
          {tipo==='Otro' ? <Input label='Nombre del "Otro"' value={otroNombre} onChange={e=>setOtroNombre(e.target.value)}/> : <div/>}
          {confirmedItems.length > 0 && (
            <Select label="Mis equipos (confirmados)" value={selectedConfirmed} onChange={e=>{
              const v = e.target.value
              setSelectedConfirmed(v)
              if(!v) return setSerial('')
              // v is like "Marca - SERIAL" -> extract last part as serial
              const parts = v.split(' - ')
              setSerial(parts[parts.length-1])
            }} options={confirmedItems.map(i => `${i.marca || i.tipo} - ${i.serial}`)}/>
          )}

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
          <div style={{gridColumn:'1/-1', display:'flex', gap:8, alignItems:'center'}}>
            <button className={`btn ${submitting ? 'btn-muted' : ''}`} type="submit" disabled={submitting}>{submitting ? 'Enviando...' : 'Reportar'}</button>

            {req ? (
              req.status === 'approved' ? (
                <PdfButton blobUrl={req.pdfBlobUrl} fileName={`solicitud_${req.id}.pdf`} />
              ) : (
                <PdfButton disabled fileName={`solicitud_${req.id}.pdf`} />
              )
            ) : null}

            {req && req.status === 'approved' && <Check small />}
          </div>
        </form>
      </div>
    </div>
  )
}

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectMyRequests, migrateRequestsPdf } from '../features/requests/requestsSlice'
import Table from '../components/Table'
import PdfButton from '../components/PdfButton'

export default function MisSolicitudesPage(){
  const dispatch = useDispatch()
  const user = useSelector(s => s.auth.currentUserName)
  const rows = useSelector(selectMyRequests(user))

  // on mount, try to migrate any old blob URLs into data URLs
  useEffect(()=>{
    dispatch(migrateRequestsPdf())
  }, [dispatch])

  const columns = [
    { key:'fechaISO', header:'Fecha', render:r => new Date(r.fechaISO).toLocaleString() },
    { key:'tipo', header:'Tipo', render:r => r.otroNombre ? `${r.tipo} (${r.otroNombre})` : r.tipo },
    { key:'serial', header:'Serial' },
    { key:'falla', header:'Falla' },
    { key:'acciones', header:'Acciones', render:r => (
      r.status === 'approved'
        ? <PdfButton blobUrl={r.pdfBlobUrl} fileName={`solicitud_${r.id}.pdf`} />
        : <PdfButton disabled fileName={`solicitud_${r.id}.pdf`} />
    ) }
  ]

  return (
    <div className="card">
      <h2 style={{marginTop:0}}>Mis solicitudes</h2>
      <Table columns={columns} data={rows}/>
    </div>
  )
}

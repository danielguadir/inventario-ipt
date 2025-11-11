import { useSelector } from 'react-redux'
import { selectMyRequests } from '../features/requests/requestsSlice'
import Table from '../components/Table'
import PdfButton from '../components/PdfButton'

export default function MisSolicitudesPage(){
  const user = useSelector(s => s.auth.currentUserName)
  const rows = useSelector(selectMyRequests(user))

  const columns = [
    { key:'fechaISO', header:'Fecha', render:r => new Date(r.fechaISO).toLocaleString() },
    { key:'tipo', header:'Tipo', render:r => r.otroNombre ? `${r.tipo} (${r.otroNombre})` : r.tipo },
    { key:'serial', header:'Serial' },
    { key:'falla', header:'Falla' },
    { key:'acciones', header:'Acciones', render:r => <PdfButton blobUrl={r.pdfBlobUrl} fileName={`solicitud_${r.id}.pdf`}/> }
  ]

  return (
    <div className="card">
      <h2 style={{marginTop:0}}>Mis solicitudes</h2>
      <Table columns={columns} data={rows}/>
    </div>
  )
}

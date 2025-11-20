export default function PdfButton({ blobUrl, fileName, disabled = false }){
  if(disabled){
    return <button className="btn btn-muted" disabled>En espera</button>
  }
  if(!blobUrl) return null
  return (
    <a className="btn" href={blobUrl} download={fileName || 'solicitud.pdf'} style={{textDecoration:'none'}}>Descargar PDF</a>
  )
}

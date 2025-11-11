export default function PdfButton({ blobUrl, fileName }){
  if(!blobUrl) return null
  return (
    <a className="btn" href={blobUrl} download={fileName || 'solicitud.pdf'}>Descargar PDF</a>
  )
}

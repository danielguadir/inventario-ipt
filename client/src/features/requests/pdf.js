import { jsPDF } from 'jspdf'
import { format } from 'date-fns'

export function generarPDF(req){
  const doc = new jsPDF()

  const fecha = format(new Date(req.fechaISO), 'yyyy-MM-dd HH:mm')

  doc.setFontSize(16)
  doc.text('Solicitud de Soporte - IP Total', 14, 18)

  doc.setFontSize(11)
  const data = [
    ['ID', req.id],
    ['Fecha', fecha],
    ['Usuario', req.userName],
    ['Tipo', req.tipo + (req.otroNombre ? ` (${req.otroNombre})` : '')],
    ['Serial', req.serial || '-'],
    ['Falla', req.falla || '-']
  ]

  let y = 30
  data.forEach(([k,v])=>{
    doc.text(`${k}:`, 14, y)
    doc.text(String(v), 60, y)
    y += 8
  })

  if(req.foto && req.foto.startsWith('data:image/')){
    // tamaño aprox
    doc.addImage(req.foto, 'JPEG', 14, y+4, 80, 60)
  }

  return doc.output('blob')
}

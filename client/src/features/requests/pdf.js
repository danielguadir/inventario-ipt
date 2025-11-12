// pdf.js (o actaPdf.js)
import { jsPDF } from 'jspdf'
import { format } from 'date-fns'
export function generarPDF(req, extras = {}) {
  const doc = new jsPDF()
  const pageW = doc.internal.pageSize.getWidth()
  const pageH = doc.internal.pageSize.getHeight()
  const margin = 14
  const contentW = pageW - margin * 2

  // === Datos unificados ===
  const fechaTexto = format(new Date(req.fechaISO), 'yyyy-MM-dd HH:mm')
  const actaTipo = (extras.actaTipo || 'reporte').toLowerCase()
  const personaNombre = extras.personaNombre || req.userName || 'N/D'
  const personaCC = extras.personaCC || 'N/D'
  const equipoNombre = extras.equipoNombre || req.otroNombre || req.tipo || 'equipo'
  const marca = extras.marca || 'N/D'
  const serial = req.serial || 'N/D'
  const motivo = (req.falla && req.falla.trim()) ? req.falla.trim() :
                 (extras.detalle || 'N/D')
  const detalleLibre = extras.detalle || ''  // texto adicional opcional
  const usarFoto = !!extras.usarFotoEvidencia

  // === Encabezado (logo + título) ===
  // intenta usar el logo pasado en extras.logo; si no, intenta "iptotalogo" (si existe en scope)
  const logoSrc = extras.logo || (typeof iptotalogo !== 'undefined' ? iptotalogo : null)
  if (logoSrc && typeof logoSrc === 'string') {
    // Detecta tipo a partir del dataURL o asume PNG si es import de archivo
    const isDataPng = logoSrc.startsWith('data:image/png')
    const isDataJpg = logoSrc.startsWith('data:image/jpeg') || logoSrc.startsWith('data:image/jpg')
    const imgType = isDataPng ? 'PNG' : (isDataJpg ? 'JPEG' : 'PNG')
    // Dibuja logo
    doc.addImage(logoSrc, imgType, margin, 10, 22, 22)
  }

  doc.setFontSize(16)
  doc.setFont(undefined, 'bold')
  doc.text(`ACTA DE ${actaTipo.toUpperCase()}`, pageW / 2, 18, { align: 'center' })

  doc.setFontSize(10)
  doc.setFont(undefined, 'normal')
  doc.text(`Fecha de generación: ${fechaTexto}`, pageW - margin, 26, { align: 'right' })

  // línea
  doc.setLineWidth(0.3)
  doc.line(margin, 30, pageW - margin, 30)

  // === Cuerpo del Acta (párrafos con placeholders) ===
  const p1 = `En las instalaciones de la empresa IP TOTAL SOFTWARE S.A, ${fechaTexto}, se suscribe la presente acta de ${actaTipo} de ${equipoNombre} asignada al señor(a) ${personaNombre} con Cédula de Ciudadanía ${personaCC}.`

  const p2 = `Motivo: “${motivo}”`

  // “detalle” con ficha técnica
  // (puedes ajustar las etiquetas sin problema)
  const p3Lineas = [
    'Detalle del equipo:',
    `• Equipo: ${equipoNombre}`,
    `• Marca: ${marca}`,
    `• Serial: ${serial}`,
    `• Reportado por: ${req.userName || 'N/D'}`
  ]
  if (detalleLibre) {
    p3Lineas.push(`• Detalle adicional: ${detalleLibre}`)
  }
  const p3 = p3Lineas.join('\n')

  doc.setFontSize(12)
  let y = 38

  // helper para dibujar párrafos con auto-wrap
  const drawParagraph = (text) => {
    const wrapped = doc.splitTextToSize(text, contentW)
    doc.text(wrapped, margin, y)
    y += wrapped.length * 6 + 6
  }

  drawParagraph(p1)
  drawParagraph(p2)
  drawParagraph(p3)

  // === Foto de evidencia (opcional) ===
  if (usarFoto && req.foto && req.foto.startsWith('data:image/')) {
    const isPng = req.foto.startsWith('data:image/png')
    const imgType = isPng ? 'PNG' : 'JPEG'
    doc.setFont(undefined, 'bold')
    doc.text('Evidencia fotográfica', margin, y + 4)
    doc.setFont(undefined, 'normal')

    const imgW = 90
    const imgH = 68
    const boxY = y + 8
    doc.setDrawColor(200)
    doc.rect(margin, boxY - 2, imgW + 4, imgH + 4)
    doc.addImage(req.foto, imgType, margin + 2, boxY, imgW, imgH)
    y = boxY + imgH + 12
  }

  // Salto si se acerca al pie
  if (y > pageH - 50) {
    doc.addPage()
    y = margin + 10
  }

  // === Firmas ===
  doc.setFont(undefined, 'bold')
  doc.text('Firmas', margin, y)
  doc.setFont(undefined, 'normal')

  const signY = y + 14
  // Solicitante
  doc.line(margin, signY, margin + 70, signY)
  doc.text('Solicitante', margin + 20, signY + 6)

  // Responsable
  const rightX = pageW - margin - 70
  doc.line(rightX, signY, rightX + 70, signY)
  doc.text('Responsable de Soporte', rightX + 10, signY + 6)

  // === Pie ===
  doc.setFontSize(9)
  doc.setTextColor(120)
  doc.text(`ID solicitud: ${req.id || 'N/D'} • Sistema: Inventario-IPT`, pageW / 2, pageH - 10, { align: 'center' })
  doc.setTextColor(0)

  return doc.output('blob')
}

export default function ItemCard({ item }){
  return (
    <div className="card">
      <b>{item.marca} · {item.tipo}</b>
      <div>Serial: {item.serial}</div>
      <div>Disco: {item.disco || '-'}</div>
      <div>Estado: {item.estado}</div>
      <div>Ubicación: {item.ubicacion}</div>
    </div>
  )
}

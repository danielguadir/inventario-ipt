export default function Table({ columns, data }){
  return (
    <table className="table">
      <thead>
        <tr>{columns.map(c => <th key={c.key}>{c.header}</th>)}</tr>
      </thead>
      <tbody>
        {data.length === 0 && (
          <tr><td colSpan={columns.length}>Sin registros</td></tr>
        )}
        {data.map((row, i)=>(
          <tr key={row.id || i}>
            {columns.map(c => <td key={c.key}>{c.render ? c.render(row) : row[c.key]}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

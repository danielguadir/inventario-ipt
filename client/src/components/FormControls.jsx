export function Input({label, ...props}){
  return (
    <label className="grid" style={{gap:6}}>
      <span>{label}</span>
      <input className="input" {...props}/>
    </label>
  )
}

export function Select({label, options=[], ...props}){
  return (
    <label className="grid" style={{gap:6}}>
      <span>{label}</span>
      <select className="select" {...props}>
        <option value="">Seleccione...</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  )
}

export function Textarea({label, maxLength, value, onChange, ...props}){
  const left = (maxLength && value) ? (maxLength - value.length) : maxLength
  return (
    <label className="grid" style={{gap:6}}>
      <span>{label} {maxLength ? <small>({left} restantes)</small> : null}</span>
      <textarea className="textarea" maxLength={maxLength} value={value} onChange={onChange} {...props}/>
    </label>
  )
}

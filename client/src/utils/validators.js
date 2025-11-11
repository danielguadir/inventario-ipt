export function required(v, msg='Campo requerido'){
  if(v === undefined || v === null || String(v).trim()==='') throw new Error(msg)
}
export function maxLen(v, n, msg){
  if((v||'').length > n) throw new Error(msg || `Máximo ${n} caracteres`)
}

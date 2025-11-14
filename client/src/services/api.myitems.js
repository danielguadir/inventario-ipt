const KEY = 'ipt_mis_equipos_v1'

function loadAll(){
  try { return JSON.parse(localStorage.getItem(KEY)) || {} }
  catch { return {} }
}
function saveAll(map){ localStorage.setItem(KEY, JSON.stringify(map)) }

export function myItemsLoad(user){
  const all = loadAll()
  return all[user] || []
}

export function myItemsSave(user, items){
  const all = loadAll()
  all[user] = items
  saveAll(all)
}

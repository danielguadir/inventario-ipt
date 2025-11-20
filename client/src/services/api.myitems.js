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

export function myItemsAdd(user, item){
  const all = loadAll()
  const arr = all[user] || []
  arr.push(item)
  all[user] = arr
  saveAll(all)
}

export function myItemsRemoveFor(user, id){
  const all = loadAll()
  const arr = all[user] || []
  all[user] = arr.filter(x => x.id !== id)
  saveAll(all)
}

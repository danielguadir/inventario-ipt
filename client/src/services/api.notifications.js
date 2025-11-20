const KEY = 'ipt_notifications_v1'

function loadAll(){
  try { return JSON.parse(localStorage.getItem(KEY)) || [] }
  catch { return [] }
}
function saveAll(list){ localStorage.setItem(KEY, JSON.stringify(list || [])) }

export function notificationsLoad(){ return loadAll() }
export function notificationsSave(list){ saveAll(list) }

export function notificationsAdd(n){
  const all = loadAll()
  all.push(n)
  saveAll(all)
}

export function notificationsRemove(id){
  const all = loadAll()
  const next = all.filter(x => x.id !== id)
  saveAll(next)
}

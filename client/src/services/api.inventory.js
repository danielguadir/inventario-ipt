const KEY = 'ipt_inventory_v1'

export function loadInventory(){
  try{ const raw = localStorage.getItem(KEY); return raw ? JSON.parse(raw) : null }catch(e){ return null }
}

export function saveInventory(list){
  try{ localStorage.setItem(KEY, JSON.stringify(list || [])) }catch(e){ console.error(e) }
}

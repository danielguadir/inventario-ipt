const KEY = 'ipt_requests_v1'

export function apiLoadRequests(){
  try{
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  }catch(e){
    console.error(e); return []
  }
}

export function apiSaveRequest(req){
  const all = apiLoadRequests()
  all.push(req)
  localStorage.setItem(KEY, JSON.stringify(all))
}

export function apiSaveRequests(list){
  try{
    localStorage.setItem(KEY, JSON.stringify(list || []))
  }catch(e){ console.error(e) }
}

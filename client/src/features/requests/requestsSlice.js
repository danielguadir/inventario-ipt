import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { nanoid } from 'nanoid'
import { generarPDF } from './pdf'
import { apiSaveRequest, apiLoadRequests, apiSaveRequests } from '../../services/api.mock'

const initialState = {
  list: apiLoadRequests(),
  loading: false,
  error: null,
  lastCreatedId: null
}

export const createRequest = createAsyncThunk(
  'requests/create',
  async (formData, { getState }) => {
    const userName = getState().auth.currentUserName
    const req = {
      id: nanoid(8),
      userName,
      tipo: formData.tipo,
      otroNombre: formData.otroNombre || null,
      serial: formData.serial || '',
      falla: formData.falla || '',
      foto: formData.foto || null,
      fechaISO: new Date().toISOString()
    }
    const blob = generarPDF(req)

    // convertir blob a dataURL para poder persistir en localStorage
    const blobToDataUrl = (b) => new Promise((resolve, reject) => {
      try{
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(b)
      }catch(e){ reject(e) }
    })

    const dataUrl = await blobToDataUrl(blob)
    req.pdfBlobUrl = dataUrl

    // estado por defecto
    req.status = 'pending'

    apiSaveRequest(req)
    return req
  }
)

const requestsSlice = createSlice({
  name: 'requests',
  initialState,
  reducers: {
    updateRequestStatus: (state, { payload: { id, status } }) => {
      const idx = state.list.findIndex(r => r.id === id)
      if (idx >= 0) state.list[idx].status = status
    },
    setRequestsList: (state, { payload: list }) => {
      state.list = list || []
    }
  },
  extraReducers: builder => {
    builder
      .addCase(createRequest.pending, (state)=>{
        state.loading = true
        state.error = null
        state.lastCreatedId = null
      })
      .addCase(createRequest.fulfilled, (state, {payload})=>{
        state.loading = false
        state.list.push(payload)
        state.lastCreatedId = payload.id
      })
      .addCase(createRequest.rejected, (state, {error})=>{
        state.loading = false
        state.error = error.message || 'Error al crear solicitud'
      })
  }
})

export const { updateRequestStatus } = requestsSlice.actions

// Thunk: migrate stored pdf blob URLs (session blob:) into data URLs so downloads work
export const migrateRequestsPdf = () => async (dispatch, getState) => {
  const list = getState().requests.list.slice()
  if(!list || list.length === 0) return
  let changed = false
  const blobToDataUrl = (b) => new Promise((resolve, reject) => {
    try{
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(b)
    }catch(e){ reject(e) }
  })

  for(let i=0;i<list.length;i++){
    const req = list[i]
    const url = req.pdfBlobUrl || ''
    // if missing or not a data: URL, regenerate
    if(!url || !url.startsWith('data:')){
      try{
        const blob = generarPDF(req)
        const dataUrl = await blobToDataUrl(blob)
        req.pdfBlobUrl = dataUrl
        changed = true
      }catch(e){ console.error('migrateRequestsPdf error', e) }
    }
  }

  if(changed){
    // persist full list and update state
    apiSaveRequests(list)
    dispatch(requestsSlice.actions.setRequestsList(list))
  }
}

export const selectMyRequests = (userName) => (s) =>
  s.requests.list.filter(r => r.userName === userName)

export default requestsSlice.reducer

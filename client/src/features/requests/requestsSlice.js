import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { nanoid } from 'nanoid'
import { generarPDF } from './pdf'
import { apiSaveRequest, apiLoadRequests } from '../../services/api.mock'

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
    const blobUrl = URL.createObjectURL(blob)
    req.pdfBlobUrl = blobUrl

    apiSaveRequest(req)
    return req
  }
)

const requestsSlice = createSlice({
  name: 'requests',
  initialState,
  reducers: {},
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

export const selectMyRequests = (userName) => (s) =>
  s.requests.list.filter(r => r.userName === userName)

export default requestsSlice.reducer

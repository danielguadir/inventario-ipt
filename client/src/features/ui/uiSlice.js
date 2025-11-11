import { createSlice } from '@reduxjs/toolkit'

const uiSlice = createSlice({
  name: 'ui',
  initialState: { toast: null },
  reducers: {
    showToast: (s, {payload}) => { s.toast = payload },
    clearToast: (s) => { s.toast = null }
  }
})
export const { showToast, clearToast } = uiSlice.actions
export default uiSlice.reducer

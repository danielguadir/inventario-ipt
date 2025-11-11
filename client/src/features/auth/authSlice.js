import { createSlice } from '@reduxjs/toolkit'
import { AUTH_PASSWORD } from '../../app/constants'

const initialState = {
  isAuthenticated: false,
  currentUserName: "",
  users: [
    "Daniel Guadir","Yolima","Carlos","Laura","Sofía","Miguel","Ana",
    "Julián","Marta","Andrés","Camila","Paula","Sergio","Valentina","Juan"
  ],
  error: null
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, {payload}) => {
      const { password, user } = payload
      if(password === AUTH_PASSWORD && state.users.includes(user)){
        state.isAuthenticated = true
        state.currentUserName = user
        state.error = null
      } else {
        state.error = "Credenciales inválidas"
      }
    },
    logout: (state) => {
      state.isAuthenticated = false
      state.currentUserName = ""
      state.error = null
    }
  }
})

export const { login, logout } = authSlice.actions
export default authSlice.reducer

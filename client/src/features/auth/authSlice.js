import { createSlice } from '@reduxjs/toolkit'
import { AUTH_PASSWORD } from '../../app/constants'

const initialState = {
  isAuthenticated: false,
  currentUserName: "",
  users: [
    "Daniel Guadir","Patricia Gomez","Brandom Salazar","Jorge Bocanegra","Fernando Ayala","Jeison Gaviria","Stiven Bolaños",
    "Jhon Arteaga","Lili Herrera","Marlio Perea","Juan Cuesta","Nikol Arango","Alex Losada","Julio Ruiz","Francisco Ariztizabal",
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

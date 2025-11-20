import { createSlice } from '@reduxjs/toolkit'
import { AUTH_PASSWORD } from '../../app/constants'

// 👇 Mapa de roles (solo estos dos serán admin)
const ROLES = {
  'Daniel Guadir': 'admin',
  'Brandom Salazar': 'admin',
  // el resto por defecto 'user'
}

const initialState = {
  isAuthenticated: false,
  currentUserName: "",
  currentRole: "guest",
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
    login: (state, { payload }) => {
      const { password, user } = payload
      if (password === AUTH_PASSWORD && state.users.includes(user)) {
        state.isAuthenticated = true
        state.currentUserName = user
        state.currentRole = ROLES[user] || 'user' // 👈 asigna rol
        state.error = null
      } else {
        state.error = "Credenciales inválidas"
      }
    },
    logout: (state) => {
      state.isAuthenticated = false
      state.currentUserName = ""
      state.currentRole = "guest"
      state.error = null
    }
    ,
    addUser: (state, { payload: user }) => {
      if(!state.users.includes(user)) state.users.push(user)
    },
    removeUser: (state, { payload: user }) => {
      state.users = state.users.filter(u => u !== user)
    }
  }
})

export const { login, logout, addUser, removeUser } = authSlice.actions

// Selectores útiles
export const selectCurrentUser = s => s.auth.currentUserName
export const selectCurrentRole = s => s.auth.currentRole
export const selectIsAdmin = s => s.auth.currentRole === 'admin'

export default authSlice.reducer

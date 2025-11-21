import { createSlice } from '@reduxjs/toolkit'
import { AUTH_PASSWORD } from '../../app/constants'
import { unassignItemFromUser } from '../inventory/inventorySlice'
import { removeNotification } from '../notifications/notificationsSlice'

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

// Thunk: eliminar usuario y limpiar referencias en inventario y notificaciones
export const deleteUser = (user) => (dispatch, getState) => {
  if(!user) return
  // Desasignar todos los items asignados a este usuario
  const items = getState().inventory?.items || []
  items.forEach(it => {
    if(it.assignedTo === user){
      dispatch(unassignItemFromUser({ id: it.id, user }))
    }
  })

  // Eliminar notificaciones relacionadas con el usuario
  const notifs = getState().notifications?.list || []
  notifs.forEach(n => {
    if(n.user === user){
      dispatch(removeNotification(n.id))
    }
  })

  // Si el usuario está autenticado actualmente, cerrar sesión
  const current = getState().auth?.currentUserName
  if(current === user){
    dispatch(logout())
  }

  // Finalmente, eliminar de la lista de usuarios
  dispatch(removeUser(user))
}

// Selectores útiles
export const selectCurrentUser = s => s.auth.currentUserName
export const selectCurrentRole = s => s.auth.currentRole
export const selectIsAdmin = s => s.auth.currentRole === 'admin'

export default authSlice.reducer

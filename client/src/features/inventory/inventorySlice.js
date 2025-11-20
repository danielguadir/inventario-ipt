import { createSlice } from '@reduxjs/toolkit'
import seed from './seedInventory.json'
import { loadInventory, saveInventory } from '../../services/api.inventory'
import { GROUPS } from '../../app/constants'
import { myItemsAdd, myItemsRemoveFor } from '../../services/api.myitems'
import { addMyItem, removeMyItem } from '../myitems/myItemsSlice'

const initialState = {
  groups: GROUPS,
  items: loadInventory() || seed
}

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    addItem: (state, {payload}) => {
      state.items.push(payload)
      saveInventory(state.items)
    },
    updateItem: (state, {payload}) => {
      const { id, changes } = payload
      const idx = state.items.findIndex(i => i.id === id)
      if(idx >= 0){
        state.items[idx] = { ...state.items[idx], ...changes }
        saveInventory(state.items)
      }
    }
  }
})

export const { addItem, updateItem } = inventorySlice.actions

// Selectors
export const selectGroups = (s) => s.inventory.groups
export const selectItemsByGroup = (group) => (s) =>
  s.inventory.items.filter(i => i.grupo === group)

export default inventorySlice.reducer

// Thunk: asignar un item a un usuario (actualiza inventario y guarda en myitems)
export const assignItemToUser = ({ id, user }) => (dispatch, getState) => {
  const item = getState().inventory.items.find(i => i.id === id)
  if(!item) return
  const changes = { assignedTo: user, estado: 'Asignado' }
  dispatch(updateItem({ id, changes }))
  const updated = { ...item, ...changes }
  // persist in localStorage for that user
  myItemsAdd(user, updated)
  // if the myitems slice currently holds the same user, update in-memory state so UI updates in hot
  const currentMyItemsUser = getState().myitems.user
  if(currentMyItemsUser === user){
    dispatch(addMyItem(updated))
  }
}

// Confirmación por parte del usuario (persistente)
export const confirmItemByUser = ({ id, user }) => (dispatch, getState) => {
  const item = getState().inventory.items.find(i => i.id === id)
  if(!item) return
  const changes = { confirmedByUser: true, confirmedAt: new Date().toISOString(), confirmedBy: user }
  dispatch(updateItem({ id, changes }))
}

// Desasignar item de un usuario
export const unassignItemFromUser = ({ id, user }) => (dispatch, getState) => {
  const item = getState().inventory.items.find(i => i.id === id)
  if(!item) return
  const changes = { assignedTo: null, estado: 'Operativo' }
  dispatch(updateItem({ id, changes }))
  // remove from persisted myitems
  myItemsRemoveFor(user, id)
  // if current myitems slices points to that user, update in-memory
  const currentMyItemsUser = getState().myitems.user
  if(currentMyItemsUser === user){
    dispatch(removeMyItem(id))
  }
}

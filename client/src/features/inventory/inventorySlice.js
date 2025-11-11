import { createSlice } from '@reduxjs/toolkit'
import seed from './seedInventory.json'
import { GROUPS } from '../../app/constants'

const initialState = {
  groups: GROUPS,
  items: seed
}

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    addItem: (state, {payload}) => {
      state.items.push(payload)
    },
    updateItem: (state, {payload}) => {
      const { id, changes } = payload
      const idx = state.items.findIndex(i => i.id === id)
      if(idx >= 0){
        state.items[idx] = { ...state.items[idx], ...changes }
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

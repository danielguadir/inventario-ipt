import { createSlice } from '@reduxjs/toolkit'
import { myItemsLoad, myItemsSave } from '../../services/api.myitems'

const initialState = {
  list: [],     // items del usuario actual
  user: null,   // cache para saber para quién están cargados
}

const slice = createSlice({
  name: 'myitems',
  initialState,
  reducers: {
    loadMyItemsFor: (state, { payload: user }) => {
      state.list = myItemsLoad(user)
      state.user = user
    },
    addMyItem: (state, { payload }) => {
      state.list.push(payload)
      if(state.user) myItemsSave(state.user, state.list)
    },
    removeMyItem: (state, { payload:id }) => {
      state.list = state.list.filter(x => x.id !== id)
      if(state.user) myItemsSave(state.user, state.list)
    },
    updateMyItem: (state, { payload:{ id, changes } }) => {
      const i = state.list.findIndex(x => x.id === id)
      if(i>=0){
        state.list[i] = { ...state.list[i], ...changes }
        if(state.user) myItemsSave(state.user, state.list)
      }
    }
  }
})

export const { loadMyItemsFor, addMyItem, removeMyItem, updateMyItem } = slice.actions
export const selectMyItems = s => s.myitems.list
export default slice.reducer

import { createSlice } from '@reduxjs/toolkit'
import { nanoid } from 'nanoid'
import { notificationsLoad, notificationsSave } from '../../services/api.notifications'

const initialState = {
  list: notificationsLoad()
}

const slice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, { payload }) => {
      const n = { id: nanoid(8), dateISO: new Date().toISOString(), ...payload }
      state.list.push(n)
      notificationsSave(state.list)
    },
    removeNotification: (state, { payload: id }) => {
      state.list = state.list.filter(x => x.id !== id)
      notificationsSave(state.list)
    }
  }
})

export const { addNotification, removeNotification } = slice.actions
export const selectNotifications = s => s.notifications.list
export default slice.reducer

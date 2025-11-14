import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import inventoryReducer from '../features/inventory/inventorySlice'
import requestsReducer from '../features/requests/requestsSlice'
import uiReducer from '../features/ui/uiSlice'
import myItemsReducer from '../features/myitems/myItemsSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    inventory: inventoryReducer,
    requests: requestsReducer,
    ui: uiReducer,
    myitems: myItemsReducer,
  }
})

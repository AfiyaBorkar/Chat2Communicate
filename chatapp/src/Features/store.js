import {configureStore} from '@reduxjs/toolkit'
import themeSliceReducer from './themeSlice'
import RefreshSidebarReducer from './RefreshSidebar'
export const store = configureStore({
    reducer:{
        themeKey: themeSliceReducer,
        refreshKey: RefreshSidebarReducer
    }
})
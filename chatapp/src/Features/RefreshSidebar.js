import { createSlice } from "@reduxjs/toolkit";

export const RefreshSlidebarSlice = createSlice({
    name:"RefreshSlidebarSlice",
    initialState:"true",
    reducers:{
        RefreshSlidebarFun :(state)=>{
            return !state
        }
    }
})

export const{RefreshSlidebarFun} = RefreshSlidebarSlice.actions
export default RefreshSlidebarSlice.reducer

import {createSlice} from "@reduxjs/toolkit"


const initialState = {
    authUser:[],
};

const userSlice = createSlice({
    name:"user",
    initialState,
    reducers:{
        authUser:(state,action)=>{
            state.authUser = action.payload;
        },
    },
});
export default userSlice.reducer;

export const {authUser} = userSlice.actions;
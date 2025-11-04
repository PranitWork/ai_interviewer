import {createSlice} from "@reduxjs/toolkit"


const initialState = {
    users:[],
};

const usersSlice = createSlice({
    name:"users",
    initialState,
    reducers:{
        loadusers:(state,action)=>{
            state.users = action.payload;
        },
        
    },
});
export const {loadusers} = usersSlice.actions;
export default usersSlice.reducer;

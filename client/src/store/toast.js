import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast as toastify } from 'react-toastify';


// export const connectWeb3 = createAsyncThunk(
//     'connectWeb3',
//     async (args, thunkAPI) => {
//         return { web3, accounts };
//     }
// )

export const toast = createSlice({
    name: "toast",
    initialState: {
        toast: toastify,
    },
    reducers: {
        setToast: (state, action) => {
            state.toast = action.payload
            // console.log('setToast', state.toast, action)
        },
        notify: (state, action) => {
            // console.log('notify', action)
            if (typeof action.payload == typeof [])
                state.toast[action.payload[1]](action.payload[0]);
            else
                state.toast["error"](action.payload);
        }
    },
    extraReducers: (builder) => {
        // builder.addCase(connectWeb3.fulfilled, (state, action) => {
        // })
    },
})


export const { setToast, notify } = toast.actions;

export default toast.reducer;
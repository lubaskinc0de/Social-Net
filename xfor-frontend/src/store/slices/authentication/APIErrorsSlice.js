import {createSlice} from '@reduxjs/toolkit';

const APIErrorsSlice = createSlice({
    name: 'APIErrors',
    initialState: {
        APIErrors: [],
    },
    reducers: {
        setAPIErrors(state, action) {
            state.APIErrors = action.payload.APIErrors
        },
        shiftAPIErrors(state) {
            state.APIErrors.shift()
        },
        clearAPIErrors(state) {
            state.APIErrors = []
        }
    }
})

export const {setAPIErrors, shiftAPIErrors, clearAPIErrors} = APIErrorsSlice.actions
export default APIErrorsSlice.reducer

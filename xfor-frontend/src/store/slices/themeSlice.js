import { createSlice } from '@reduxjs/toolkit';
import { setToLocalStorage, getFromLocalStorage } from '../../lib/';

const theme = getFromLocalStorage('selectedTheme');

const themeSlice = createSlice({
    name: 'themeSlice',
    initialState: {
        theme,
    },
    reducers: {
        setTheme(state, action) {
            setToLocalStorage('selectedTheme', action.payload.theme);
            state.theme = action.payload.theme;
        },
    },
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;

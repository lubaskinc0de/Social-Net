import {createSlice} from '@reduxjs/toolkit';
import {setTheme as setThemeLocalStorage, getTheme} from '../../lib/';

const theme = getTheme()

const themeSlice = createSlice({
    name: 'themeSlice',
    initialState: {
        theme,
    },
    reducers: {
        setTheme(state, action) {
            setThemeLocalStorage(action.payload.theme)
            state.theme = action.payload.theme;
        },
    },
});

export const {setTheme} = themeSlice.actions
export default themeSlice.reducer

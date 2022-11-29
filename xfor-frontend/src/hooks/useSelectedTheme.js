import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';

export default function useSelectedTheme() {
    const { theme } = useSelector((state) => state.theme);
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const systemTheme = prefersDarkMode ? 'dark' : 'light';

    const [selectedTheme, setSelectedTheme] = useState(systemTheme);

    useEffect(() => {
        if (theme) {
            setSelectedTheme(theme);
        }
    }, [prefersDarkMode, theme]);

    return selectedTheme;
}

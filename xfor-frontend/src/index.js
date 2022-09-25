import Register from './components/authentication/Register/Register';
import Login from './components/authentication/Login/Login';
import React from 'react';
import ReactDOM from 'react-dom/client';
import Router from './router';
import './index.css';
import useMediaQuery from '@mui/material/useMediaQuery';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const root = ReactDOM.createRoot(document.getElementById('root'));

const routes = [
    {
        path: '/',
        component: <Register></Register>,
    },
    {
        path: '/login/',
        component: <Login></Login>,
    },
];

export default function App() {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const theme = React.useMemo(
        () =>
            createTheme({
                palette: {
                    mode: prefersDarkMode ? 'dark' : 'light',
                    ...(prefersDarkMode
                        ? {
                              primary: {
                                  main: '#3f51b5',
                              },
                              secondary: {
                                  main: '#f50057',
                              },
                          }
                        : {}),
                },
            }),
        [prefersDarkMode],
    );
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline>
                <Router routes={routes}></Router>
            </CssBaseline>
        </ThemeProvider>
    );
}

root.render(<App></App>);

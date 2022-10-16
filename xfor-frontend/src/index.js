import Register from './components/authentication/Register/Register';
import Login from './components/authentication/Login/Login';
import Logout from './components/authentication/Logout/Logout';
import Activation from './components/authentication/Activation/Activation'
import React from 'react';
import ReactDOM from 'react-dom/client';
import Router from './router';
import './index.css';
import useMediaQuery from '@mui/material/useMediaQuery';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {Provider as ReduxProvider} from 'react-redux';
import AnonymousProtectedRoute from './components/routing/AnonymousProtectedRoute';
import AuthenticationProtectedRoute from './components/routing/AuthenticationProtectedRoute';
import reduxStore from './store';

const root = ReactDOM.createRoot(document.getElementById('root'));

const routes = [
    {
        path: '/',
        component: <Register></Register>,
        protection: <AnonymousProtectedRoute></AnonymousProtectedRoute>,
    },
    {
        path: '/login/',
        component: <Login></Login>,
        protection: <AnonymousProtectedRoute></AnonymousProtectedRoute>,
    },
    {
        path: '/logout/',
        component: <Logout></Logout>,
        protection: (
            <AuthenticationProtectedRoute></AuthenticationProtectedRoute>
        ),
    },
    {
        path: '/activate/:uid/:token/',
        component: <Activation></Activation>,
        protection: (
            <AnonymousProtectedRoute></AnonymousProtectedRoute>
        )
    }
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
        <ReduxProvider store={reduxStore}>
            <ThemeProvider theme={theme}>
                <CssBaseline>
                    <Router routes={routes}></Router>
                </CssBaseline>
            </ThemeProvider>
        </ReduxProvider>
    );
}

root.render(<App />);

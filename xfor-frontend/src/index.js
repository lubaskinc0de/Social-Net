import Register from './components/authentication/Register/Register';
import Login from './components/authentication/Login/Login';
import Logout from './components/authentication/Logout/Logout';
import Activation from './components/authentication/Activation/Activation';

import Feed from './components/feed/Feed';
import Post from './components/feed/Post';

import React from 'react';
import ReactDOM from 'react-dom/client';
import Router from './router';

import './index.css';

import useSelectedTheme from './hooks/useSelectedTheme';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Provider as ReduxProvider } from 'react-redux';

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
        protection: <AnonymousProtectedRoute></AnonymousProtectedRoute>,
    },
    {
        path: '/feed/',
        component: <Feed></Feed>,
        protection: (
            <AuthenticationProtectedRoute></AuthenticationProtectedRoute>
        ),
    },
    {
        path: '/feed/:postId/',
        component: <Post></Post>,
        protection: (
            <AuthenticationProtectedRoute></AuthenticationProtectedRoute>
        ),
    },
];

export default function App() {
    const themeMode = useSelectedTheme();

    const theme = React.useMemo(
        () =>
            createTheme({
                palette: {
                    mode: themeMode,
                    ...(themeMode === 'dark'
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
        [themeMode]
    );

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline>
                <Router routes={routes}></Router>
            </CssBaseline>
        </ThemeProvider>
    );
}

root.render(
    <ReduxProvider store={reduxStore}>
        <App />
    </ReduxProvider>
);

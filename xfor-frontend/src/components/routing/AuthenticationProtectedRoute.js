import {Outlet} from 'react-router-dom';
import useUser from '../../hooks/useUser';
import React, { useEffect } from 'react';
import {useNavigate} from 'react-router-dom';

const AnonymousProtectedRoute = () => {
    const [token] = useUser();
    const navigate = useNavigate()

    useEffect(() => {
        if (!token) {
            navigate('/login/')
        }
    }, [navigate, token])

    if (!token) {
        return <></>
    }

    // returns child route elements
    return <Outlet />;
};
export default AnonymousProtectedRoute;

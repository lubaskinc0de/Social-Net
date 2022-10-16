import React, {useEffect, useState} from 'react';
import {useLocation} from 'react-router-dom';
import LoginForm from './LoginForm';
import {useDispatch} from 'react-redux';
import {clearAPIErrors} from '../../../store/slices/authentication/APIErrorsSlice';
import {userLogin} from '../../../store/actions/userActions';
import {useSelector} from 'react-redux';
import {clearSuccess} from '../../../store/slices/authentication/userSlice';

export default function Login() {
    const locationContext = useLocation();
    const [message, setMessage] = useState(
        locationContext.state ? locationContext.state.message : null || '',
    );
    const dispatch = useDispatch();
    const {success} = useSelector((state) => state.user);

    const handleSubmit = (data) => {
        dispatch(userLogin(data));
    };

    useEffect(() => {
        document.title = 'Войти || KWIK';
    }, []);

    useEffect(() => {
        if (success) {
            dispatch(clearAPIErrors());
            dispatch(clearSuccess())
        }
    }, [dispatch, success]);

    return (
        <LoginForm
            title='Войти'
            message={message}
            setMessage={setMessage}
            submit={handleSubmit}></LoginForm>
    );
}

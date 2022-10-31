import React, {useEffect, useState} from 'react';

import RegisterFormStepOne from './steps/RegisterFormStepOne';
import RegisterFormStepTwo from './steps/RegisterFormStepTwo';
import RegisterFormStepThree from './steps/RegisterFormStepThree';
import RegisterFormStepFour from './steps/RegisterFormStepFour';

import {useNavigate} from 'react-router-dom';
import lodash_merge from 'lodash/merge';
import {useDispatch, useSelector} from 'react-redux';
import {clearAPIErrors} from '../../../store/slices/authentication/APIErrorsSlice';
import {clearSuccess, clearGeo} from '../../../store/slices/authentication/userSlice';
import {userRegister} from '../../../store/actions/userActions';

import Page404 from '../../pages/Page404';

export default function Register() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({});
    const dispatch = useDispatch();
    const {success} = useSelector((state) => state.user);

    const navigate = useNavigate();
    const lastStep = 4;

    const handleSubmit = (data) => {
        dispatch(userRegister(data));
    };

    useEffect(() => {
        document.title = 'Регистрация || KWIK';
    }, []);

    useEffect(() => {
        if (success) {
            const successMessage =
                'Вы успешно прошли регистрацию! Для того что бы вы могли войти в свой аккаунт проверьте почту, вам пришло письмо с инструкциями для активации аккаунта.';

            dispatch(clearAPIErrors());
            dispatch(clearSuccess());
            dispatch(clearGeo())

            navigate('/login/', {
                state: {
                    message: successMessage,
                },
            });
        }
    }, [dispatch, success, navigate]);

    const nextStep = (values) => {
        const formDataCopy = JSON.parse(JSON.stringify(formData));

        setFormData(lodash_merge(formDataCopy, values));

        if (step === lastStep) {
            return handleSubmit(formDataCopy);
        }

        setStep(step + 1);
    };

    const prevStep = () => {
        setStep(step - 1);
    };

    const generalRegisterProps = {
        values: formData,
        nextStep: nextStep,
        prevStep: prevStep,
    };

    const steps = {
        1: (
            <RegisterFormStepOne
                title='Создайте аккаунт в KWIK'
                {...generalRegisterProps}></RegisterFormStepOne>
        ),
        2: (
            <RegisterFormStepTwo
                title='Как к вам обращаться?'
                {...generalRegisterProps}></RegisterFormStepTwo>
        ),
        3: (
            <RegisterFormStepThree
                title='Настройте профиль'
                {...generalRegisterProps}></RegisterFormStepThree>
        ),
        4: (
            <RegisterFormStepFour
                title='Выберите фото профиля'
                {...generalRegisterProps}></RegisterFormStepFour>
        ),
    };

    return steps[step] || <Page404></Page404>;
}

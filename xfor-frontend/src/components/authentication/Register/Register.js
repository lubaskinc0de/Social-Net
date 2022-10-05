/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable default-case */
import React, {useEffect, useState} from 'react';

import RegisterFormStepOne from './steps/RegisterFormStepOne';
import RegisterFormStepTwo from './steps/RegisterFormStepTwo';
import RegisterFormStepThree from './steps/RegisterFormStepThree';
import RegisterFormStepFour from './steps/RegisterFormStepFour';

import {useNavigate} from 'react-router-dom';
import API from '../../../api/authentication';
import {parseAPIAxiosErrors} from '../../../lib/authentication';
import lodash_merge from 'lodash/merge';

import Page404 from '../../Page404';

export default function Register() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({});
    const [APIErrors, setAPIErrors] = useState([]);
    const [isFetching, setIsFetching] = useState(false);

    const navigate = useNavigate();
    const lastStep = 4;

    const handleSubmit = (data) => {
        setIsFetching(true)

        const request = API.register(data);

        request.then(() => {
            const successMessage = 'Вы успешно прошли регистрацию! Для того что бы вы могли войти в свой аккаунт проверьте почту, вам пришло письмо с инструкциями для активации аккаунта.'
            
            navigate('/login/', {
                state: {
                    message: successMessage
                }
            });
        }).catch((err) => {
            const errors = parseAPIAxiosErrors(err);
            setAPIErrors(errors);
        }).finally(() => {
            setIsFetching(false);
        });
    };

    useEffect(() => {
        document.title = 'Регистрация || KWIK';
    }, []);

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
        setAPIErrors: setAPIErrors,
        APIErrors: APIErrors,
        values: formData,
        nextStep: nextStep,
        prevStep: prevStep,
    };

    const steps = {
        1: (
            <RegisterFormStepOne
                title='Регистрация'
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
                isFetching={isFetching}
                {...generalRegisterProps}></RegisterFormStepFour>
        ),
    };

    return steps[step] || <Page404></Page404>;
}

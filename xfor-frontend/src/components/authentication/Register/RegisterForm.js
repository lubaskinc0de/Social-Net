/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import Form from '../Form';
import {useFormik} from 'formik';
import {handleEnter, useLoad} from '../../../lib/authentication';
import Buttons from './RegisterFormButtons';
import Input from './RegisterFormInput';
import {useNavigate} from 'react-router-dom';
import * as Yup from 'yup';

export default function RegisterForm(props) {
    const isLoad = useLoad(1700);
    const navigate = useNavigate();
    const fields = [
        {
            name: 'username',
            type: 'text',
            placeholder: 'Логин',
        },
        {
            name: 'email',
            type: 'email',
            placeholder: 'Электронная почта',
        },
        {
            name: 'password',
            type: 'password',
            placeholder: 'Пароль',
        },
        {
            name: 'password2',
            type: 'password',
            placeholder: 'Повторите пароль',
        },
    ];

    const validationSchema = Yup.object({
        username: Yup.string()
            .max(50, 'Длина логина не должна превышать 50 символов!')
            .required('Укажите логин!'),
        email: Yup.string()
            .email('Укажите правильный адрес эл.почты!')
            .required('Укажите адрес эл.почты!'),
        password: Yup.string('Пароль не должен состоять из цифр')
            .min(8, 'Длина пароля должна быть больше 8 символов')
            .required('Укажите пароль!'),
        password2: Yup.string()
            .required('Укажите пароль повторно!')
            .oneOf([Yup.ref('password'), null], 'Пароли должны совпадать!'),
    });

    const {
        username = '',
        email = '',
        password = '',
        password2 = '',
    } = props.values;

    const formik = useFormik({
        initialValues: {
            username,
            email,
            password,
            password2,
        },
        validationSchema,
        onSubmit(values) {
            props.nextStep(values);
        },
    });

    const formFields = fields
        .map((element) => {
            return (
                <Input
                    key={element.name}
                    element={element}
                    value={formik.values[element.name]}
                    handleChange={formik.handleChange}
                    handleBlur={formik.handleBlur}
                    handleKeyDown={handleEnter}
                    touched={formik.touched}
                    errors={formik.errors}></Input>
            );
        })
        .reduce((arr, el, idx, array) => {
            if (idx % 2 === 0) {
                arr.push(
                    <div key={el.key} className='col register-form__col'>
                        {el}
                        {array[idx + 1]}
                    </div>,
                );
            }
            return arr;
        }, []);
    return (
        <Form
            APIErrors={props.APIErrors}
            handleSubmit={formik.handleSubmit}
            horizontal={true}
            buttons={
                <Buttons>
                    <button
                        disabled={!isLoad}
                        className='register-form__btn'
                        type='submit'>
                        Готово
                    </button>
                    <div className='register-form__divider'>или</div>
                    <a
                        onClick={() => {
                            navigate('/login/');
                        }}
                        className='register-form__btn register-form__btn--sign'>
                        Войти
                    </a>
                </Buttons>
            }
            fields={formFields}
            circle={props.circle}
            title={'Регистрация'}></Form>
    );
}

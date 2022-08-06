/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import Form from '../Form';
import {useFormik} from 'formik';
import {handleEnter, useLoad} from '../../../lib/authentication';
import Buttons from './RegisterFormButtons';
import Input from './RegisterFormInput';
import * as Yup from 'yup';

export default function RegisterFormStep2(props) {
    const isLoad = useLoad(1700)
    const fields = [
        {
            name: 'first_name',
            type: 'text',
            placeholder: 'Имя',
        },
        {
            name: 'last_name',
            type: 'text',
            placeholder: 'Фамилия',
        },
    ];

    const validationSchema = Yup.object({
        first_name: Yup.string()
            .max(30, 'Длина имени не должна превышать 30 символов!')
            .required('Укажите имя!'),
        last_name: Yup.string()
            .max(30, 'Длина фамилии не должна превышать 30 символов!')
            .required('Укажите фамилию!'),
    });

    const {first_name = '', last_name = ''} = props.values;

    const formik = useFormik({
        initialValues: {
            first_name,
            last_name,
        },
        validationSchema,
        onSubmit(values) {
            props.nextStep(values);
        },
    });

    const formFields = fields.map((element) => {
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
    });

    return (
        <Form
            handleSubmit={formik.handleSubmit}
            APIErrors={props.APIErrors}
            buttons={
                <Buttons>
                    <button className='register-form__btn' type='submit'>
                        Готово
                    </button>
                    <div className='register-form__divider'>или</div>
                    <button
                    disabled={!isLoad}
                        onClick={props.prevStep}
                        className='register-form__btn register-form__btn--sign'
                        type='button'>
                        Назад
                    </button>
                </Buttons>
            }
            fields={formFields}
            circle={props.circle}
            title={'Как к вам обращатся?'}></Form>
    );
}

import React, { useState } from 'react';
import Form from '../../Form';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import FormFields from '../../FormFields';

export default function RegisterFormStepTwo(props) {
    const [showErrors, setShowErrors] = useState(false);
    const validationSchema = Yup.object({
        first_name: Yup.string()
            .max(30, 'Длина имени не должна превышать 30 символов!')
            .required('Укажите имя!'),
        last_name: Yup.string()
            .max(30, 'Длина фамилии не должна превышать 30 символов!')
            .required('Укажите фамилию!'),
    });

    const { first_name = '', last_name = '' } = props.values;

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

    const fields = [
        {
            name: 'first_name',
            type: 'text',
            label: 'Имя',
        },
        {
            name: 'last_name',
            type: 'text',
            label: 'Фамилия',
        },
    ];

    return (
        <Form
            handleSubmit={formik.handleSubmit}
            setShowErrors={setShowErrors}
            buttons={{ prevButton: { prevStep: props.prevStep } }}
            fields={
                <FormFields
                    fields={fields}
                    showErrors={showErrors}
                    handleChange={formik.handleChange}
                    handleBlur={formik.handleBlur}
                    touched={formik.touched}
                    errors={formik.errors}
                    values={formik.values}
                ></FormFields>
            }
            title={props.title}
        ></Form>
    );
}

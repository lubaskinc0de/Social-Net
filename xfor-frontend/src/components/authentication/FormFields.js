import React from 'react';
import { handleEnter } from '../../lib/authentication';
import Input from './FormComponents/FormInput';

export default function FormFields(props) {
    const getValue = (element) => {
        if (element.hasOwnProperty('value')) {
            return element.value;
        }
        return props.values[element.name];
    };

    const getHandleChange = (element) => {
        if (element.hasOwnProperty('handleChange')) {
            return element.handleChange();
        }
        return props.handleChange;
    };

    return props.fields.map((element) => {
        return (
            <Input
                key={element.name}
                showErrors={props.showErrors}
                element={element}
                handleChange={getHandleChange(element)}
                handleBlur={props.handleBlur}
                handleKeyDown={handleEnter}
                setError={props.setFieldError}
                touched={props.touched}
                errors={props.errors}
                setValue={props.setValue}
                value={getValue(element)}
            ></Input>
        );
    });
}

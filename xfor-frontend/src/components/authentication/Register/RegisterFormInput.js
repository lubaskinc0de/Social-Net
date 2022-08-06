import React from 'react';

export default function RegisterFormInput(props) {
    return (
        <div key={props.element.name} className='register-form__field'>
            <input
                id={props.element.name}
                onKeyDown={props.handleKeyDown}
                name={props.element.name}
                type={props.element.type}
                value={props.value}
                placeholder={props.element.placeholder}
                autoComplete='off'
                className={
                    props.touched[props.element.name] &&
                    props.errors[props.element.name]
                        ? 'register-form__input register-form__input--not-valid'
                        : props.touched[props.element.name]
                        ? 'register-form__input register-form__input--valid'
                        : 'register-form__input'
                }
                onChange={props.handleChange}
                onBlur={props.handleBlur}></input>
            {props.touched[props.element.name] &&
            props.errors[props.element.name] ? (
                <div className='invalid-tooltip'>
                    {props.errors[props.element.name]}
                </div>
            ) : (
                ''
            )}
            {props.touched[props.element.name] &&
            props.errors[props.element.name] ? (
                <div className='invalid-feedback'>
                    {props.errors[props.element.name]}
                </div>
            ) : (
                ''
            )}
        </div>
    );
}

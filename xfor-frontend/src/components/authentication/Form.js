/* eslint-disable no-useless-escape */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import Cirlce from './Circle';
import './authentication.css';

export default function Form(props) {
    function getAPIErrors(APIErrors) {
        if (APIErrors.length !== 0) {
            return (
                <div className='alert alert-danger' role='alert'>
                    <p>{APIErrors[0]}</p>
                </div>
            );
        }
    }
    return (
        <main className='register-main'>
            {props.circle || <Cirlce></Cirlce>}
            <div
                className={
                    props.horizontal
                        ? 'register-form-container register-form-container--horizontal'
                        : 'register-form-container'
                }>
                <form onSubmit={props.handleSubmit}>
                    <h1 className='register-form__title'>{props.title}</h1>
                    {getAPIErrors(props.APIErrors)}
                    <div className='register-form__fields row'>
                        {props.fields}
                    </div>
                    {props.buttons}
                </form>
            </div>
        </main>
    );
}

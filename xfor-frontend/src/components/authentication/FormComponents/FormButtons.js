/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import {useLoad} from '../../../lib/authentication';

export default function FormButtons(props) {
    const isLoad = useLoad(200);

    const generalButtonProps = {
        fullWidth: true,
        size: 'large',
        disabled: !isLoad,
        variant: 'contained',
    };

    const getSubmitButton = () => {
        if (props.loading) {
            return (
                <LoadingButton
                    {...generalButtonProps}
                    loading
                    disabled={undefined}
                    sx={{mt: 3, mb: 2}}>
                    Загрузка..
                </LoadingButton>
            );
        }
        return (
            <Button
                {...generalButtonProps}
                type='submit'
                color='success'
                onClick={(e) => {
                    props.handleSubmit(e);
                    props.setShowErrors(true);
                }}
                sx={{mt: 3, mb: 2}}>
                Готово
            </Button>
        );
    };

    const getPrevButton = () => {
        if (!props.prevButton) {
            return null;
        }

        return (
            <Button
                {...generalButtonProps}
                type='button'
                sx={{mb: 2}}
                onClick={props.prevButton.prevStep}>
                Назад
            </Button>
        );
    };

    return (
        <>
            {getSubmitButton()}
            {getPrevButton()}
            {props.alterButton}
        </>
    );
}

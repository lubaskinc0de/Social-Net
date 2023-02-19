import React from 'react';

import Box from '@mui/material/Box';

import AddPostCommentAvatar from './AddPostCommentAvatar';
import AddPostCommentBody from './AddPostCommentBody';
import AddPostCommentButton from './AddPostCommentButton';

import { useFormik } from 'formik';
import { useSelector, useDispatch } from 'react-redux';
import { addComment } from '../../../../store/actions/commentsActions';

import * as Yup from 'yup';

export default function AddPostComment({id, parent=null}) {
    const { post } = useSelector((state) => state.posts);

    const dispatch = useDispatch();

    const validationSchema = Yup.object({
        body: Yup.string().required('Вы не можете оставить пустой комментарий'),
    });

    const formik = useFormik({
        initialValues: {
            body: '',
        },
        validationSchema,
        onSubmit: (values) => {
            dispatch(
                addComment({
                    post: post.id,
                    body: values.body,
                    parent,
                })
            );
        },
    });

    return (
        <Box
            component='form'
            display='flex'
            px={3}
            py={1}
            noValidate
            autoComplete='off'
            flexDirection='column'
            onSubmit={formik.handleSubmit}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <AddPostCommentAvatar></AddPostCommentAvatar>
                <AddPostCommentBody
                    handleChange={formik.handleChange}
                    value={formik.values.body}
                    name='body'
                    id={id}
                    isError={formik.errors.body && formik.touched.body}
                    helperText={
                        formik.errors.body && formik.touched.body
                            ? formik.errors.body
                            : undefined
                    }
                ></AddPostCommentBody>
                <AddPostCommentButton></AddPostCommentButton>
            </Box>
        </Box>
    );
}

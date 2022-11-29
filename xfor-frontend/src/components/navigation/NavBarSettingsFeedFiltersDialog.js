import React from 'react';
import FormDialog from '../utils/FormDialog';
import FormControl from '@mui/material/FormControl';

import NavBarSettingsFeedFiltersDialogPriority from './NavBarSettingsFeedFiltersDialogPriority';
import NavBarSettingsFeedFiltersDialogOrdering from './NavBarSettingsFeedFiltersDialogOrdering';

import { useSelector, useDispatch } from 'react-redux';
import {
    setPostsPriority,
    setPostsOrdering,
} from '../../store/slices/feed/postsSlice';

export default function NavBarSettingsFeedFiltersDialog(props) {
    const { priority, ordering } = useSelector(
        (state) => state.posts.postsFilters
    );
    const dispatch = useDispatch();

    const handleChangePriority = (event) => {
        dispatch(
            setPostsPriority({
                priority: event.target.value,
            })
        );
    };

    const handleChangeOrdering = (event) => {
        dispatch(
            setPostsOrdering({
                ordering: event.target.value,
            })
        );
    };

    return (
        <FormDialog open={props.open} handleClose={props.handleClose}>
            <FormControl>
                <NavBarSettingsFeedFiltersDialogPriority
                    priority={priority}
                    handleChange={handleChangePriority}
                ></NavBarSettingsFeedFiltersDialogPriority>
                <FormControl sx={{ mt: 1, minWidth: 120 }}>
                    <NavBarSettingsFeedFiltersDialogOrdering
                        handleChange={handleChangeOrdering}
                        ordering={ordering || ''}
                    ></NavBarSettingsFeedFiltersDialogOrdering>
                </FormControl>
            </FormControl>
        </FormDialog>
    );
}
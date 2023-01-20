import React, { useEffect } from 'react';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';

import { setPostsCategory } from '../../store/slices/feed/postsSlice';
import { getCategories } from '../../store/actions/postsActions';
import { useSelector, useDispatch } from 'react-redux';

export default function NavBarSettingsFeedFiltersDialogOrdering() {
    const { categories } = useSelector((state) => state.posts);
    const { category } = useSelector((state) => state.posts.postsFilters);

    const dispatch = useDispatch();

    const handleChangeCategory = (event) => {
        dispatch(
            setPostsCategory({
                category: event.target.value,
            })
        );
    };

    useEffect(() => {
        dispatch(getCategories());
    }, [dispatch]);

    return (
        <>
            <InputLabel id='categorySelectLabel'>Категория</InputLabel>
            <Select
                value={category || ''}
                labelId='categorySelectLabel'
                input={<OutlinedInput label='Категория' />}
                onChange={handleChangeCategory}
            >
                {categories
                    ? categories.map((category) => (
                          <MenuItem key={category.id} value={category.id}>
                              {category.title}
                          </MenuItem>
                      ))
                    : null}
            </Select>
        </>
    );
}

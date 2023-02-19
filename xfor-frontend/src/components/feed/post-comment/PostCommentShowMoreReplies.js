import React from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import { useSelector } from 'react-redux';

export default function PostCommentShowMoreReplies({ repliesCnt, getDescendants, commentId }) {
    const { descendantsPage } = useSelector(
        (state) => state.comments
    );

    return repliesCnt && repliesCnt > 0 && !descendantsPage.hasOwnProperty(commentId) ? (
        <Box display='flex' justifyContent='center'>
            <Button onClick={getDescendants} sx={{ mt: 2 }} size='small'>
                Показать еще {repliesCnt} ответ(ов)
            </Button>
        </Box>
    ) : null;
}

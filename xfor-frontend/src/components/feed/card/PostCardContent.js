import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import Link from '@mui/material/Link';

export default function PostCardContent({ content }) {
    const [isFullText, setIsFullText] = useState(false);

    const handleClick = () => {
        setIsFullText(true);
    };

    return (
        <CardContent>
            <Typography variant='body2'>
                {!isFullText && content.length > 250
                    ? content.slice(0, 250)
                    : content}
            </Typography>
            {isFullText || content.length < 250 ? null : (
                <Link underline='none' onClick={handleClick} variant='body2'>
                    Читать дальше..
                </Link>
            )}
        </CardContent>
    );
}

import React, { useState } from 'react';
import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Typography from '@mui/material/Typography';
import { showComponent } from '../../../lib/authentication';

export default function FormAvatarUploader(props) {
    const [avatarPreview, setAvatarPreview] = useState('default');

    const handleChange = (e) => {
        const fileReader = new FileReader();
        const file = e.target.files[0];
        const allowedTypes = [
            'image/jpeg',
            'image/png',
            'image/jpg',
            'image/gif',
        ];

        fileReader.onload = () => {
            if (fileReader.readyState === 2) {
                setAvatarPreview(fileReader.result);
                props.handleChange(fileReader.result);
            }
        };

        if (file) {
            if (allowedTypes.indexOf(file.type) !== -1) {
                fileReader.readAsDataURL(file);
            } else {
                props.handleChange('', false);
                props.setError(
                    props.name,
                    'Файл, который вы загрузили, поврежден или не является изображением.'
                );
                setAvatarPreview('default');
            }
        } else {
            props.handleChange('');
            setAvatarPreview('default');
        }
    };

    return (
        <Card>
            {showComponent(
                <Typography
                    sx={{
                        paddingTop: '7px',
                        color: '#f44336',
                        fontWeight: 400,
                        fontSize: '0.75rem',
                    }}
                    align='center'
                    variant='caption'
                    display='block'
                >
                    {props.helperText}
                </Typography>,
                props.helperText
            )}
            <Box p={2}>
                <Stack
                    justifyContent={'center'}
                    alignItems={'center'}
                    spacing={2}
                >
                    <Avatar
                        src={avatarPreview}
                        sx={{
                            width: props.width,
                            height: props.height,
                        }}
                    ></Avatar>
                    <Button
                        component='label'
                        startIcon={<CloudUploadIcon></CloudUploadIcon>}
                        variant='contained'
                    >
                        Загрузить фото профиля
                        <input
                            accept='image/*'
                            type='file'
                            id={props.id}
                            name={props.name}
                            hidden
                            onChange={handleChange}
                        />
                    </Button>
                </Stack>
            </Box>
        </Card>
    );
}

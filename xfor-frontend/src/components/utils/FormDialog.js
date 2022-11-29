import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

export default function FormDialog(props) {
    return (
        <div>
            <Dialog open={props.open} onClose={props.handleClose}>
                <DialogTitle>Фильтры ленты</DialogTitle>
                <DialogContent>{props.children}</DialogContent>
                <DialogActions>
                    <Button onClick={props.handleClose}>Закрыть</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

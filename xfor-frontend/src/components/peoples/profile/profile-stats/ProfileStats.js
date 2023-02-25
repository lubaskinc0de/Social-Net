import React from 'react';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import Box from '@mui/material/Box';

export default function ProfileStatsTable({
    followersCount,
    city,
    yearsOld,
    dateJoined,
}) {
    return (
        <TableContainer component={Box}>
            <Table aria-label='profile stats'>
                <TableHead>
                    <TableRow>
                        <TableCell>Подписчиков</TableCell>
                        <TableCell>Город</TableCell>
                        <TableCell>Лет</TableCell>
                        <TableCell>Зарегeстрировался</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow
                        sx={{
                            '&:last-child td, &:last-child th': {
                                border: 0,
                            },
                        }}
                    >
                        <TableCell>{followersCount}</TableCell>
                        <TableCell>{city}</TableCell>
                        <TableCell>{yearsOld}</TableCell>
                        <TableCell>{dateJoined}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
}

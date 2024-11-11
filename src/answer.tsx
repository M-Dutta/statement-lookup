import React, { useState } from 'react';

import { Box, Container, Typography } from '@mui/material';




export interface AnswerProps {
    aiName: string
    answer: string
}

const Answer: React.FC<AnswerProps> = ({ aiName, answer }) => {

    return (
        <Box sx={{
            alignItems: 'center',
            width: 400,
            background: "rgb(134 164 214 / 12%)",
            border: "1px solid rgb(163 201 255)",
            borderRadius: "8px 8px"
        }}>
            <Container sx={{
                background: "rgb(229 237 255)",
                borderBottom: "1px solid rgb(163 201 255)",
                borderRadius: "8px 8px 0 0"
            }}>
                <Typography variant="h6">{aiName} Answer</Typography>
            </Container>
            <Container >
                <Typography>{answer}</Typography>
            </Container>
        </Box>
    );
}

export default Answer
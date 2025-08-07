import React from 'react';
import { Paper, Box, Typography, Divider, Stack } from '@mui/material';
import PlaceAnalysis from './PlaceAnalysis';
import CustomerAnalysis from './CustomerAnalysis';

const LeftSidebar: React.FC = () => {
  return (
    <Paper 
      elevation={4}
      sx={{
        p: 2,
        backgroundColor: '#f5f5f5',
        width: 360,
        height: 'calc(100vh - 104px)', // Updated for AppBar
        position: 'absolute',
        top: '84px', // Updated: 64px AppBar + 20px margin
        left: '20px',
        borderRadius: '10px',
        overflowY: 'auto',
        zIndex: 10 // Haritanın üzerinde kalmasını sağlar
      }}
    >
      <Stack spacing={3}>
        {/* 1. Ana Başlık */}
        <Box>
          <Typography variant="h6" fontWeight="bold">
            Filtreler & Kontroller
          </Typography>
          <Divider sx={{ mt: 1 }} />
        </Box>

        {/* 2. Place Analysis Bölümü */}
        <PlaceAnalysis />

        {/* 4. Customer Analysis Bölümü */}
        <CustomerAnalysis />

      </Stack>
    </Paper>
  );
};

export default LeftSidebar;

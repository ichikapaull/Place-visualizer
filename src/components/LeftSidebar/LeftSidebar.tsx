import React from 'react';
import { Paper, Box, Typography, Divider, Stack } from '@mui/material';
import PlaceAnalysis from './PlaceAnalysis';
import CustomerAnalysis from './CustomerAnalysis';

interface LeftSidebarProps {
  onFiltersChange?: (filters: {
    radius: number;
    industry: string[];
    showLayer: boolean;
    tradeAreas: { [key: string]: boolean };
  }) => void;
  onAnalysisTypeChange?: (analysisType: string) => void;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ onFiltersChange, onAnalysisTypeChange }) => {
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
        <PlaceAnalysis onFiltersChange={onFiltersChange} />

        {/* 4. Customer Analysis Bölümü */}
        <CustomerAnalysis onAnalysisTypeChange={onAnalysisTypeChange} />

      </Stack>
    </Paper>
  );
};

export default LeftSidebar;

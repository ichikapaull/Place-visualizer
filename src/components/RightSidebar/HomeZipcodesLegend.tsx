import React from 'react';
import { Paper, Box, Typography, Stack } from '@mui/material';

const HomeZipcodesLegend: React.FC = () => {
  const legendItems = [
    { label: 'En Yüksek Yoğunluk', color: [0, 68, 27, 180], range: '80-100%' },
    { label: 'Yüksek Yoğunluk', color: [44, 162, 95, 160], range: '60-80%' },
    { label: 'Orta Yoğunluk', color: [153, 216, 201, 140], range: '40-60%' },
    { label: 'Düşük Yoğunluk', color: [229, 245, 249, 120], range: '20-40%' },
    { label: 'En Düşük Yoğunluk', color: [247, 252, 253, 100], range: '0-20%' },
  ];

  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Home Zipcodes
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Müşteri İkametgah Yoğunluğu (Quintile)
      </Typography>
      <Stack spacing={1}>
        {legendItems.map((item, idx) => (
          <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 20,
                height: 16,
                backgroundColor: `rgba(${item.color[0]}, ${item.color[1]}, ${item.color[2]}, ${item.color[3] / 255})`,
                border: '1px solid rgba(255, 255, 255, 0.6)',
                borderRadius: 0.5,
                flexShrink: 0,
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <Typography variant="body2" fontWeight="medium">
                {item.label}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {item.range}
              </Typography>
            </Box>
          </Box>
        ))}
      </Stack>
    </Paper>
  );
};

export default HomeZipcodesLegend;


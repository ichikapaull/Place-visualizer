import React from 'react';
import { Paper, Box, Typography, Stack } from '@mui/material';
import { useAppStore } from '../../store/appStore';
import { useCompetitors, useMyPlace } from '../../hooks/useApi';
import { useHomeZipcodeData } from '../../hooks/useHomeZipcodeData';

const quintileColors: [number, number, number, number][] = [
  [198, 219, 239, 70],  // light blue
  [158, 202, 225, 85],
  [107, 174, 214, 100],
  [49, 130, 189, 120],
  [8, 81, 156, 140],
];

const formatPercent = (value: number) => `${(value).toFixed(1)}%`;

const HomeZipcodesLegend: React.FC = () => {
  const { zipcodePlaceId } = useAppStore();
  const { data: myPlace } = useMyPlace();
  const { data: competitors } = useCompetitors();

  // Determine which place's data is being shown
  const zipcodeTargetPlace = React.useMemo(() => {
    if (!zipcodePlaceId) return null;
    if (myPlace?.id === zipcodePlaceId) return myPlace;
    const comp = (competitors || []).find((p) => p.id === zipcodePlaceId) || null;
    return comp;
  }, [zipcodePlaceId, myPlace, competitors]);

  const { data: homeZipcodeData = [] } = useHomeZipcodeData(zipcodeTargetPlace);

  // Compute percentage ranges per quintile based on customer_count share
  const legendItems = React.useMemo(() => {
    if (!homeZipcodeData || homeZipcodeData.length === 0) {
      // Fallback generic ranges if no data
      return [
        { label: 'En Yüksek Yoğunluk', color: quintileColors[4], range: '80-100%' },
        { label: 'Yüksek Yoğunluk', color: quintileColors[3], range: '60-80%' },
        { label: 'Orta Yoğunluk', color: quintileColors[2], range: '40-60%' },
        { label: 'Düşük Yoğunluk', color: quintileColors[1], range: '20-40%' },
        { label: 'En Düşük Yoğunluk', color: quintileColors[0], range: '0-20%' },
      ];
    }

    const total = homeZipcodeData.reduce((sum, z) => sum + (Number(z.customer_count) || 0), 0) || 1;
    // Group by quintile 1..5
    const groups: Record<number, number[]> = { 1: [], 2: [], 3: [], 4: [], 5: [] };
    homeZipcodeData.forEach((z) => {
      const q = Math.max(1, Math.min(5, Number(z.quintile) || 1));
      const pct = (Number(z.customer_count) || 0) / total * 100;
      groups[q].push(pct);
    });

    const ranges = [1,2,3,4,5].map((q) => {
      const arr = groups[q];
      if (!arr.length) return [0, 0];
      return [Math.min(...arr), Math.max(...arr)];
    });

    return [
      { label: 'En Düşük Yoğunluk', color: quintileColors[0], range: `${formatPercent(ranges[0][0])} - ${formatPercent(ranges[0][1])}` },
      { label: 'Düşük Yoğunluk', color: quintileColors[1], range: `${formatPercent(ranges[1][0])} - ${formatPercent(ranges[1][1])}` },
      { label: 'Orta Yoğunluk', color: quintileColors[2], range: `${formatPercent(ranges[2][0])} - ${formatPercent(ranges[2][1])}` },
      { label: 'Yüksek Yoğunluk', color: quintileColors[3], range: `${formatPercent(ranges[3][0])} - ${formatPercent(ranges[3][1])}` },
      { label: 'En Yüksek Yoğunluk', color: quintileColors[4], range: `${formatPercent(ranges[4][0])} - ${formatPercent(ranges[4][1])}` },
    ];
  }, [homeZipcodeData]);

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


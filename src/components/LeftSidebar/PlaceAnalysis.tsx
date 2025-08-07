import React, { useState } from 'react';
import {
  Paper,
  Box,
  Typography,
  Switch,
  TextField,
  Select,
  MenuItem,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Stack,
  Divider,
  keyframes,
  CircularProgress
} from '@mui/material';
import SettingsInputAntennaIcon from '@mui/icons-material/SettingsInputAntenna';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import { useIndustries } from '../../hooks/useApi';

// Yanıp sönme animasyonu
const blink = keyframes`
  50% {
    opacity: 0.5;
  }
`;

interface PlaceAnalysisProps {
  onFiltersChange?: (filters: {
    radius: number;
    industry: string;
    showLayer: boolean;
    tradeAreas: { [key: string]: boolean };
  }) => void;
}

const PlaceAnalysis: React.FC<PlaceAnalysisProps> = ({ onFiltersChange }) => {
  const [showLayer, setShowLayer] = useState(true);
  const [radius, setRadius] = useState<number>(0);
  const [industry, setIndustry] = useState('');
  const [tradeAreas, setTradeAreas] = useState({
    '30': true,
    '50': true,
    '70': false,
  });

  const { data: industries, isLoading: industriesLoading } = useIndustries();

  // Notify parent about filter changes
  React.useEffect(() => {
    if (onFiltersChange) {
      onFiltersChange({ radius, industry, showLayer, tradeAreas });
    }
  }, [radius, industry, showLayer, tradeAreas, onFiltersChange]);

  const handleTradeAreaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTradeAreas({
      ...tradeAreas,
      [event.target.name]: event.target.checked,
    });
  };

  const handleSelectAll = () => {
    setTradeAreas({ '30': true, '50': true, '70': true });
  };

  const handleClearAll = () => {
    setTradeAreas({ '30': false, '50': false, '70': false });
  };
  
  const handleClearAllFilters = () => {
    setRadius(0);
    setIndustry('');
    setShowLayer(true);
    handleClearAll();
  };

  return (
    <Paper elevation={1} sx={{ p: 2 }}>
      <Stack spacing={2.5}>
        {/* Bölüm Başlığı */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography fontWeight="600">Place Analysis</Typography>
          <SettingsInputAntennaIcon color="action" />
        </Box>

        {/* Show Places Layer Kontrolü */}
        <Box sx={{ 
          backgroundColor: 'grey.200',
          p: 2,
          borderRadius: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <Switch
            checked={showLayer}
            onChange={(e) => setShowLayer(e.target.checked)}
            color="primary"
          />
          <VisibilityIcon color="primary" />
          <Typography fontWeight="500">Show Places Layer</Typography>
        </Box>
        
        <Divider />

        {/* Radius Filter */}
        <Box>
          <Typography 
            variant="h6" 
            fontWeight="bold" 
            gutterBottom 
            sx={{ 
              color: 'text.primary',
              fontSize: '18px',
              mb: 1.5
            }}
          >
            Radius Filter
          </Typography>
          <Box sx={{ mb: 1 }}>
            <TextField
              type="number"
              label="Radius (km)"
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              fullWidth
              variant="outlined"
              InputProps={{
                inputProps: {
                  min: 0,
                  step: 1
                }
              }}
              InputLabelProps={{
                sx: {
                  color: 'text.primary',
                  '&.Mui-focused': {
                    color: 'text.primary'
                  }
                }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'white',
                  borderRadius: 2,
                  '& fieldset': {
                    borderColor: '#e0e0e0',
                  },
                  '& input': {
                    fontSize: '16px',
                    py: 1.5
                  },
                  '&:hover fieldset': {
                    borderColor: '#e0e0e0',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#e0e0e0',
                  }
                }
              }}
            />
            <Typography 
              variant="body2" 
              sx={{ 
                mt: 1, 
                color: 'text.secondary',
                fontSize: '14px'
              }}
            >
              Filter places within radius
            </Typography>
          </Box>
        </Box>

        {/* Industry Filter */}
        <Box>
          <Typography 
            variant="h6" 
            fontWeight="bold" 
            gutterBottom 
            sx={{ 
              color: 'text.primary',
              fontSize: '18px',
              mb: 1.5
            }}
          >
            Industry Filter
          </Typography>
          <Box>
            <FormControl fullWidth>
              <Select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                displayEmpty
                disabled={industriesLoading}
                sx={{
                  backgroundColor: 'white',
                  borderRadius: 2,
                  '& .MuiSelect-select': {
                    fontSize: '16px',
                    py: 1.5,
                    color: industry ? 'text.primary' : 'text.secondary'
                  },
                  '& fieldset': {
                    borderColor: '#e0e0e0',
                  },
                  '&:hover fieldset': {
                    borderColor: '#e0e0e0',
                  },
                  '& .Mui-focused fieldset': {
                    borderColor: '#e0e0e0',
                  }
                }}
              >
                <MenuItem value="" sx={{ fontSize: '16px', color: 'text.secondary' }}>
                  {industriesLoading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CircularProgress size={16} />
                      Loading Industries...
                    </Box>
                  ) : (
                    'Select Industries'
                  )}
                </MenuItem>
                {industries?.map((ind) => (
                  <MenuItem key={ind} value={ind} sx={{ fontSize: '16px' }}>{ind}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Trade Area Percentages */}
        <Box>
          <Typography 
            variant="h6" 
            fontWeight="bold" 
            gutterBottom 
            sx={{ 
              color: 'text.primary',
              fontSize: '18px',
              mb: 1.5,
              textAlign: 'center'
            }}
          >
            Trade Area Percentages
          </Typography>
          <FormGroup>
            <FormControlLabel
              control={<Checkbox checked={tradeAreas['30']} onChange={handleTradeAreaChange} name="30" />}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: 'gold', mr: 1.5 }} />
                    <Typography fontWeight="500">30% Trade Area</Typography>
                  </Box>
                  {tradeAreas['30'] && (
                    <Box sx={{ 
                      backgroundColor: '#e3f2fd', 
                      px: 1.5, 
                      py: 0.5, 
                      borderRadius: 1,
                      ml: 2
                    }}>
                      <Typography variant="caption" sx={{ color: '#1565c0', fontWeight: '700', fontSize: '12px' }}>
                        Active
                      </Typography>
                    </Box>
                  )}
                </Box>
              }
              sx={{ width: '100%', mr: 0 }}
            />
            <FormControlLabel
              control={<Checkbox checked={tradeAreas['50']} onChange={handleTradeAreaChange} name="50" />}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: 'orange', mr: 1.5 }} />
                    <Typography fontWeight="500">50% Trade Area</Typography>
                  </Box>
                  {tradeAreas['50'] && (
                    <Box sx={{ 
                      backgroundColor: '#e3f2fd', 
                      px: 1.5, 
                      py: 0.5, 
                      borderRadius: 1,
                      ml: 2
                    }}>
                      <Typography variant="caption" sx={{ color: '#1565c0', fontWeight: '700', fontSize: '12px' }}>
                        Active
                      </Typography>
                    </Box>
                  )}
                </Box>
              }
              sx={{ width: '100%', mr: 0 }}
            />
            <FormControlLabel
              control={<Checkbox checked={tradeAreas['70']} onChange={handleTradeAreaChange} name="70" />}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: 'red', mr: 1.5 }} />
                    <Typography fontWeight="500">70% Trade Area</Typography>
                  </Box>
                  {tradeAreas['70'] && (
                    <Box sx={{ 
                      backgroundColor: '#e3f2fd', 
                      px: 1.5, 
                      py: 0.5, 
                      borderRadius: 1,
                      ml: 2
                    }}>
                      <Typography variant="caption" sx={{ color: '#1565c0', fontWeight: '700', fontSize: '12px' }}>
                        Active
                      </Typography>
                    </Box>
                  )}
                </Box>
              }
              sx={{ width: '100%', mr: 0 }}
            />
          </FormGroup>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 2, gap: 2 }}>
            <Button 
              size="medium" 
              variant="outlined" 
              onClick={handleSelectAll}
              sx={{ 
                borderColor: '#e0e0e0', 
                color: '#666',
                textTransform: 'none',
                fontSize: '14px',
                px: 3,
                py: 1
              }}
            >
              Select All
            </Button>
            <Button 
              size="medium" 
              variant="outlined" 
              onClick={handleClearAll} 
              sx={{ 
                borderColor: '#d4a574', 
                color: '#8b4513',
                textTransform: 'none',
                fontSize: '14px',
                px: 3,
                py: 1
              }}
            >
              Clear All
            </Button>
          </Box>
        </Box>
        
        <Divider />

        {/* Clear All Filters Butonu */}
        <Button
          variant="outlined"
          fullWidth
          startIcon={<CloseIcon />}
          onClick={handleClearAllFilters}
          sx={{
            borderColor: '#d4a574',
            color: '#8b4513',
            textTransform: 'none',
            fontSize: '16px',
            py: 1.5,
            borderRadius: 2
          }}
        >
          Clear All Filters
        </Button>
      </Stack>
    </Paper>
  );
};

export default PlaceAnalysis;

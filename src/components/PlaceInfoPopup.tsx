import React from 'react';
import {
  Paper,
  Box,
  Typography,
  IconButton,
  Button,
  Chip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import type { Place } from '../types';

interface PlaceInfoPopupProps {
  place: Place;
  isTradeAreaSelected: boolean;
  isTradeAreaVisible?: boolean; // Bu place'in trade area'sı şu anda görünür mü?
  hasTradeAreaData?: boolean; // Bu place'in trade area verisi var mı?
  position?: { x: number; y: number } | null;
  onClose: () => void;
  onShowAction: () => void;
}

const PlaceInfoPopup: React.FC<PlaceInfoPopupProps> = ({
  place,
  isTradeAreaSelected,
  isTradeAreaVisible = false,
  hasTradeAreaData = true,
  position,
  onClose,
  onShowAction
}) => {
  return (
    <Paper
      elevation={8}
      sx={{
        position: 'absolute',
        top: position ? position.y : 10,
        left: position ? position.x : 10,
        width: 300,
        maxWidth: '90vw',
        zIndex: 1000,
        borderRadius: 2,
        overflow: 'hidden',
        transform: position ? 'translate(-50%, -100%)' : 'none' // Center horizontally and position above click point
      }}
      onClick={(e) => e.stopPropagation()} // Prevent popup from closing when clicking inside it
    >
      {/* Header */}
      <Box
        sx={{
          backgroundColor: '#ff6b35',
          color: 'white',
          px: 2,
          py: 1.5,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LocationOnIcon />
          <Typography variant="h6" fontWeight="bold">
            Place Information
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          sx={{ color: 'white', p: 0.5 }}
          size="small"
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Content */}
      <Box sx={{ p: 2 }}>
        {/* Place Name */}
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ mb: 1, color: 'text.primary' }}
        >
          {place.name}
        </Typography>

        {/* Address */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
          <LocationOnIcon sx={{ color: 'text.secondary', fontSize: 16 }} />
          <Typography variant="body2" color="text.secondary">
            {place.address || `${place.latitude}, ${place.longitude}`}
          </Typography>
        </Box>

        {/* Industry */}
        {place.sub_category && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <BusinessIcon sx={{ color: 'text.secondary', fontSize: 16 }} />
            <Chip
              label={place.sub_category}
              size="small"
              sx={{
                backgroundColor: '#e3f2fd',
                color: '#1976d2',
                fontWeight: 'medium'
              }}
            />
          </Box>
        )}

        {/* Analysis Actions Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
          <BusinessIcon sx={{ color: '#1976d2', fontSize: 20 }} />
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            sx={{ color: 'text.primary' }}
          >
            Analysis Actions
          </Typography>
        </Box>

        {/* Action Button */}
        <Button
          variant="contained"
          fullWidth
          disabled={isTradeAreaSelected && !hasTradeAreaData}
          startIcon={isTradeAreaSelected && isTradeAreaVisible ? <VisibilityOffIcon /> : <VisibilityIcon />}
          onClick={onShowAction}
          sx={{
            backgroundColor: isTradeAreaSelected && isTradeAreaVisible ? '#d32f2f' : '#1976d2',
            color: 'white',
            textTransform: 'none',
            fontWeight: 'medium',
            py: 1,
            '&:hover': {
              backgroundColor: isTradeAreaSelected && isTradeAreaVisible ? '#c62828' : '#1565c0'
            },
            '&:disabled': {
              backgroundColor: '#e0e0e0',
              color: '#9e9e9e'
            }
          }}
        >
          {isTradeAreaSelected ? 
            (hasTradeAreaData ? 
              (isTradeAreaVisible ? 'Hide Trade Area' : 'Show Trade Area') : 
              'Trade Area Unavailable'
            ) : 
            'Show Zip Codes'
          }
        </Button>
        
        {/* No Data Message */}
        {isTradeAreaSelected && !hasTradeAreaData && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ 
              mt: 1, 
              fontStyle: 'italic',
              textAlign: 'center',
              backgroundColor: '#fff3e0',
              border: '1px solid #ffcc02',
              borderRadius: 1,
              p: 1
            }}
          >
            Bu place için trade area verisi mevcut değildir
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default PlaceInfoPopup;
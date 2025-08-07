import React, { useState, useEffect } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Chip,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Stack,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import BarChartIcon from '@mui/icons-material/BarChart';
import { useAppStore } from '../../store/appStore';

interface CustomerAnalysisProps {
  onAnalysisTypeChange?: (analysisType: string) => void;
}

const CustomerAnalysis: React.FC<CustomerAnalysisProps> = ({ onAnalysisTypeChange }) => {
  const { analysisType, setAnalysisType } = useAppStore();
  const [localAnalysisType, setLocalAnalysisType] = useState(analysisType);

  // Sync with global store
  useEffect(() => {
    setLocalAnalysisType(analysisType);
  }, [analysisType]);

  const handleAnalysisTypeChange = (newType: string) => {
    const typedNewType = newType as 'Trade Area' | 'Home Zipcodes';
    setLocalAnalysisType(typedNewType);
    setAnalysisType(typedNewType);
    if (onAnalysisTypeChange) {
      onAnalysisTypeChange(newType);
    }
  };

  return (
    <Accordion defaultExpanded>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="customer-analysis-content"
        id="customer-analysis-header"
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <Typography fontWeight="bold">Customer Analysis</Typography>
          <Chip 
            label={analysisType} 
            color={analysisType === 'Trade Area' ? 'primary' : 'secondary'} 
            size="small" 
          />
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Stack spacing={2}>
          {/* Analysis Type */}
          <FormControl fullWidth>
            <InputLabel>Analysis Type</InputLabel>
            <Select
              value={localAnalysisType}
              label="Analysis Type"
              onChange={(e) => handleAnalysisTypeChange(e.target.value)}
              renderValue={(value) => (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <BarChartIcon sx={{ mr: 1 }} />
                  {value}
                </Box>
              )}
            >
              <MenuItem value="Trade Area">Trade Area</MenuItem>
              <MenuItem value="Home Zipcodes">Home Zipcodes</MenuItem>
            </Select>
          </FormControl>

          {/* Bilgi Kutusu */}
          <Alert severity="info">
            {analysisType === 'Trade Area' 
              ? 'Trade area yüzdelik kontrollerini Place Analysis bölümünden yapabilirsiniz. Bir place\'in "Show Trade Area" butonuna tıklayın.'
              : 'Home Zipcodes analizi için bir place\'e tıklayıp "Show Zip Codes" butonunu kullanın. Aynı anda sadece bir place için görünür.'
            }
          </Alert>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};

export default CustomerAnalysis;

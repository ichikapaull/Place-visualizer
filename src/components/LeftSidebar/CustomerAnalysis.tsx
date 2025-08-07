import React, { useState } from 'react';
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

const CustomerAnalysis: React.FC = () => {
  const [analysisType, setAnalysisType] = useState('Trade Area Analysis');

  return (
    <Accordion defaultExpanded>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="customer-analysis-content"
        id="customer-analysis-header"
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <Typography fontWeight="bold">Customer Analysis</Typography>
          <Chip label="Trade Area" color="primary" size="small" />
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Stack spacing={2}>
          {/* Analysis Type */}
          <FormControl fullWidth>
            <InputLabel>Analysis Type</InputLabel>
            <Select
              value={analysisType}
              label="Analysis Type"
              onChange={(e) => setAnalysisType(e.target.value)}
              renderValue={(value) => (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <BarChartIcon sx={{ mr: 1 }} />
                  {value}
                </Box>
              )}
            >
              <MenuItem value="Trade Area Analysis">Trade Area Analysis</MenuItem>
              <MenuItem value="Home Zipcodes Analysis">Home Zipcodes Analysis</MenuItem>
            </Select>
          </FormControl>

          {/* Bilgi Kutusu */}
          <Alert severity="info">
            Trade area yüzdelik kontrollerini Place Analysis bölümünden yapabilirsiniz. Bir place'in 'Show Trade Area' butonuna tıklayın.
          </Alert>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};

export default CustomerAnalysis;

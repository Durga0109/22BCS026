import React, { useState, useEffect } from 'react';
import { 
  Paper, 
  Typography, 
  Box,
  TextField,
  Card,
  CardContent,
  CircularProgress,
  MenuItem
} from '@mui/material';
import { stockApi } from '../services/stockApi';

const CorrelationHeatmap: React.FC = () => {
  const [minutes, setMinutes] = useState(30);
  const [stocks, setStocks] = useState<{[key: string]: string}>({});
  const [loading, setLoading] = useState(false);
  const [selectedStock, setSelectedStock] = useState('');
  const [stockStats, setStockStats] = useState<{avg: number, stdDev: number}>({avg: 0, stdDev: 0});

  useEffect(() => {
    loadStocks();
  }, []);

  const loadStocks = async () => {
    try {
      const data = await stockApi.getAllStocks();
      setStocks(data.stocks);
      const firstTicker = Object.values(data.stocks)[0] as string;
      setSelectedStock(firstTicker);
    } catch (error) {
      console.error('Error loading stocks:', error);
    }
  };

  const calculateStats = async () => {
    if (!selectedStock) return;
    
    setLoading(true);
    try {
      const data = await stockApi.getStockPrices(selectedStock, minutes);
      
      const prices = data.map((item: any) => item.price);
      const avg = prices.reduce((sum: number, price: number) => sum + price, 0) / prices.length;
      
      const variance = prices.reduce((sum: number, price: number) => sum + Math.pow(price - avg, 2), 0) / (prices.length - 1);
      const stdDev = Math.sqrt(variance);
      
      setStockStats({ avg, stdDev });
    } catch (error) {
      console.error('Error calculating stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedStock) {
      calculateStats();
    }
  }, [selectedStock, minutes]);

  const correlationColors = [
    { range: '0.7 - 1.0', color: '#d32f2f', label: 'Strong Positive' },
    { range: '0.3 - 0.7', color: '#f57c00', label: 'Moderate Positive' },
    { range: '-0.3 - 0.3', color: '#fbc02d', label: 'Weak' },
    { range: '-0.7 - -0.3', color: '#388e3c', label: 'Moderate Negative' },
    { range: '-1.0 - -0.7', color: '#1976d2', label: 'Strong Negative' }
  ];

  return (
    <Paper sx={{ p: 3, m: 2 }}>
      <Typography variant="h4" gutterBottom>
        Correlation Heatmap
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          select
          label="Select Stock for Stats"
          value={selectedStock}
          onChange={(e) => setSelectedStock(e.target.value)}
          sx={{ minWidth: 200 }}
        >
          {Object.entries(stocks).map(([name, ticker]) => (
            <MenuItem key={ticker} value={ticker}>
              {name} ({ticker})
            </MenuItem>
          ))}
        </TextField>
        
        <TextField
          type="number"
          label="Minutes"
          value={minutes}
          onChange={(e) => setMinutes(Number(e.target.value))}
          sx={{ width: 120 }}
          inputProps={{ min: 1, max: 1440 }}
        />
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box 
          sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
            gap: 3 
          }}
        >
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Stock Statistics - {selectedStock}
              </Typography>
              <Typography variant="body1">
                Average Price: ${stockStats.avg.toFixed(2)}
              </Typography>
              <Typography variant="body1">
                Standard Deviation: ${stockStats.stdDev.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Correlation Legend
              </Typography>
              {correlationColors.map((item, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box 
                    sx={{ 
                      width: 20, 
                      height: 20, 
                      bgcolor: item.color, 
                      mr: 1,
                      border: '1px solid #ccc'
                    }} 
                  />
                  <Typography variant="body2">
                    {item.label} ({item.range})
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Box>
      )}

      <Box sx={{ mt: 3 }}>
        <Typography variant="body1" color="text.secondary">
          Correlation heatmap shows the relationship between different stocks over the selected time period.
          Values closer to 1 indicate strong positive correlation, while values closer to -1 indicate strong negative correlation.
        </Typography>
      </Box>
    </Paper>
  );
};

export default CorrelationHeatmap;
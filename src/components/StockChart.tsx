import React, { useState, useEffect } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { 
  Box, 
  TextField, 
  MenuItem, 
  Typography, 
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';
import { stockApi } from '../services/stockApi';
import { StockPrice, PriceData } from '../types';

const StockChart: React.FC = () => {
  const [stocks, setStocks] = useState<{[key: string]: string}>({});
  const [selectedStock, setSelectedStock] = useState('');
  const [minutes, setMinutes] = useState(30);
  const [chartData, setChartData] = useState<PriceData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [average, setAverage] = useState(0);

  useEffect(() => {
    loadStocks();
  }, []);

  useEffect(() => {
    if (selectedStock) {
      loadStockData();
    }
  }, [selectedStock, minutes]);

  const loadStocks = async () => {
    try {
      setError('');
      const data = await stockApi.getAllStocks();
      setStocks(data.stocks);
      
      const firstTicker = Object.values(data.stocks)[0] as string;
      setSelectedStock(firstTicker);
    } catch (error) {
      setError('Failed to load stocks. Please check your connection.');
    }
  };

  const loadStockData = async () => {
    if (!selectedStock) return;
    
    setLoading(true);
    setError('');
    
    try {
      const data = await stockApi.getStockPrices(selectedStock, minutes);
      
      const transformedData: PriceData[] = data.map((item: StockPrice, index: number) => ({
        x: index,
        y: item.price,
        time: new Date(item.lastUpdatedAt).toLocaleTimeString()
      }));
      
      setChartData(transformedData);
      
      const avgPrice = data.reduce((sum: number, item: StockPrice) => sum + item.price, 0) / data.length;
      setAverage(avgPrice);
      
    } catch (error) {
      setError('Failed to load stock data. Please try again.');
      setChartData([]);
      setAverage(0);
    } finally {
      setLoading(false);
    }
  };

  const getChartWidth = () => {
    return window.innerWidth > 768 ? 800 : Math.min(350, window.innerWidth - 100);
  };

  return (
    <Paper sx={{ p: 3, m: 2 }}>
      <Typography variant="h4" gutterBottom>
        Stock Price Chart
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          select
          label="Select Stock"
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

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {average > 0 && (
            <Typography variant="h6" color="primary" gutterBottom>
              Average Price: ${average.toFixed(2)}
            </Typography>
          )}
          
          {chartData.length > 0 && (
            <Box sx={{ overflowX: 'auto' }}>
              <LineChart
                width={getChartWidth()}
                height={400}
                series={[
                  {
                    data: chartData.map(d => d.y),
                    label: `${selectedStock} Price`,
                    color: '#1976d2'
                  },
                  {
                    data: Array(chartData.length).fill(average),
                    label: 'Average Price',
                    color: '#f44336'
                  }
                ]}
                xAxis={[{
                  data: chartData.map((_, index) => index),
                  label: 'Time Points'
                }]}
                yAxis={[{
                  label: 'Price ($)'
                }]}
              />
            </Box>
          )}
        </>
      )}
    </Paper>
  );
};

export default StockChart;
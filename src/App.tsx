import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Container, 
  Tabs, 
  Tab, 
  Box,
  ThemeProvider,
  createTheme
} from '@mui/material';
import StockChart from './components/StockChart';
import CorrelationHeatmap from './components/Heatmap';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#f44336',
    },
  },
});

function App() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Stock Price Aggregation App
            </Typography>
          </Toolbar>
        </AppBar>
        
        <Container maxWidth="lg" sx={{ mt: 2 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            centered
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label="Stock Price Chart" />
            <Tab label="Correlation Heatmap" />
          </Tabs>
          
          <Box sx={{ mt: 2 }}>
            {tabValue === 0 && <StockChart />}
            {tabValue === 1 && <CorrelationHeatmap />}
          </Box>
        </Container>
      </div>
    </ThemeProvider>
  );
}

export default App;
import { StockPrice, StocksResponse } from '../types';

class StockApiService {
  private baseUrl = '/evaluation-service';

  private authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJkdXJnYS4yMmNzQGtjdC5hYy5pbiIsImV4cCI6MTc1MDQ4ODU0OSwiaWF0IjoxNzUwNDg4MjQ5LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiYjcwMDc4NDctZmM5MS00YjJiLWFmNzQtYjM2MGUwYWQ1OGFhIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoiZHVyZ2EgcyIsInN1YiI6ImIzYzljOTg1LWRkNjktNGVkMi04ZjgxLTJiMTI3MGFmOTQ2MCJ9LCJlbWFpbCI6ImR1cmdhLjIyY3NAa2N0LmFjLmluIiwibmFtZSI6ImR1cmdhIHMiLCJyb2xsTm8iOiIyMmJjczAyNiIsImFjY2Vzc0NvZGUiOiJXY1RTS3YiLCJjbGllbnRJRCI6ImIzYzljOTg1LWRkNjktNGVkMi04ZjgxLTJiMTI3MGFmOTQ2MCIsImNsaWVudFNlY3JldCI6InJ2dVh3UEdKV3VtV1lGbkIifQ.Jh834um7QfkKF9YgW3b3IHrx0rEXKGyswbz8bLL9lMs'; 
  private getHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authToken}`, 
    };
  }
  async getAllStocks(): Promise<StocksResponse> {
    console.log('Fetching all stocks...');
    
    try {
     
      const response = await fetch(`${this.baseUrl}/stocks`);
      
    
      if (!response.ok) {
        throw new Error(`Failed to fetch stocks: ${response.status}`);
      }
    
      const data = await response.json();
      console.log('✅ Successfully fetched stocks:', data);
      
      return data;
      
    } catch (error) {
      console.error('Error fetching stocks:', error);
      throw new Error('Unable to load stocks. Please check your connection.');
    }
  }


  async getStockPrices(ticker: string, minutes: number = 30): Promise<StockPrice[]> {
    console.log(`🔄 Fetching prices for ${ticker} (last ${minutes} minutes)...`);
    
    try {
   
      const url = `${this.baseUrl}/stocks/${ticker}?minutes=${minutes}`;
      console.log('📡 API URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch stock data: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`Successfully fetched data for ${ticker}:`, data);
    
      return data;
      
    } catch (error) {
      console.error(`Error fetching stock prices for ${ticker}:`, error);
      throw new Error(`Unable to load data for ${ticker}. Please try again.`);
    }
  }
  calculateAverage(stockData: StockPrice[]): number {
    if (!stockData || stockData.length === 0) return 0;
    
    const total = stockData.reduce((sum, stock) => sum + stock.price, 0);
    return total / stockData.length;
  }

  calculateStandardDeviation(stockData: StockPrice[]): number {
    if (!stockData || stockData.length === 0) return 0;
    
    const average = this.calculateAverage(stockData);
    const squaredDifferences = stockData.map(stock => 
      Math.pow(stock.price - average, 2)
    );
    const variance = squaredDifferences.reduce((sum, val) => sum + val, 0) / (stockData.length - 1);
    
    return Math.sqrt(variance);
  }
}
export const stockApi = new StockApiService();
export default StockApiService;
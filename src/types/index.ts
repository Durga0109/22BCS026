
export interface StockPrice {
  price: number;
  lastUpdatedAt: string;
}

export interface PriceData {
  x: number;      
  y: number;      
  time: string;   
}

export interface StocksResponse {
  stocks: { [key: string]: string }; 
}
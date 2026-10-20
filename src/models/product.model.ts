export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
}

export const mockProductDatabase: Product[] = [
  { id: 'prod_1', name: 'Ultra Ergonomic Keyboard', price: 149.99, category: 'Hardware' },
  { id: 'prod_2', name: 'Precision Wireless Mouse', price: 79.99, category: 'Hardware' },
  { id: 'prod_3', name: '4K IPS Studio Monitor', price: 499.99, category: 'Displays' }
];

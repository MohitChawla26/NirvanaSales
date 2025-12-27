const API_ENDPOINT = 'http://services.smartifyindia.co.in:8081/query';

interface ApiResponse {
  success?: boolean;
  data?: any;
  error?: string;
}

export interface Product {
  product_id: number;
  category: string;
  item_name: string;
  price: number;
}

export interface Sale {
  sale_id: number;
  product_id: number;
  quantity: number;
  total_amount: number;
  sale_time: string;
}

export interface SaleWithProduct extends Sale {
  item_name?: string;
  category?: string;
}

async function executeQuery(query: string): Promise<any> {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

export async function fetchProducts(): Promise<Product[]> {
  const query = 'SELECT * FROM Products';
  const result = await executeQuery(query);
  return result.data || result || [];
}

export async function recordSale(productId: number, price: number): Promise<boolean> {
  const query = `INSERT INTO Sales (product_id, total_amount, quantity) VALUES (${productId}, ${price}, 1)`;
  try {
    await executeQuery(query);
    return true;
  } catch (error) {
    console.error('Sale recording error:', error);
    return false;
  }
}

export async function getTotalRevenue(): Promise<number> {
  const query = 'SELECT SUM(total_amount) as total FROM Sales';
  const result = await executeQuery(query);
  const data = result.data || result || [];
  return data[0]?.total || 0;
}

export async function getTopSeller(): Promise<{ item_name: string; total_sales: number } | null> {
  const query = `
    SELECT p.item_name, COUNT(s.sale_id) as total_sales
    FROM Sales s
    JOIN Products p ON s.product_id = p.product_id
    GROUP BY s.product_id, p.item_name
    ORDER BY total_sales DESC
    LIMIT 1
  `;
  const result = await executeQuery(query);
  const data = result.data || result || [];
  return data[0] || null;
}

export async function getRecentTransactions(): Promise<SaleWithProduct[]> {
  const query = `
    SELECT s.sale_id, s.product_id, s.quantity, s.total_amount, s.sale_time, p.item_name, p.category
    FROM Sales s
    JOIN Products p ON s.product_id = p.product_id
    ORDER BY s.sale_time DESC
    LIMIT 10
  `;
  const result = await executeQuery(query);
  return result.data || result || [];
}

const API_ENDPOINT = '/api/query';

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

/**
 * Core helper to execute SQL queries via the bridge API.
 * Ensures we always extract the data rows regardless of the bridge's response format.
 */
async function executeQuery(query: string): Promise<any> {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    
    if (!response.ok) throw new Error('Network response was not ok');
    
    const result = await response.json();
    // Handles various response structures (direct array, .data, or .rows)
    return result.data || result.rows || result;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

/**
 * Fetches the complete product list for the menu.
 */
export async function fetchProducts(): Promise<Product[]> {
  const data = await executeQuery('SELECT * FROM Products');
  return Array.isArray(data) ? data : [];
}

/**
 * Records a new sale in the database.
 */
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

/**
 * Deletes a transaction by ID (used for correcting mistakes).
 */
export async function deleteSale(saleId: number): Promise<boolean> {
  const query = `DELETE FROM Sales WHERE sale_id = ${saleId}`;
  try {
    await executeQuery(query);
    return true;
  } catch (error) {
    console.error('Error deleting sale:', error);
    return false;
  }
}

/**
 * Calculates total revenue. Converts string results to numbers to prevent crashes.
 */
export async function getTotalRevenue(): Promise<number> {
  const data = await executeQuery('SELECT SUM(total_amount) as total FROM Sales');
  if (Array.isArray(data) && data[0]) {
    return Number(data[0].total) || 0;
  }
  return 0;
}

/**
 * Identifies the product with the highest number of sales.
 */
export async function getTopSeller(): Promise<{ item_name: string; total_sales: number } | null> {
  const query = `
    SELECT p.item_name, COUNT(s.sale_id) as total_sales
    FROM Sales s
    JOIN Products p ON s.product_id = p.product_id
    GROUP BY s.product_id, p.item_name
    ORDER BY total_sales DESC
    LIMIT 1
  `;
  const data = await executeQuery(query);
  return Array.isArray(data) && data[0] ? data[0] : null;
}

/**
 * Retrieves the 10 most recent transactions with product details.
 */
export async function getRecentTransactions(): Promise<SaleWithProduct[]> {
  const query = `
    SELECT s.sale_id, s.product_id, s.quantity, s.total_amount, s.sale_time, p.item_name, p.category
    FROM Sales s
    JOIN Products p ON s.product_id = p.product_id
    ORDER BY s.sale_time DESC
    LIMIT 10
  `;
  const data = await executeQuery(query);
  return Array.isArray(data) ? data : [];
}
import db from './db';

export interface ProductResult {
  id: number;
  name: string;
  quantity: number;
  unit_price: number;
  purchase_date: string;
  purchase_time: string;
  establishment_name: string;
  establishment_location: string;
  category_name: string;
  subcategory_name: string | null;
}

export interface CategorySpending {
  category_name: string;
  total_spent: number;
}

export const getAllProducts = async (limit?: number, offset: number = 0): Promise<ProductResult[]> => {
  try {
    const limitClause = limit !== undefined ? `LIMIT ${limit} OFFSET ${offset}` : '';
    const result = await db.getAllAsync<ProductResult>(`
      SELECT 
        p.id,
        p.name,
        p.quantity,
        p.unit_price,
        sb.purchase_date,
        sb.purchase_time,
        e.name as establishment_name,
        e.location as establishment_location,
        c.name as category_name,
        sc.name as subcategory_name
      FROM Product p
      JOIN SmartBill sb ON p.bill_id = sb.id
      JOIN Establishment e ON sb.establishment_id = e.id
      JOIN Category c ON p.category_id = c.id
      LEFT JOIN Subcategory sc ON p.subcategory_id = sc.id
      ORDER BY sb.purchase_date DESC, sb.purchase_time DESC
      ${limitClause}
    `);
    
    // Return an empty array if no results
    return result || [];
  } catch (error) {
    console.error('Error fetching all products:', error);
    // Return empty array on error
    return [];
  }
};

export const getCurrentMonthTotalSpent = async (): Promise<number> => {
  try {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = String(now.getMonth() + 1).padStart(2, '0');
    
    const currentMonthYear = `${currentMonth}-${currentYear}`;
    const result = await db.getFirstAsync<{ total: number }>(`
      SELECT COALESCE(SUM(p.quantity * p.unit_price), 0) as total
      FROM Product p
      JOIN SmartBill sb ON p.bill_id = sb.id
      WHERE substr(sb.purchase_date, 4) = ?
    `, [currentMonthYear]);
    
    return result?.total || 0;
  } catch (error) {
    console.error('Error fetching current month total:', error);

    return 0;
  }
};

export const getCurrentMonthCategorySpending = async (): Promise<CategorySpending[]> => {
  try {
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString().split('T')[0];

    const result = await db.getAllAsync<CategorySpending>(`
      SELECT 
        c.name as category_name,
        COALESCE(SUM(p.quantity * p.unit_price), 0) as total_spent
      FROM Category c
      LEFT JOIN Product p ON p.category_id = c.id
      LEFT JOIN SmartBill sb ON p.bill_id = sb.id AND 
                             strftime('%Y-%m', sb.purchase_date) = strftime('%Y-%m', ?)
      GROUP BY c.id, c.name
      HAVING total_spent > 0
      ORDER BY total_spent DESC
    `, [firstDayOfMonth]);
    
    return result;
  } catch (error) {
    console.error('Error fetching category spending:', error);
    throw error;
  }
};
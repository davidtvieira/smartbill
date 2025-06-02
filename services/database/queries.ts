import db from './db';

export interface Product {
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

export interface Category {
  id: number;
  name: string;
}

export interface CategoryWithSpending extends Category {
  total_spent: number;
  item_count: number;
}

export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const result = await db.getAllAsync<Product>(`
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
    `);
    
    return result || [];
  } catch (error) {
    console.error('Error fetching all products:', error);

    return [];
  }
};

export const getAllCategories = async (): Promise<CategoryWithSpending[]> => {
  try {
    const result = await db.getAllAsync<CategoryWithSpending>(`
      SELECT 
        c.id,
        c.name,
        SUM(p.quantity * p.unit_price) as total_spent,
        COUNT(DISTINCT p.id) as item_count
      FROM Category c
      LEFT JOIN Product p ON c.id = p.category_id
      GROUP BY c.id, c.name
      ORDER BY total_spent DESC, c.name ASC
    `);
    
    return result || [];
  } catch (error) {
    console.error('Error fetching categories with spending:', error);
    return [];
  }
};

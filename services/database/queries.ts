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
  total_spent: number;
  item_count: number;
  subcategory_count: number;
}

export interface Subcategory {
  id: number;
  name: string;
  category_id: number;
  total_spent: number;
}

export interface Establishment {
  id: number;
  name: string;
  location: string;
  total_spent: number;
  bill_count: number;
  last_visit: string;
}

export interface SmartBill {
  id: number;
  purchase_date: string;
  purchase_time: string;
  establishment_name: string;
  establishment_location: string;
  amount: number;
  item_count: number;
}

export interface Category {
  id: number;
  name: string;
  total_spent: number;
  subcategory_count: number;
  parent_id: number | null;
}

export const getWeeklyCategories = async (): Promise<Category[]> => {
  try {
    const result = await db.getAllAsync<Category>(`
      SELECT 
        c.id,
        c.name,
        COALESCE(SUM(p.quantity * p.unit_price), 0) as total_spent,
        COUNT(DISTINCT p.id) as item_count,
        (SELECT COUNT(*) FROM Subcategory s WHERE s.category_id = c.id) as subcategory_count
      FROM Product p
      JOIN Category c ON p.category_id = c.id
      JOIN SmartBill sb ON p.bill_id = sb.id
      WHERE DATE(sb.purchase_date) >= DATE('now', '-7 days')
      GROUP BY c.id, c.name
      ORDER BY total_spent DESC, c.name ASC
    `);
    
    return result || [];
  } catch (error) {
    console.error('Error fetching weekly categories:', error);
    return [];
  }
};

export const getThisMonthProducts = async (): Promise<Product[]> => {
  try {
    const result = await db.getAllAsync<Product>(`
      SELECT 
        p.id,
        p.name,
        SUM(p.quantity) as quantity,
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
      WHERE sb.purchase_date >= DATE('now', 'start of month')
      GROUP BY p.id, p.name, p.unit_price, sb.purchase_date, sb.purchase_time, 
               e.name, e.location, c.name, sc.name
      ORDER BY sb.purchase_date DESC, sb.purchase_time DESC
    `);
    
    return result || [];
  } catch (error) {
    console.error('Error fetching monthly products:', error);
    return [];
  }
};

export const getThisMonthCategories = async (options: { categoryId?: number } = {}): Promise<Category[]> => {
  try {
    const { categoryId } = options;
    
    const query = `
      SELECT 
        c.id,
        c.name,
        COALESCE(SUM(p.quantity * p.unit_price), 0) as total_spent,
        COUNT(DISTINCT p.id) as item_count,
        (SELECT COUNT(*) FROM Subcategory s WHERE s.category_id = c.id) as subcategory_count
      FROM Category c
      LEFT JOIN Product p ON p.category_id = c.id
      LEFT JOIN SmartBill sb ON p.bill_id = sb.id
      WHERE sb.purchase_date >= DATE('now', 'start of month')
      ${categoryId ? `AND c.id = ${categoryId}` : ''}
      GROUP BY c.id, c.name
      ORDER BY total_spent DESC, c.name ASC
    `;

    const result = await db.getAllAsync<Category>(query);
    return result || [];
  } catch (error) {
    console.error('Error fetching monthly categories:', error);
    return [];
  }
};

export const getThisMonthEstablishments = async (): Promise<Establishment[]> => {
  try {
    const result = await db.getAllAsync<Establishment>(`
      SELECT 
        e.id,
        e.name,
        e.location,
        COALESCE(SUM(p.quantity * p.unit_price), 0) as total_spent,
        COUNT(DISTINCT sb.id) as bill_count,
        MAX(sb.purchase_date || ' ' || sb.purchase_time) as last_visit
      FROM Establishment e
      LEFT JOIN SmartBill sb ON e.id = sb.establishment_id
      LEFT JOIN Product p ON sb.id = p.bill_id
      WHERE sb.purchase_date >= DATE('now', 'start of month')
      GROUP BY e.id, e.name, e.location
      ORDER BY total_spent DESC, e.name ASC
    `);
    
    return result || [];
  } catch (error) {
    console.error('Error fetching monthly establishments:', error);
    return [];
  }
};

export const getThisMonthSmartBills = async (): Promise<SmartBill[]> => {
  try {
    const result = await db.getAllAsync<SmartBill>(`
      SELECT 
        sb.id,
        sb.purchase_date,
        sb.purchase_time,
        e.name as establishment_name,
        e.location as establishment_location,
        COALESCE(SUM(p.quantity * p.unit_price), 0) as amount,
        COUNT(DISTINCT p.id) as item_count
      FROM SmartBill sb
      JOIN Establishment e ON sb.establishment_id = e.id
      LEFT JOIN Product p ON sb.id = p.bill_id
      WHERE sb.purchase_date >= DATE('now', 'start of month')
      GROUP BY sb.id, sb.purchase_date, sb.purchase_time, e.name, e.location
      ORDER BY sb.purchase_date DESC, sb.purchase_time DESC
    `);
    
    return result || [];
  } catch (error) {
    console.error('Error fetching monthly smartbills:', error);
    return [];
  }
};

export const getThisMonthSmartBillsByEstablishment = async (establishmentId: number): Promise<SmartBill[]> => {
  try {
    const result = await db.getAllAsync<SmartBill>(`
      SELECT 
        sb.id,
        sb.purchase_date,
        sb.purchase_time,
        e.name as establishment_name,
        e.location as establishment_location,
        COALESCE(SUM(p.quantity * p.unit_price), 0) as amount,
        COUNT(DISTINCT p.id) as item_count
      FROM SmartBill sb
      JOIN Establishment e ON sb.establishment_id = e.id
      LEFT JOIN Product p ON sb.id = p.bill_id
      WHERE sb.purchase_date >= DATE('now', 'start of month') AND e.id = ?
      GROUP BY sb.id, sb.purchase_date, sb.purchase_time, e.name, e.location
      ORDER BY sb.purchase_date DESC, sb.purchase_time DESC
    `, [establishmentId]);
    
    return result || [];
  } catch (error) {
    console.error('Error fetching last month smartbills:', error);
    return [];
  }
};

export const getProductsBySmartBill = async (smartBillId: number): Promise<Product[]> => {
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
      WHERE p.bill_id = ?
      ORDER BY p.name ASC
    `, [smartBillId]);
    
    return result || [];
  } catch (error) {
    console.error('Error fetching products for smartbill:', error);
    return [];
  }
};

export const getThisMonthSubcategories = async (categoryId: number): Promise<Subcategory[]> => {
  try {
    const result = await db.getAllAsync<Subcategory>(`
      SELECT 
        s.id,
        s.name,
        s.category_id,
        COALESCE(SUM(p.quantity * p.unit_price), 0) as total_spent,
        COUNT(DISTINCT p.id) as item_count
      FROM Subcategory s
      LEFT JOIN Product p ON p.subcategory_id = s.id
      LEFT JOIN SmartBill sb ON p.bill_id = sb.id
      WHERE s.category_id = ? 
        AND sb.purchase_date >= DATE('now', 'start of month')
      GROUP BY s.id, s.name, s.category_id
      ORDER BY total_spent DESC, s.name ASC
    `, [categoryId]);
    
    return result || [];
  } catch (error) {
    console.error('Error fetching monthly subcategories:', error);
    return [];
  }
};

export const getThisMonthProductsBySubcategory = async (subcategoryId: number): Promise<Product[]> => {
  try {
    const result = await db.getAllAsync<Product>(`
      SELECT 
        p.*,
        sb.purchase_date,
        e.name as establishment_name,
        c.name as category_name
      FROM Product p
      JOIN SmartBill sb ON p.bill_id = sb.id
      JOIN Establishment e ON sb.establishment_id = e.id
      JOIN Category c ON p.category_id = c.id
      WHERE p.subcategory_id = ?
        AND sb.purchase_date >= DATE('now', 'start of month')
      ORDER BY sb.purchase_date DESC, p.name ASC
    `, [subcategoryId]);
    
    return result || [];
  } catch (error) {
    console.error('Error fetching products for subcategory:', error);
    return [];
  }
};
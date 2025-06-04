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
  subcategory_count: number;
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
  total_amount: number;
  item_count: number;
}

export interface SubcategoryWithSpending {
  id: number;
  name: string;
  category_id: number;
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
        COALESCE(SUM(p.quantity * p.unit_price), 0) as total_spent,
        COUNT(DISTINCT p.id) as item_count,
        (SELECT COUNT(*) FROM Subcategory s WHERE s.category_id = c.id) as subcategory_count
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

export const getSubcategoriesByCategory = async (categoryId: number): Promise<SubcategoryWithSpending[]> => {
  try {
    const result = await db.getAllAsync<SubcategoryWithSpending>(
      `
      SELECT 
        s.id,
        s.name,
        s.category_id,
        COALESCE(SUM(p.quantity * p.unit_price), 0) as total_spent,
        COUNT(DISTINCT p.id) as item_count
      FROM Subcategory s
      LEFT JOIN Product p ON s.id = p.subcategory_id
      WHERE s.category_id = ?
      GROUP BY s.id, s.name, s.category_id
      ORDER BY total_spent DESC, s.name ASC
      `,
      [categoryId]
    );
    
    return result || [];
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    return [];
  }
};

export const getAllEstablishments = async (): Promise<Establishment[]> => {
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
      GROUP BY e.id, e.name, e.location
      ORDER BY last_visit DESC, e.name ASC
    `);
    
    return result || [];
  } catch (error) {
    console.error('Error fetching establishments:', error);
    return [];
  }
};

export const getAllSmartBills = async (): Promise<SmartBill[]> => {
  try {
    const result = await db.getAllAsync<SmartBill>(`
      SELECT 
        sb.id,
        sb.purchase_date,
        sb.purchase_time,
        e.name as establishment_name,
        e.location as establishment_location,
        COALESCE(SUM(p.quantity * p.unit_price), 0) as total_amount,
        COUNT(DISTINCT p.id) as item_count
      FROM SmartBill sb
      JOIN Establishment e ON sb.establishment_id = e.id
      LEFT JOIN Product p ON sb.id = p.bill_id
      GROUP BY sb.id, sb.purchase_date, sb.purchase_time, e.name, e.location
      ORDER BY sb.purchase_date DESC, sb.purchase_time DESC
    `);
    
    return result || [];
  } catch (error) {
    console.error('Error fetching smart bills:', error);
    return [];
  }
};

export const getProductsBySubcategory = async (subcategoryId: number): Promise<Product[]> => {
  try {
    const result = await db.getAllAsync<Product>(
      `
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
      JOIN Subcategory sc ON p.subcategory_id = sc.id
      WHERE p.subcategory_id = ?
      ORDER BY sb.purchase_date DESC, sb.purchase_time DESC
      `,
      [subcategoryId]
    );
    
    return result || [];
  } catch (error) {
    console.error('Error fetching products by subcategory:', error);
    return [];
  }
};

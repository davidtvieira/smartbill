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

export const getProducts = async (startDate: string, endDate: string): Promise<Product[]> => {
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
      WHERE sb.purchase_date BETWEEN ? AND ?
      GROUP BY p.id, p.name, p.unit_price, sb.purchase_date, sb.purchase_time, 
               e.name, e.location, c.name, sc.name
      ORDER BY sb.purchase_date DESC, sb.purchase_time DESC
    `, [startDate, endDate]);
    
    return result || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export const getCategories = async (startDate: string, endDate: string): Promise<Category[]> => {
  try {
    const result = await db.getAllAsync<Category>(`
      SELECT 
        c.id,
        c.name,
        COALESCE(SUM(p.quantity * p.unit_price), 0) as total_spent,
        COUNT(DISTINCT p.id) as item_count,
        (SELECT COUNT(*) FROM Subcategory s WHERE s.category_id = c.id) as subcategory_count
      FROM Category c
      LEFT JOIN Product p ON p.category_id = c.id
      LEFT JOIN SmartBill sb ON p.bill_id = sb.id
      WHERE sb.purchase_date BETWEEN ? AND ?
      GROUP BY c.id, c.name
      ORDER BY total_spent DESC, c.name ASC
    `, [startDate, endDate]);
    
    return result || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

export const getSubcategories = async (categoryId: number, startDate: string, endDate: string): Promise<Subcategory[]> => {
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
        AND sb.purchase_date BETWEEN ? AND ?
      GROUP BY s.id, s.name, s.category_id
      ORDER BY total_spent DESC, s.name ASC
    `, [categoryId, startDate, endDate]);
    
    return result || [];
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    return [];
  }
};

export const getEstablishments = async (startDate: string, endDate: string): Promise<Establishment[]> => {
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
      WHERE sb.purchase_date BETWEEN ? AND ?
      GROUP BY e.id, e.name, e.location
      ORDER BY total_spent DESC, e.name ASC
    `, [startDate, endDate]);
    
    return result || [];
  } catch (error) {
    console.error('Error fetching establishments:', error);
    return [];
  }
};

export const getSmartBills = async (startDate: string, endDate: string): Promise<SmartBill[]> => {
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
      WHERE sb.purchase_date BETWEEN ? AND ?
      GROUP BY sb.id, sb.purchase_date, sb.purchase_time, e.name, e.location
      ORDER BY sb.purchase_date DESC, sb.purchase_time DESC
    `, [startDate, endDate]);
    
    return result || [];
  } catch (error) {
    console.error('Error fetching smartbills:', error);
    return [];
  }
};

export const getSmartBillsByEstablishment = async (
  establishmentId: number, 
  startDate: string, 
  endDate: string
): Promise<SmartBill[]> => {
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
      WHERE e.id = ? AND sb.purchase_date BETWEEN ? AND ?
      GROUP BY sb.id, sb.purchase_date, sb.purchase_time, e.name, e.location
      ORDER BY sb.purchase_date DESC, sb.purchase_time DESC
    `, [establishmentId, startDate, endDate]);
    
    return result || [];
  } catch (error) {
    console.error('Error fetching smartbills by establishment:', error);
    return [];
  }
};

export const getProductsBySubcategory = async (
  subcategoryId: number, 
  startDate: string, 
  endDate: string
): Promise<Product[]> => {
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
        AND sb.purchase_date BETWEEN ? AND ?
      ORDER BY sb.purchase_date DESC, p.name ASC
    `, [subcategoryId, startDate, endDate]);
    
    return result || [];
  } catch (error) {
    console.error('Error fetching products by subcategory:', error);
    return [];
  }
};

export const getThisWeekCategories = async (): Promise<Category[]> => {
  try {
    const today = new Date();
    const dayOfWeek = today.getDay();
    
    const monday = new Date(today);
    monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

    const formatDate = (date: Date) => date.toISOString().split('T')[0];
    
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
      WHERE date(sb.purchase_date) BETWEEN date(?) AND date(?)
      GROUP BY c.id, c.name
      ORDER BY total_spent DESC, c.name ASC
    `, [formatDate(monday), formatDate(today)]);
    
    return result || [];
  } catch (error) {
    console.error('Error fetching weekly categories:', error);
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


export const deleteSmartBill = async (smartBillId: number): Promise<boolean> => {
  try {
    await db.runAsync('BEGIN TRANSACTION');

    // First, verify the smartbill exists
    const smartBill = await db.getAllAsync<{id: number, establishment_id: number}>(
      'SELECT id, establishment_id FROM SmartBill WHERE id = ?',
      [smartBillId]
    );

    if (!smartBill) {
      await db.runAsync('ROLLBACK');
      console.log('SmartBill not found:', smartBillId);
      return false;
    }

    // Delete the smartbill (this will cascade to products due to foreign key)
    await db.runAsync('DELETE FROM SmartBill WHERE id = ?', [smartBillId]);

    // Check if the establishment has any other smartbills
    const establishmentCount = await db.getAllAsync<{count: number}>(
      'SELECT COUNT(*) as count FROM SmartBill WHERE establishment_id = ?',
      [smartBill[0].establishment_id]
    );

    // If no more smartbills for this establishment, delete it
    if (establishmentCount && establishmentCount[0].count === 0) {
      await db.runAsync('DELETE FROM Establishment WHERE id = ?', [smartBill[0].establishment_id]);
    }

    // Clean up orphaned categories and subcategories
    await db.runAsync(`
      DELETE FROM Category 
      WHERE id NOT IN (SELECT DISTINCT category_id FROM Product)
    `);

    await db.runAsync(`
      DELETE FROM Subcategory 
      WHERE id NOT IN (SELECT DISTINCT subcategory_id FROM Product WHERE subcategory_id IS NOT NULL)
    `);

    await db.runAsync('COMMIT');
    return true;
  } catch (error) {
    console.error('Error deleting smartbill:', error);
    await db.runAsync('ROLLBACK');
    return false;
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
        COALESCE(SUM(p.quantity * p.unit_price), 0) as amount,
        COUNT(DISTINCT p.id) as item_count
      FROM SmartBill sb
      JOIN Establishment e ON sb.establishment_id = e.id
      LEFT JOIN Product p ON sb.id = p.bill_id
      GROUP BY sb.id, sb.purchase_date, sb.purchase_time, e.name, e.location
      ORDER BY sb.purchase_date DESC, sb.purchase_time DESC
    `);
    
    return result || [];
  } catch (error) {
    console.error('Error fetching smartbills:', error);
    return [];
  }
};
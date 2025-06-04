import db from './db';

type ExtractedItem = {
  name: string;
  quantity: number;
  unit_price: number;
  category: string;
  sub_category: string;
};

type ExtractedSmartBill = {
  local: string;
  establishment: string;
  date: string;
  time: string;
  items: ExtractedItem[];
};

const getOrCreateEstablishment = async (name: string, location: string) => {
  const result = await db.getFirstAsync<{ id: number }>(
    `SELECT id FROM Establishment WHERE name = ?`,
    [name]
  );

  if (result) return result.id;

  const insert = await db.runAsync(
    `INSERT INTO Establishment (name, location) VALUES (?, ?)`,
    [name, location]
  );

  return insert.lastInsertRowId;
};

const getOrCreateCategory = async (name: string) => {
  const result = await db.getFirstAsync<{ id: number }>(
    `SELECT id FROM Category WHERE name = ?`,
    [name]
  );

  if (result) return result.id;

  const insert = await db.runAsync(
    `INSERT INTO Category (name) VALUES (?)`,
    [name]
  );

  return insert.lastInsertRowId;
};

const getOrCreateSubcategory = async (name: string, categoryId: number) => {
  const result = await db.getFirstAsync<{ id: number }>(
    `SELECT id FROM Subcategory WHERE name = ? AND category_id = ?`,
    [name, categoryId]
  );

  if (result) return result.id;

  const insert = await db.runAsync(
    `INSERT INTO Subcategory (name, category_id) VALUES (?, ?)`,
    [name, categoryId]
  );

  return insert.lastInsertRowId;
};

export const insertSmartBill = async (data: ExtractedSmartBill) => {
  try {
    await db.runAsync('BEGIN TRANSACTION');

    const establishmentId = await getOrCreateEstablishment(
      data.establishment,
      data.local
    );

    // Convert date to ISO format (YYYY-MM-DD)
    const [day, month] = data.date.split('-');
    const currentYear = new Date().getFullYear();
    const isoDate = `${currentYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

    const billInsert = await db.runAsync(
      `INSERT INTO SmartBill (purchase_date, purchase_time, establishment_id)
       VALUES (?, ?, ?)`,
      [isoDate, data.time, establishmentId]
    );

    const billId = billInsert.lastInsertRowId;

    for (const item of data.items) {
      const categoryId = await getOrCreateCategory(item.category);
      const subcategoryId = await getOrCreateSubcategory(item.sub_category, categoryId);

      await db.runAsync(
        `INSERT INTO Product (name, quantity, unit_price, bill_id, category_id, subcategory_id)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          item.name,
          item.quantity,
          item.unit_price,
          billId,
          categoryId,
          subcategoryId,
        ]
      );
    }
    await db.runAsync('COMMIT');
  } catch (error) {
    await db.runAsync('ROLLBACK');
    console.error('Error inserting SmartBill:', error);
  }
};

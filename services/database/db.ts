import { openDatabaseSync } from 'expo-sqlite';

const db = openDatabaseSync('smartbill.db');

export const initDB = async () => {
  try {
    await db.execAsync(`
      PRAGMA foreign_keys = ON;

      CREATE TABLE IF NOT EXISTS Establishment (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        location TEXT
      );

      CREATE TABLE IF NOT EXISTS SmartBill (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        purchase_date TEXT NOT NULL,
        purchase_time TEXT,
        establishment_id INTEGER NOT NULL,
        FOREIGN KEY (establishment_id) REFERENCES Establishment(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS Category (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS Subcategory (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category_id INTEGER NOT NULL,
        FOREIGN KEY (category_id) REFERENCES Category(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS Product (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        quantity REAL NOT NULL,
        unit_price REAL NOT NULL,
        bill_id INTEGER NOT NULL,
        category_id INTEGER NOT NULL,
        subcategory_id INTEGER,
        FOREIGN KEY (bill_id) REFERENCES SmartBill(id) ON DELETE CASCADE,
        FOREIGN KEY (category_id) REFERENCES Category(id),
        FOREIGN KEY (subcategory_id) REFERENCES Subcategory(id)
      );
    `);

    console.log("Database started");
  } catch (error) {
    console.error("Error starting the database:", error);
  }
};

export default db;

// Importa il modulo SQLite
import * as SQLite from 'expo-sqlite';

class ObjectModel {
  constructor() {
    // Apre o crea un database SQLite chiamato 'mydb'
    this.db = SQLite.openDatabase('mydb');
    this.initializeDatabase();
  }

  // Inizializza il database e crea la tabella dei mostri
  async initializeDatabase() {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS objects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT,
        level INTEGER,
        image TEXT DEFAULT NULL,
        name TEXT
      );
    `;

    await this.db.execAsync([{ sql: createTableQuery, args: [] }], false);
  }

  // Inserisce un mostro nel database
  async insertObject(objectData) {
    const {
      id,
      type,
      level,
      image,
      name
    } = objectData;

    const insertObjectQuery = `
      INSERT INTO objects (id,type, level, image, name) VALUES (?,?, ?, ?, ?);
    `;

    try {
      await this.db.execAsync([
        {
          sql: insertObjectQuery,
          args: [id,type, level, image, name]
        }
      ], false);

      console.log('Object inserted successfully.');

    } catch (error) {
      console.error('Error during object insertion:', error);
    }
  }

  // Ottiene tutti i mostri presenti nel database
  async getAllobjects() {
    const selectObjectsQuery = `
      SELECT * FROM objects;
    `;

    try {
      const result = await this.db.execAsync([{ sql: selectObjectsQuery, args: [] }], true);

      console.log('Objects in the database:', result[0].rows);
      return result[0].rows;
    } catch (error) {
      console.error('Error during object retrieval from the database:', error);
      throw error;
    }
  }

  async getObjectDetailsFromDatabase(id) {
    const selectUserQuery = `
      SELECT * FROM objects WHERE id = ?;
    `;
    try {
      const result = await this.db.execAsync([{ sql: selectUserQuery, args: [id] }], true);

      if (result[0].rows.length > 0) {
        return result[0].rows[0];
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error during user details retrieval from the database:', error);
      throw error;
    }
  }

  async getArmorLevel(id) {
    const selectUserQuery = `
      SELECT level FROM objects WHERE id = ?;
    `;
    try {
      const result = await this.db.execAsync([{ sql: selectUserQuery, args: [id] }], true);

      if (result[0].rows.length > 0) {
        return result[0].rows[0];
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error during user details retrieval from the database:', error);
      throw error;
    }
  }
  
}

export default ObjectModel;

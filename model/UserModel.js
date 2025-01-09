import * as SQLite from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';

class UserModel {
  constructor() {
    this.db = SQLite.openDatabase('mydb');
    this.initializeDatabase();
  }

  async initializeDatabase() {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        uid INTEGER PRIMARY KEY ,
        name TEXT,
        picture TEXT DEFAULT NULL,
        life INTEGER DEFAULT 100,
        experience INTEGER DEFAULT 0,
        weapon INTEGER DEFAULT NULL,
        armor INTEGER DEFAULT NULL,
        amulet INTEGER DEFAULT NULL,
        profile_version INTEGER DEFAULT 0,
        share_location BOOLEAN DEFAULT 0,
        lat  REAL DEFAULT NULL,
        lon REAL DEFAULT NULL
      );
    `;

    const insertDataQuery = `
      INSERT INTO users (name) VALUES (?);
    `;

    await this.db.execAsync([{ sql: createTableQuery, args: [] }], false);
  }

  async showData() {
    const selectDataQuery = `
      SELECT  uid, name, life, experience, weapon, armor, amulet, profile_version, share_location, lat, lon
      FROM users;
    `;
  
    const result = await this.db.execAsync([{ sql: selectDataQuery, args: [] }], true);
  
    console.log('Data in the database:', result[0].rows);
  }
  

  async insertMyUser(name, uid) {
    const insertUserQuery = `
      INSERT INTO users (uid, name) VALUES (?, ?);
    `;
  
    try {
      await this.db.execAsync([
        { sql: insertUserQuery, args: [uid, name] } // Invertito l'ordine degli argomenti
      ], false);
  
      console.log('Basic user inserted successfully.');
    } catch (error) {
      console.error('Error during user insertion:', error);
    }
  }

  async getCoordinates(uid) {
    const selectUserQuery = `
      SELECT lat, lon FROM users WHERE uid = ?;
    `;
  
    try {
      const result = await this.db.execAsync([{ sql: selectUserQuery, args: [uid] }], true);
  
      if (result && result[0].rows) {
        if (result[0].rows.length > 0) {
          return result[0].rows[0];
        } else {
          return null;
        }
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error during coordinates retrieval from the database:', error);
      throw error;
    }
  }

  async dropTable() {
    const dropTableQuery = 'DROP TABLE IF EXISTS users';

    try {
      await this.db.execAsync([{ sql: dropTableQuery, args: [] }], false);
      console.log('Table deleted successfully.');
    } catch (error) {
      console.error('Error during table deletion:', error);
    }
  }

  async insertCoordinates(uid, latitude, longitude) {
    const insertCoordinatesQuery = `
      UPDATE users
      SET lat = ?, lon = ?
      WHERE uid = ?;
    `;

    try {
      await this.db.execAsync([
        { sql: insertCoordinatesQuery, args: [latitude, longitude, uid] }
      ], false);
    } catch (error) {
      console.error('Error during coordinates insertion:', error);
    }
  }

  async insertUser(userData) {
    const {
      uid,
      name,
      life,
      experience,
      weapon,
      armor,
      amulet,
      picture,
      profileversion,
      positionshare
    } = userData;

    const insertUserQuery = `
      INSERT INTO users (
        uid,
        name,
        life,
        experience,
        weapon,
        armor,
        amulet,
        picture,
        profile_version,
        share_location
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;

    try {
      await this.db.execAsync([
        {
          sql: insertUserQuery,
          args: [
            uid,
            name,
            life,
            experience,
            weapon,
            armor,
            amulet,
            picture,
            profileversion,
            positionshare ? 1 : 0
          ]
        }
      ], false);

      console.log('User inserted successfully.');
    } catch (error) {
      console.error('Error during user insertion:', error);
    }
  }

  async getUserDetailsFromDatabase(uid) {
    const selectUserQuery = `
      SELECT * FROM users WHERE uid = ?;
    `;

    try {
      const result = await this.db.execAsync([{ sql: selectUserQuery, args: [uid] }], true);

      if (result && result[0].rows) {
        if (result[0].rows.length > 0) {
          return result[0].rows[0];
        } else {
          return null;
        }
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error during user details retrieval from the database:', error);
      throw error;
    }
  }

  async updateUserDetailsInDatabase(updatedUserData) {
    const updateQuery = `
      UPDATE users
      SET
        name = ?,
        life = ?,
        experience = ?,
        weapon = ?,
        armor = ?,
        amulet = ?,
        picture = ?,
        profile_version = ?,
        share_location = ?,
        lat = ?,
        lon = ?
      WHERE uid = ?;
    `;
  
    const {
      name,
      picture,
      life,
      experience,
      weapon,
      armor,
      amulet,
      profileversion,
      share_location,
      lat,
      lon,
      uid
    } = updatedUserData;
  
    try {
      await this.db.execAsync([
        {
          sql: updateQuery,
          args: [
            name,
            life,
            experience,
            weapon,
            armor,
            amulet,
            picture,
            profileversion,
            share_location ? 1 : 0,
            lat,
            lon,
            uid
          ]
        }
      ], false);
  
      console.log('User details updated successfully.');
    } catch (error) {
      console.error('Error during user details update in the database:', error);
      throw error;
    }
  }
  

  async updateUserProfile(picture,name,share_location,uid){
    console.log(share_location);
    const updateQuery = `
    UPDATE users
    SET
      name = ?,
      picture= ?,
      share_location = ?
    WHERE uid = ?;
  `;

  try {
    await this.db.execAsync([
      {
        sql: updateQuery,
        args: [
          name,
          picture,
          share_location ? 1 : 0, // Converti il valore booleano in un numero 0 o 1
          uid
        ]
      }
    ], false);

    console.log('User details updated successfully updating profile.');
  } catch (error) {
    console.error('Error during user details update in the database:', error);
    throw error;
  }
  }

  async updateUserAfterObject(updatedUserData) {
    const updateQuery = `
      UPDATE users
      SET
        life = ?,
        experience= ?,
        weapon = ?,
        armor = ?,
        amulet = ?
      WHERE uid = ?;
    `;

    const {
      response: { died, amulet, armor, experience, life, weapon },
      uid
    } = updatedUserData;

    try {
      await this.db.execAsync([
        {
          sql: updateQuery,
          args: [
            life,
            experience,
            weapon,
            armor,
            amulet,
            uid
          ]
        }
      ], false);

      console.log('User details updated successfully affìter object.');
    } catch (error) {
      console.error('Error during user details update in the database:', error);
      throw error;
    }
  }

  async getUserAmuletDetails(uid) {

    const selectUserQuery = `
      SELECT amulet FROM users WHERE uid = ?;
    `;

    try {
      const result = await this.db.execAsync([{ sql: selectUserQuery, args: [uid] }], true);

      if (result && result[0].rows) {
        if (result[0].rows.length > 0) {
          return result[0].rows[0];
        } else {
          return null;
        }
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error during user details retrieval from the database:', error);
      throw error;
    }
  }

  async getPicture(uid) {

    const selectUserQuery = `
      SELECT picture FROM users WHERE uid = ?;
    `;

    try {
      const result = await this.db.execAsync([{ sql: selectUserQuery, args: [uid] }], true);

      if (result && result[0].rows) {
        if (result[0].rows.length > 0) {
          return result[0].rows[0];
        } else {
          return null;
        }
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error during user details retrieval from the database:', error);
      throw error;
    }
  }
}

export default UserModel;

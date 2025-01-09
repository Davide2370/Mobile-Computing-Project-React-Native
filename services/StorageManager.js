export default class StorageManager {

    constructor() {
    this.db = SQLite.openDatabase("myDB")
    }
    async getGreetings() {
    const querySQL = "SELECT * FROM SALUTI";
    const query = { args: [], sql: querySQL }
    const result = await this.db.execAsync([query], true)
    return result[0].rows
    }
   } 
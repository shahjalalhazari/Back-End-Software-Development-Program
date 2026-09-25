import { Database } from "./Database";

class UserService {
    private db: Database;

    constructor(db: Database) {
        this.db = db;
    }

    getUsers() {
        this.db.connect();
        return this.db.query("SELECT * FROM Users")
    }
}


export default UserService;
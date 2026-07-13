import Database from "./Database";

class UserService {
    private db: Database;

    constructor() {
        this.db = new Database();
    }
}


export default UserService;
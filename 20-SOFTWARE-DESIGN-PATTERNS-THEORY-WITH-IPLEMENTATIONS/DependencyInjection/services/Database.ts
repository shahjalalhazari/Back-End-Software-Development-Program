interface Database {
    connect(): void;
    query(sql: string): any;
}

// CONNECTION FOR POSTGRESQL
class PostgresDatabase implements Database{
    connect() {
        console.log("Connected to Postgres");
    }

    query(sql: string) {
        console.log("Postgres query:", sql);
    }
};

// CONNECTION FOR MONGODB
class MongoDatabase implements Database {
    connect() {
        console.log("Connected to MongoDB");
    }

    query(sql: string) {
        console.log("MongoDB query:", sql);
    }
}


// FAKE DATABASE CONNECTOR
class FakeDatabase implements Database{
    connect(): void {
        console.log("[FAKE-DB] Pretending to connect...");
    }

    query(sql: string) {
        console.log("[FAKE-DB] query:", sql);
        // RETURN FAKE USER DATA
        return [
            {id: 1, name: "Shahjalal Hazari"},
            {id: 2, name: "Emon Hazari"},
            {id: 3, name: "Rubayet Islam"}
        ]
    }
}

export {Database, PostgresDatabase, MongoDatabase, FakeDatabase};
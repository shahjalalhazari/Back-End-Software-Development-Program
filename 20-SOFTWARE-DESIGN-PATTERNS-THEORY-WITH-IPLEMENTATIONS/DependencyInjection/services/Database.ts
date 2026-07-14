interface Database {
    connect(): void;
    query(sql: string): any;
}


class PostgresDatabase implements Database{
    connect() {
        console.log("Connected to Postgres");
    }

    query(sql: string) {
        console.log("Postgres query:", sql);
    }
};


class MongoDatabase implements Database {
    connect() {
        console.log("Connected to MongoDB");
    }

    query(sql: string) {
        console.log("MongoDB query:", sql);
    }
}

export {Database, PostgresDatabase, MongoDatabase};
import {Pool, PoolClient} from 'pg';


// POSTGRESQL CONNECTION CONFIG
const pool = new Pool({
    user: process.env.DB_USER || "postgres",
    host: process.env.DB_HOST || "localhost",
    database: process.env.DB_NAME || "UniversityDB",
    password: process.env.DB_PASSWORD || "",
    port: parseInt(process.env.DB_PORT || "5432"),
});


// FUNCTION TO CONNECT TO POSTGRESQL
export async function connectToPostgres(): Promise<void> {
    try {
        const client: PoolClient = await pool.connect();
        console.log("Successfully connected to PostgreSQL database");
        client.release();        
    } catch (error) {
        console.log("Error connecting to PostgreSQL:", error);
        throw error;
    }    
}


// FUNCTION TO TEST DATABSE CONNECTION
export async function testDatabaseConnection(): Promise<void> {
    try {
        const client = await pool.connect();
        const result = await client.query("SLECT NOW()");
        console.log("Database query test successful:", result.rows[0]);
        client.release();
    } catch (error) {
        console.log("Database query test failed:", error);
        throw error;
    }
}


// FUNCTION TO GET DATABASE POOL
export function getPool(): Pool{
    return pool;
}


// FUNCTION TO EXECUTE QUERIES
export async function executeQuery(query:string, params?: any[]): Promise<any> {
    try {
        const client = await pool.connect();
        const result = await client.query(query, params);
        client.release();
        return result;
    } catch (error) {
        console.log("Query execution failed:", error);
        throw error;
    }
}
import express, {Request, Response} from "express";
import cors from "cors";
import { env } from "./config/env";
import { connectToPostgres, testDatabaseConnection } from "./utils/database";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HOME ROUTE
app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Welcome to the Student App API",
    timestamp: new Date().toISOString(),
    status: "success",
  });
});


// ADD NEW STURENT POST ROUTE
app.post("/api/students", (req: Request, res: Response) => {
    try {
        const {name, email, description} = req.body ;
        
        if (!name || !email || !description) {
            return res.status(400).json({
                message: "Name, email, and description are required",
                status: "error",
            });
        }

        const processedDate = {
            id: Date.now(),
            name,
            email,
            description,
            createdAt: new Date().toISOString(),
        }

        // SEND RES AFTER SUCCESS.
        res.status(201).json({
            message: "Student added successfully",
            status: "success",
            data: processedDate
        });
        console.log(processedDate);
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            status: "error",
        });
    }
});



app.listen(env.port, async () => {
  console.log(`🚀 Server running on http://localhost:${env.port}`);

    // CONNECT TO POSTGRESQL WHEN SERVER STARTS
    try {
        await connectToPostgres();
        await testDatabaseConnection();
    } catch (error) {
        console.log("Failed to connect to database, but server is running");
    }
});
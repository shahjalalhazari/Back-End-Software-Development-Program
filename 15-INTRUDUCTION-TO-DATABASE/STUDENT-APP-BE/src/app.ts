import express, {Request, Response} from "express";
import cors from "cors";
import { env } from "./config/env";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Welcome to the Student App API",
    timestamp: new Date().toISOString(),
    status: "success",
  });
});

app.listen(env.port, () => {
  console.log(
    `🚀 Server running on http://localhost:${env.port}`
  );
});
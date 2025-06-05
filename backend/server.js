import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import productRoutes from "./routes/productRoutes.js";
import pool from "./database/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

async function testDatabaseConnection() {
    try {
        const client = await pool.connect();
        console.log('Database connection successful');
        client.release();
    } catch (error) {
        console.error('Database connection failed:', error.message);
        console.error('Make sure PostgreSQL is running and your .env variables are correct');
    }
}

testDatabaseConnection();

app.use("/api/products", productRoutes);

app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
    console.log(`📊 Health check available at: http://localhost:${PORT}/api/health`);
});
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";

import productRoutes from "./routes/productRoutes.js";

import pool from "./database/db.js"; //import databaes connection to test it

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(helmet()); // helmet is a security middleware that helps protect app by setting various HTTP headers
app.use(morgan("dev")); // morgan is a logging middleware that logs HTTP requests in a concise format

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

app.use("/api/products", productRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
	res.json({ 
	  status: "OK", 
	  message: "Drug Discovery API is running",
	  timestamp: new Date().toISOString()
	});
  });

testDatabaseConnection();

app.listen(PORT, () => {
	console.log("Server is running on port " + PORT);
	console.log(`📊 Health check available at: http://localhost:${PORT}/api/health`);
})
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import csv from 'csv-parser';
import pool from './db.js';
import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load CSV to Table
async function importCSV(table, columns, filename) {
	return new Promise((resolve, reject) => {
		fs.createReadStream(path.join(__dirname, filename))
			.pipe(csv())
			.on('data', async row => {
				this.pause?.();
				const vals = columns.map(col => row[col]);
				const placeholders = columns.map((_, i) => `$${i+1}`).join(',');
				const sql = `INSERT INTO ${table}(${columns.join(',')}) VALUES(${placeholders})`;
				try {
					await pool.query(sql, vals);
				} catch (error) {
					console.error(`Error seeding ${table}:`, error.message);
				}
				this.resume?.();
			})
			.on('end', () => {
				console.log(`Finished importing ${table} from ${filename}`);
				resolve();
			})
			.on('error', reject);
		});
	}

async function runSeed() {
	try {
		console.log('Truncating existing data...');
		await pool.query('TRUNCATE products, patent, exclusivity RESTART IDENTITY CASECADE;');
		
		// Seed the databases
		console.log('Seeding products...');
		await importCSV(
			'products',
			//Update columns based on CSV headers
			[ 'Appl_No', 'Ingredient', 'Dosage', 'Form', 'Route', 'Applicant', 'Strength', 'Appl_Type', 'TE_Code', 'Approval_Date', 'RLD', 'RS', 'Type', 'Applicant_Full_Name' ],
			'../data/products.csv'
		);

		console.log('Seeding patent...');
		await importCSV(
			'patent',
			//Update columns based on CSV headers
			[ '' ],
			'../data/patent.csv'
		);

		console.log('Seeding exclusivity...');
		await importCSV(
			'exclusivity',
			//Update columns based on CSV headers
			[ '' ],
			'../data/exclusivity.csv'
		);

		console.log('All data seeded successfully.');
	} catch (error) {
		console.error('Seeding failed:', error.message);
	} finally {
		await pool.end();
	}
}

if (import.meta.url === `file://${process.argv[1]}`) {
	runSeed().then(() => process.exit(0));
}

export default runSeed;
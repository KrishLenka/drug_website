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
	  const stream = fs
		.createReadStream(path.join(__dirname, filename))
		.pipe(csv());
  
	  stream
		.on('data', async function (row) {
		  this.pause();
  
		  Object.keys(row).forEach(key => {
			if (row[key] === '') {
			  row[key] = null;
			}
		  });
		  const boolCols = ['Drug_Substance_Flag', 'Drug_Product_Flag'];
		  boolCols.forEach(col => {
			if (typeof row[col] === 'string') {
			  const lower = row[col].toLowerCase();
			  row[col] = (lower === 'yes' || lower === 'true' || lower === '1'|| lower === 'y');
			}
		  });
		  const vals = columns.map(col => row[col]);
		  const placeholders = columns.map((_, i) => `$${i + 1}`).join(',');
		  const sql = `INSERT INTO ${table}(${columns.join(',')}) VALUES(${placeholders})`;
		  try {
			await pool.query(sql, vals);
		  } catch (error) {
			console.error(`Error seeding ${table}:`, error.message);
		  }
  
		  this.resume();
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
		await pool.query('TRUNCATE products, patent, exclusivity RESTART IDENTITY CASCADE;');
		
		// Seed the databases
		console.log('Seeding products...');
		await importCSV(
			'products',
			//Update columns based on CSV headers
			[ 'Appl_No', 'Appl_Type', 'Ingredient', 'Dosage', 'Form', 'Route', 'Trade_Name', 'Applicant', 'Strength', 'Product_No', 'TE_Code', 'Approval_Date', 'RLD', 'RS', 'Type', 'Applicant_Full_Name' ],
			'../data/products.csv'
		);

		console.log('Seeding patent...');
		await importCSV(
			'patent',
			//Update columns based on CSV headers
			[ 'Appl_No', 'Appl_Type', 'Ingredient', 'Dosage', 'Form', 'Route', 'Trade_Name', 'Applicant', 'Strength', 'Product_No', 'Patent_No', 'Patent_Expire_Date_Text', 'Drug_Substance_Flag', 'Drug_Product_Flag', 'Patent_Use_Code', 'Submission_Date' ],
			'../data/patent.csv'
		);

		console.log('Seeding exclusivity...');
		await importCSV(
			'exclusivity',
			//Update columns based on CSV headers
			[ 'Appl_No', 'Appl_Type', 'Ingredient', 'Dosage', 'Form', 'Route', 'Trade_Name', 'Strength', 'Product_No', 'Exclusivity_Code', 'Exclusivity_Date' ],
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
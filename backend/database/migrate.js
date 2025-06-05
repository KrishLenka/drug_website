import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrations() {
	try {
		console.log('Running database migrations...');
		// Read the schema file
		const schemaPath = path.join(__dirname, 'schema.sql');
		const schema = fs.readFileSync(schemaPath, 'utf8');
		// Execute the schema
		await pool.query(schema);
		console.log('Database migrations completed successfully.');
		console.log('Tables created');
	} catch (error){
		console.error('Migration failed:', error.message);
		throw error;
	} finally {
		await pool.end();
		console.log('Database connection closed.');
	}
}

if (import.meta.url === `file://${process.argv[1]}`) {
	runMigrations()
		.then(() => {
			console.log('Migrations process completed.');
			process.exit(0);
		})
		.catch((error) => {
			console.error('Migration failed:', error);
			process.exit(1);
		});
}

export default runMigrations;
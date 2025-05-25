# drug_website

**Notes for myself:**
- Update columns in *schema.sql*
	- use 'ALTER TABLE table ADD COLUMN new_col;'
	- or drop the table in postgres and add columns in 'CREATE TABLE IF NOT EXISTS' block if necessary
	- **Remember to update column array in seed.js**
- run:
	- npm run migrate -> runs schema.sql
	- npm run seed -> wipes and reloads CSV data

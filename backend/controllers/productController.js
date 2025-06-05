import {query} from "../database/db.js"; 
export const getProducts = async (req, res) => {
	try {
		const { 
			page = 1, 
			limit = 100, 
			sort = 'id',
			order = 'ASC',
			ingredient, 
			trade_name,
			applicant,
			applicant_full_name,
			appl_type,
			dosage,
			form,
			route,
			strength,
			te_code,
			type,
			rld,
			rs,
			approval_date_from,
			approval_date_to
		} = req.query;
		
		const pageNum = Math.max(1, parseInt(page) || 1);
		const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 100));
		const offset = (pageNum - 1) * limitNum;

		let whereClause = `WHERE 1=1`;
		const params = [];
		let paramCount = 1;

		if (ingredient) {
			whereClause += ` AND LOWER(Ingredient) LIKE LOWER($${paramCount})`;
			params.push(`%${ingredient}%`);
			paramCount++;
		}
		if (trade_name) {
			whereClause += ` AND LOWER(Trade_Name) LIKE LOWER($${paramCount})`;
			params.push(`%${trade_name}%`);
			paramCount++;
		}

		if (applicant) {
			whereClause += ` AND LOWER(Applicant) LIKE LOWER($${paramCount})`;
			params.push(`%${applicant}%`);
			paramCount++;
		}
	
		if (applicant_full_name) {
			whereClause += ` AND LOWER(Applicant_Full_Name) LIKE LOWER($${paramCount})`;
			params.push(`%${applicant_full_name}%`);
			paramCount++;
		}
	
		if (appl_type) {
			whereClause += ` AND Appl_Type = $${paramCount}`;
			params.push(appl_type);
			paramCount++;
		}
	
		if (dosage) {
			whereClause += ` AND LOWER(Dosage) LIKE LOWER($${paramCount})`;
			params.push(`%${dosage}%`);
			paramCount++;
		}
	
		if (form) {
			whereClause += ` AND LOWER(Form) LIKE LOWER($${paramCount})`;
			params.push(`%${form}%`);
			paramCount++;
		}
	
		if (route) {
			whereClause += ` AND LOWER(Route) LIKE LOWER($${paramCount})`;
			params.push(`%${route}%`);
			paramCount++;
		}
	
		if (strength) {
			whereClause += ` AND LOWER(Strength) LIKE LOWER($${paramCount})`;
			params.push(`%${strength}%`);
			paramCount++;
		}
	
		if (te_code) {
			whereClause += ` AND LOWER(TE_Code) LIKE LOWER($${paramCount})`;
			params.push(`%${te_code}%`);
			paramCount++;
		}
	
		if (type) {
			whereClause += ` AND LOWER(Type) LIKE LOWER($${paramCount})`;
			params.push(`%${type}%`);
			paramCount++;
		}
	
		if (rld !== undefined) {
			whereClause += ` AND RLD = $${paramCount}`;
			params.push(rld === 'true' || rld === true);
			paramCount++;
		}
	
		if (rs !== undefined) {
			whereClause += ` AND RS = $${paramCount}`;
			params.push(rs === 'true' || rs === true);
			paramCount++;
		}
	
		if (approval_date_from) {
			whereClause += ` AND Approval_Date >= $${paramCount}`;
			params.push(approval_date_from);
			paramCount++;
		}
	
		if (approval_date_to) {
			whereClause += ` AND Approval_Date <= $${paramCount}`;
			params.push(approval_date_to);
			paramCount++;
		}

		const validSortFields = {
			id: 'id',
			ingredient: 'Ingredient',
			trade_name: 'Trade_Name',
			applicant: 'Applicant',
			approval_date: 'Approval_Date',
			appl_no: 'Appl_No'
		};

		const validOrder = ['ASC', 'DESC'].includes(order.toUpperCase()) ? order.toUpperCase() : 'ASC';
		const validSort = validSortFields[sort] || 'id';
		const orderClause = `ORDER BY ${validSort} ${validOrder}`;

		const countQuery = `
			SELECT COUNT(*) as total
			FROM products
			${whereClause}
		`;

		const countResult = await query(countQuery, params);
		const totalRecords = parseInt(countResult.rows[0].total);
		const totalPages = Math.ceil(totalRecords / limitNum);

		const dataQuery = `
			SELECT *
			FROM products
			${whereClause}
			${orderClause}
			LIMIT $${paramCount} OFFSET $${paramCount + 1}
		`;

		const dataResult = await query(dataQuery, [...params, limitNum, offset]);

		res.json({
			success: true,
			data: dataResult.rows,
			pagination: {
				currentPage: pageNum,
				totalPages: totalPages,
				totalRecords: totalRecords,
				limit: limitNum,
				hasNextPage: pageNum < totalPages,
				hasPrevPage: pageNum > 1
			},
			filters: {
				ingredient,
				trade_name,
				applicant,
				applicant_full_name,
				appl_type,
				dosage,
				form,
				route,
				strength,
				te_code,
				type,
				rld,
				rs,
				approval_date_from,
				approval_date_to
			},
			sort: { field: sort, order: validOrder }
		});

	} catch (error) {
		console.error('Error fetching products:', error);
		res.status(500).json({ success: false, message: 'Internal server error', error: process.env.NODE_ENV === 'development' ? error.message : undefined 
		});
	}
};

export const getProduct = async (req, res) => {
	try {
		const { id } = req.params;
		if (!id || isNaN(parseInt(id))) {
			return res.status(400).json({ success: false, message: 'Invalid product ID' });
		}
		const sqlQuery = `
			SELECT *
			FROM products
			WHERE id = $1
		`;
		const result = await query(sqlQuery, [parseInt(id)]);
		if (result.rows.length === 0) {
			return res.status(404).json({ success: false, message: 'Product not found' });
		}
		res.json({ success: true, data: result.rows[0] });
	} catch (error) {
		console.error('Error fetching product:', error);
		res.status(500).json({ success: false, message: 'Internal server error', error: process.env.NODE_ENV === 'development' ? error.message : undefined });
	}
};

export const createProduct = async (req, res) => {
	try {
		const {
			Appl_No,
			Appl_Type,
			Ingredient,
			Dosage,
			Form,
			Route,
			Trade_Name,
			Applicant,
			Strength,
			Product_No,
			TE_Code,
			Approval_Date,
			RLD,
			RS,
			Type,
			Applicant_Full_Name
		} = req.body;
		const requiredFields = {
			Appl_No,
			Appl_Type,
			Ingredient,
			Dosage,
			Form,
			Route,
			Trade_Name,
			Applicant,
			Strength,
			Product_No,
			TE_Code,
			Approval_Date,
			RLD,
			RS,
			Type,
			Applicant_Full_Name
		};
		const missingFields = Object.entries(requiredFields)
			.filter(([key, value]) => !value)
			.map(([key]) => key);
		if (missingFields.length > 0) {
			return res.status(400).json({ success: false, message: `Missing required fields: ${missingFields.join(', ')}` });
		}
		const sqlQuery = `
			INSERT INTO products (
				Appl_No,
				Appl_Type,
				Ingredient,
				Dosage,
				Form,
				Route,
				Trade_Name,
				Applicant,
				Strength,
				Product_No,
				TE_Code,
				Approval_Date,
				RLD,
				RS,
				Type,
				Applicant_Full_Name
			) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
			 RETURNING *
		`;

		const params = [
			Appl_No, 
			Appl_Type, 
			Ingredient, 
			Dosage, 
			Form, 
			Route,
			Trade_Name, 
			Applicant, 
			Strength, 
			Product_No, 
			TE_Code,
			Approval_Date, 
			RLD || false, 
			RS || false, 
			Type, 
			Applicant_Full_Name
		  ];

		  const result = await query(sqlQuery, params);

		  res.status(201).json({
			success: true,
			message: 'Product created successfully',
			data: result.rows[0]
		  });
	} catch (error){
		console.error('Error creating product:', error);
		if (error.code === '23505') {
			return res.status(409).json({ success: false, message: 'Product with this Appl_No already exists' });
		}
		res.status(500).json({ success: false, message: 'Internal server error', error: process.env.NODE_ENV === 'development' ? error.message : undefined });
	}
};

export const updateProduct = async (req, res) => {
	try {
	  const { id } = req.params;
	  const updates = req.body;

	  if (!id || isNaN(parseInt(id))) {
		return res.status(400).json({ success: false, message: 'Invalid product ID' });
	  }
	  const checkQuery = `SELECT id FROM products WHERE id = $1`;
	  const existingProduct = await query(checkQuery, [parseInt(id)]);

	  if (existingProduct.rows.length === 0) {
		return res.status(404).json({ success: false, message: 'Product not found' });
	  }
	  const allowedFields = [
		'Appl_No',
		'Appl_Type',
		'Ingredient',
		'Dosage',
		'Form',
		'Route',
		'Trade_Name',
		'Applicant',
		'Strength',
		'Product_No',
		'TE_Code',
		'Approval_Date',
		'RLD',
		'RS',
		'Type',
		'Applicant_Full_Name'
	  ];
	  const updateFields = [];
	  const params = [];
	  let paramCount = 1;
	  Object.entries(updates).forEach(([key, value]) => {
		if (allowedFields.includes(key) && value !== undefined) {
		  updateFields.push(`${key} = $${paramCount}`);
		  params.push(value);
		  paramCount++;
	  }});
	  if (updateFields.length === 0) {
		return res.status(400).json({ success: false, message: 'No valid fields to update' });
	  }
	  params.push(parseInt(id));
	  const updateQuery = `
	  	UPDATE products
		SET ${updateFields.join(', ')}
		WHERE id = $${paramCount}
		RETURNING *
	  `;
	  const result = await query(updateQuery, params);
	  res.json({
		success: true, message: 'Product updated successfully', data: result.rows[0]
	  });
	} catch (error) {
		console.error('Error updating product:', error);
		res.status(500).json({
			success: false,
			message: 'Internal server error',
			error: process.env.NODE_ENV === 'development' ? error.message : undefined
		});
	}
};


export const deleteProduct = async (req, res) => {
	try {
	  const { id } = req.params;
  
	  if (!id || isNaN(parseInt(id))) {
		return res.status(400).json({
			success: false, message: 'Invalid product ID'
		});
	  }
  
	  const sqlQuery = `
	  	DELETE FROM products 
		WHERE id = $1 
		RETURNING *
	  `;
  
	  const result = await query(sqlQuery, [parseInt(id)]);
  
	  if (result.rows.length === 0) {
		return res.status(404).json({
			success: false, message: 'Product not found'
		});
	  }
  
	  res.json({
		success: true, message: 'Product deleted successfully', data: result.rows[0]
	  });
  
	} catch (error) {
		console.error('Error deleting product:', error);
		res.status(500).json({
			success: false, message: 'Internal server error', error: process.env.NODE_ENV === 'development' ? error.message : undefined
		});
	}
  };
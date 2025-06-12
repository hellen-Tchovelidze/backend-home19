const mysql = require("mysql2");
require("dotenv").config();
const pool = mysql
  .createPool({
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DB,
  })
  .promise();

const getAllProducts = async ({ name, price,priceFrom, priceTo, available }) => {
  let query = "SELECT * FROM products WHERE 1=1";
  const params = [];

  if (name) {
    query += " AND name = ?";
    params.push(name);
  }

  if (price) {
    query += " AND price = ?";
    params.push(price);
  }

  
  if (priceFrom !== undefined) {
    query += ' AND price >= ?';
    params.push(priceFrom);
  }

  if (priceTo !== undefined) {
    query += ' AND price <= ?';
    params.push(priceTo);
  }

  if (available !== undefined) {
    query += " AND available = ?";
    params.push(available);
  }

  const [result] = await pool.query(query, params);
  return result;
};

const getProductById = async (id) => {
  const [result] = await pool.query(
    `
    SELECT * FROM products WHERE id = ?`,
    [id]
  );
  return result[0];
};

const deleteProductById = async (id) => {
  const [result] = await pool.query(
    `
    DELETE FROM products WHERE id = ?`,
    [id]
  );

  return result.affectedRows > 0 ? true : false;
};

const createProduct = async (name, price, available) => {
  const [result] = await pool.query(
    `
        INSERT INTO products (name, price, available )
        VALUES (?, ?, ?)`,
    [name, price, available]
  );

  const insertedData = await getProductById(result.insertId);
  return insertedData;
};

const updateProductById = async (id, name, price, available) => {
  const existPost = await getProductById(id);
  name = name || existPost.name;
  price = price || existPost.price;
  available = available !== undefined ? available : existPost.available;
  const [result] = await pool.query(
    `
        UPDATE products 
        SET name= ?, price = ?, available = ?
        WHERE id = ?`,
    [name, price, available, id]
  );

  return result.affectedRows > 0 ? true : false;
};


module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  deleteProductById,
  updateProductById,

};

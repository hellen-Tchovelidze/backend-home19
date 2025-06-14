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

const getAllProducts = async ({
  name,
  price,
  priceFrom,
  priceTo,
  available,
}) => {
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
    query += " AND price >= ?";
    params.push(priceFrom);
  }

  if (priceTo !== undefined) {
    query += " AND price <= ?";
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

const getAllUsers = async () => {
  const [result] = await pool.query(`SELECT * FROM users`);
  return result;
};

const getUserById = async (id) => {
  const [result] = await pool.query(`SELECT * FROM users WHERE id = ?`, [id]);
  if (result.length === 0) return null;

  const [posts] = await pool.query(`SELECT * FROM posts WHERE user_id = ?`, [
    id,
  ]);

  return { ...result[0], posts };
};

const createUser = async (name, email) => {
  const [result] = await pool.query(
    `INSERT INTO users (name, email) VALUES (?, ?)`,
    [name, email]
  );
  return getUserById(result.insertId);
};

const updateUserById = async (id, name) => {
  const [user] = await pool.query(`SELECT * FROM users WHERE id = ?`, [id]);
  if (user.length === 0) return false;

  const newName = name || user[0].name;

  const [result] = await pool.query(`UPDATE users SET name = ? WHERE id = ?`, [
    newName,
    id,
  ]);

  return result.affectedRows > 0;
};

const deleteUserById = async (id) => {
  const [result] = await pool.query(`DELETE FROM users WHERE id = ?`, [id]);
  return result.affectedRows > 0;
};

const getAllPosts = async () => {
  const [result] = await pool.query(`SELECT * FROM posts`);
  return result;
};
const getPostById = async (id) => {
  const [result] = await pool.query(`SELECT * FROM posts WHERE id = ?`, [id]);
  return result[0];
};

const createPost = async (user_id, title, content) => {
  const [result] = await pool.query(
    `INSERT INTO posts (user_id, title, content) VALUES (?, ?, ?)`,
    [user_id, title, content]
  );
  return getPostById(result.insertId);
};

const updatePostById = async (id, title, content) => {
  const [post] = await pool.query(`SELECT * FROM posts WHERE id = ?`, [id]);
  if (post.length === 0) return false;

  const newTitle = title || post[0].title;
  const newContent = content !== undefined ? content : post[0].content;

  const [result] = await pool.query(
    `UPDATE posts SET title = ?, content = ? WHERE id = ?`,
    [newTitle, newContent, id]
  );

  return result.affectedRows > 0;
};

const deletePostById = async (id) => {
  const [result] = await pool.query(`DELETE FROM posts WHERE id = ?`, [id]);
  return result.affectedRows > 0;
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  deleteProductById,
  updateProductById,
  getUserById,
  createUser,
  updateUserById,
  deleteUserById,
  getPostById,
  createPost,
  updatePostById,
  deletePostById,
  getAllPosts,
  getAllUsers,
};

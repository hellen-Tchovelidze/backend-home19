const express = require("express");

const {
  getAllProducts,
  getProductById,
  createProduct,
  deleteProductById,
  updateProductById,
  createUser,
  getUserById,
  updateUserById,
  deleteUserById,
  getPostById,
  createPost,
  updatePostById,
  deletePostById,
  getAllPosts,
  getAllUsers,
} = require("./config/connectToSQL");
const {
  userCreateSchema,
  userUpdateSchema,
  postCreateSchema,
  postUpdateSchema,
} = require("./validation/joi");
const app = express();

app.use(express.json());

app.get("/products", async (req, res) => {
  const { name, price, available, priceTo, priceFrom } = req.query;
  const parsedAvailable =
    available !== undefined ? available === "true" : undefined;
  const resp = await getAllProducts({
    name,
    price,
    priceFrom: priceFrom ? parseFloat(priceFrom) : undefined,
    priceTo: priceTo ? parseFloat(priceTo) : undefined,
    available: parsedAvailable,
  });
  res.json(resp);
});

app.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  const result = await getProductById(id);
  res.json(result);
});

app.post("/products", async (req, res) => {
  const { name, price, available } = req.body;
  const result = await createProduct(name, price, available);

  res.status(201).json({ message: "created sacs" });
});

app.delete("/products/:id", async (req, res) => {
  const { id } = req.params;
  const result = await deleteProductById(id);

  if (result) {
    res.status(200).json({ message: "Product deleted successfully" });
  } else {
    res.status(404).json({ message: "Product not found" });
  }
});

app.put("/products/:id", async (req, res) => {
  const { id } = req.params;
  const { name, price, available } = req.body;

  const result = await updateProductById(id, name, price, available);

  if (result) {
    res.status(200).json({ message: "Product updated successfully" });
  } else {
    res.status(404).json({ message: "Product not found" });
  }
});

app.get("/users", async (req, res) => {
  const users = await getAllUsers();
  res.json(users);
});

app.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  const user = await getUserById(id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

app.post("/users", async (req, res) => {
  const { error, value } = userCreateSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const user = await createUser(value.name, value.email);
  res.status(201).json(user);
});

app.put("/users/:id", async (req, res) => {
  const { error, value } = userUpdateSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const updated = await updateUserById(req.params.id, value.name);
  if (!updated) return res.status(404).json({ message: "User not found" });

  res.json({ message: "User updated successfully" });
});

app.delete("/users/:id", async (req, res) => {
  const deleted = await deleteUserById(req.params.id);
  if (!deleted) return res.status(404).json({ message: "User not found" });

  res.json({ message: "User deleted successfully" });
});

app.get("/posts", async (req, res) => {
  const posts = await getAllPosts();
  res.json(posts);
});

app.get("/posts/:id", async (req, res) => {
  const post = await getPostById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });
  res.json(post);
});

app.post("/posts", async (req, res) => {
  const { error, value } = postCreateSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const user = await getUserById(value.user_id);
  if (!user) return res.status(400).json({ message: "Invalid user_id" });

  const post = await createPost(value.user_id, value.title, value.content);
  res.status(201).json(post);
});

app.put("/posts/:id", async (req, res) => {
  const { error, value } = postUpdateSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const updated = await updatePostById(
    req.params.id,
    value.title,
    value.content
  );
  if (!updated) return res.status(404).json({ message: "Post not found" });

  res.json({ message: "Post updated successfully" });
});

app.delete("/posts/:id", async (req, res) => {
  const deleted = await deletePostById(req.params.id);
  if (!deleted) return res.status(404).json({ message: "Post not found" });

  res.json({ message: "Post deleted successfully" });
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});

const express = require("express");
const {
  getAllProducts,
  getProductById,
  createProduct,
  deleteProductById,
  updateProductById,
} = require("./config/connectToSQL");
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

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});

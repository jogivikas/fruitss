import asyncHandler from "express-async-handler";
import Product from "../models/Product.js";

// GET /api/products
export const getProducts = asyncHandler(async (req, res) => {
  // basic search & category filter & pagination
  const pageSize = Number(req.query.pageSize) || 20;
  const page = Number(req.query.pageNumber) || 1;
  const keyword = req.query.keyword
    ? {
        name: { $regex: req.query.keyword, $options: "i" },
      }
    : {};
  const category = req.query.category ? { category: req.query.category } : {};

  const count = await Product.countDocuments({ ...keyword, ...category });
  const products = await Product.find({ ...keyword, ...category })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// GET /api/products/:id
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate(
    "seller",
    "name email"
  );
  if (product) res.json(product);
  else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// POST /api/products
export const createProduct = asyncHandler(async (req, res) => {
  const { name, price, category, description, countInStock, image } = req.body;
  const product = new Product({
    seller: req.user ? req.user._id : undefined,
    name: name || "New Product",
    price: price || 0,
    category: category || "General",
    description: description || "",
    countInStock: countInStock || 0,
    image: image || "",
  });
  const created = await product.save();
  res.status(201).json(created);
});

// PUT /api/products/:id
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  const { name, price, category, description, countInStock, image } = req.body;
  product.name = name ?? product.name;
  product.price = price ?? product.price;
  product.category = category ?? product.category;
  product.description = description ?? product.description;
  product.countInStock = countInStock ?? product.countInStock;
  product.image = image ?? product.image;
  const updated = await product.save();
  res.json(updated);
});

// DELETE /api/products/:id
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  await product.remove();
  res.json({ message: "Product removed" });
});

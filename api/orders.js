import express from "express";
const router = express.Router();

import {
  createOrder,
  getOrdersByUserId,
  getOrderById,
  getOrdersByProductIdAndUserId,
  getProductsByOrderId, // <-- Add this import
} from "#db/queries/orders";

import { getProductById } from "#db/queries/product";
import { createOrdersProducts } from "#db/queries/orders_products";

// Move this route before router.param("id") to avoid conflicts:
router.get("/products/:id/orders", async (req, res, next) => {
  try {
    if (!req.user) return res.status(401).send("Unauthorized");

    const productId = Number(req.params.id);
    const product = await getProductById(productId);
    if (!product) return res.status(404).send("Product not found");

    const orders = await getOrdersByProductIdAndUserId(productId, req.user.id);
    res.status(200).send(orders);
  } catch (err) {
    console.error("Error fetching orders by product:", err);
    next(err);
  }
});

// Middleware to check auth for all following routes
router.use((req, res, next) => {
  if (!req.user) return res.status(401).send("Unauthorized");
  next();
});

router.post("/", async (req, res, next) => {
  const { date, note } = req.body;
  if (!date) return res.status(400).send("Missing required field: date");
  try {
    const order = await createOrder(date, note || "", req.user.id);
    res.status(201).send(order);
  } catch (err) {
    next(err);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const orders = await getOrdersByUserId(req.user.id);
    res.send(orders);
  } catch (err) {
    next(err);
  }
});

router.param("id", async (req, res, next, id) => {
  try {
    const order = await getOrderById(id);
    if (!order) return res.status(404).send("Order not found");
    if (order.user_id !== req.user.id) return res.status(403).send("Forbidden");
    req.order = order;
    next();
  } catch (err) {
    next(err);
  }
});

router.get("/:id", (req, res) => {
  res.send(req.order);
});

router.post("/:id/products", async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    if (productId === undefined || quantity === undefined) {
      return res.status(400).send("Missing required fields");
    }

    const product = await getProductById(productId);
    if (!product) return res.status(400).send("Product does not exist");

    const added = await createOrdersProducts(req.order.id, productId, quantity);
    res.status(201).send(added);
  } catch (err) {
    console.error("Error adding product to order:", err);
    next(err);
  }
});

router.get("/:id/products", async (req, res, next) => {
  try {
    const products = await getProductsByOrderId(req.order.id);
    res.status(200).send(products);
  } catch (err) {
    console.error("Error fetching products for order:", err);
    next(err);
  }
});

export default router;

import express from "express";
import usersRouter from "#api/users";
import productsRouter from "#api/product";
import ordersRouter from "#api/orders";
import getUserFromToken from "#middleware/getUserFromToken";

const app = express();
export default app;

app.use(express.json());

// Attach user from token if available
app.use(getUserFromToken);

// Routes
app.use("/users", usersRouter);
app.use("/products", productsRouter);
app.use("/orders", ordersRouter);

// Database error handling (Postgres error codes)
app.use((err, req, res, next) => {
  switch (err.code) {
    case "22P02": // invalid_text_representation
      return res.status(400).send("Invalid input syntax.");
    case "23505": // unique_violation
    case "23503": // foreign_key_violation
      return res.status(400).send(err.detail);
    default:
      next(err);
  }
});

// Fallback error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).send("Sorry! Something went wrong.");
});

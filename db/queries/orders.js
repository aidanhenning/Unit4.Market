import db from "#db/client";

export async function createOrder(date, note, user_id) {
  const sql = `INSERT INTO orders (date, note, user_id) VALUES ($1, $2, $3) RETURNING *`;
  const {
    rows: [order],
  } = await db.query(sql, [date, note, user_id]);
  return order;
}

export async function getOrderById(id) {
  const sql = `SELECT * FROM orders WHERE id = $1`;
  const {
    rows: [order],
  } = await db.query(sql, [id]);
  return order;
}

export async function getOrdersByUserId(user_id) {
  const sql = `SELECT * FROM orders WHERE user_id = $1`;
  const { rows } = await db.query(sql, [user_id]);
  return rows;
}

export async function getOrderProducts(order_id) {
  const sql = `
    SELECT products.*, orders_products.quantity
    FROM orders_products
    JOIN products ON products.id = orders_products.product_id
    WHERE orders_products.order_id = $1
  `;
  const { rows } = await db.query(sql, [order_id]);
  return rows;
}

export async function getProductsByOrderId(orderId) {
  const { rows } = await db.query(
    `SELECT p.* FROM products p
     JOIN orders_products op ON p.id = op.product_id
     WHERE op.order_id = $1`,
    [orderId]
  );
  return rows;
}

export async function getOrdersByProductIdAndUserId(productId, userId) {
  const { rows } = await db.query(
    `SELECT o.* FROM orders o
     JOIN orders_products op ON o.id = op.order_id
     WHERE op.product_id = $1 AND o.user_id = $2`,
    [productId, userId]
  );
  return rows;
}

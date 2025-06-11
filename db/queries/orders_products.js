import db from "#db/client";

export async function createOrdersProducts(order_id, product_id, quantity) {
  const sql = `INSERT INTO orders_products (order_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *`;
  const {
    rows: [ordersProducts],
  } = await db.query(sql, [order_id, product_id, quantity]);
  return ordersProducts;
}

import db from "#db/client";
import { faker } from "@faker-js/faker";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

import { createUser } from "#db/queries/users";
import { createOrder } from "#db/queries/orders";
import { createProduct } from "#db/queries/product";
import { createOrdersProducts } from "#db/queries/orders_products";

async function seed() {
  // TODO
  const user = await createUser("user2", "password!");
  const order = await createOrder(
    faker.date.between({ from: "2015-01-01", to: Date.now() }),
    "new order",
    user.id
  );
  // Create 10 products
  const products = [];
  for (let i = 0; i < 10; i++) {
    const product = await createProduct(
      faker.commerce.product(),
      faker.commerce.productDescription(),
      faker.commerce.price()
    );
    products.push(product);
  }
  // Create orders_products (attach orders and products)
  for (let i = 0; i < 5; i++) {
    await createOrdersProducts(order.id, products[i].id, 1);
  }
}

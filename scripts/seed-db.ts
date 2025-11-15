import { db } from "../lib/db";
import { users } from "../lib/db/schema";

async function seed() {
  // Create a test user
  await db.insert(users).values({
    id: "user_test123",
    email: "test@example.com",
    name: "Test User",
  });

  console.log("✅ Seeded test user!");
}

seed();
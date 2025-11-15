import { db } from "../lib/db";
import { users, assignments } from "../lib/db/schema";

async function seed() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  await db.delete(assignments);
  await db.delete(users);

  // Create test users
  const testUsers = [
    {
      id: "user_test123",
      email: "you@example.com",
      name: "You (Test User)",
      wishlist: "- New headphones\n- Coffee subscription\n- Cozy blanket",
    },
    {
      id: "user_mom",
      email: "mom@example.com",
      name: "Mom",
      wishlist: "- Gardening tools\n- Recipe book\n- Spa gift card",
    },
    {
      id: "user_dad",
      email: "dad@example.com",
      name: "Dad",
      wishlist: "- Golf balls\n- BBQ accessories\n- Fishing gear",
    },
    {
      id: "user_sibling",
      email: "sibling@example.com",
      name: "Sibling",
      wishlist: "- Video games\n- Sneakers\n- Concert tickets",
    },
  ];

  await db.insert(users).values(testUsers);
  console.log("✅ Created test users");

  // Create a test assignment (You -> Mom)
  await db.insert(assignments).values({
    giverId: "user_test123",
    receiverId: "user_mom",
    year: "2024",
  });
  console.log("✅ Created test assignment");

  console.log("🎉 Seeding complete!");
}

seed()
  .catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
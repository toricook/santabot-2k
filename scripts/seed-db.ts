import { db } from "../lib/db";
import { assignments, gamePlayers, games, users } from "../lib/db/schema";

async function seed() {
  console.log("[seed] Seeding database...");

  // Clear existing data in dependency order
  await db.delete(assignments);
  await db.delete(gamePlayers);
  await db.delete(games);
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
  console.log("[seed] Created test users");

  // Create a sample game
  const [{ id: familyGameId }] = await db
    .insert(games)
    .values({
      name: "Family Secret Santa 2024",
      creatorId: "user_test123",
    })
    .returning({ id: games.id });
  console.log("[seed] Created test game");

  // Add all test users to the game
  await db.insert(gamePlayers).values(
    testUsers.map((user) => ({
      gameId: familyGameId,
      userId: user.id,
    }))
  );
  console.log("[seed] Added players to game");

  // Create a test assignment (You -> Mom)
  await db.insert(assignments).values({
    giverId: "user_test123",
    receiverId: "user_mom",
    gameId: familyGameId,
    year: "2024",
  });
  console.log("[seed] Created test assignment");

  console.log("[seed] Seeding complete!");
}

seed()
  .catch((error) => {
    console.error("[seed] Seeding failed:", error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });

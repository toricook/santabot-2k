import { eq } from "drizzle-orm";
import { assignSecretSantas } from "../lib/assignment-logic";
import { db } from "../lib/db";
import { games, users } from "../lib/db/schema";

async function testAssignments() {
  console.log("Testing Secret Santa assignments...\n");

  const [game] = await db
    .select({
      id: games.id,
      name: games.name,
    })
    .from(games)
    .limit(1);

  if (!game) {
    throw new Error("No games found. Seed the database first.");
  }

  const year = "2024";

  // Run assignment
  const result = await assignSecretSantas(game.id, year);

  console.log(`Assignments created for "${game.name}" (${year}):`);
  for (const assignment of result) {
    const [giver] = await db
      .select()
      .from(users)
      .where(eq(users.id, assignment.giverId));
    const [receiver] = await db
      .select()
      .from(users)
      .where(eq(users.id, assignment.receiverId));
    console.log(`  ${giver.name} -> ${receiver.name}`);
  }

  // Validation tests
  console.log("\nValidation:");
  console.log(`  - Total assignments: ${result.length}`);
  console.log(
    `  - Everyone gives once: ${
      new Set(result.map((assignment) => assignment.giverId)).size ===
      result.length
    }`,
  );
  console.log(
    `  - Everyone receives once: ${
      new Set(result.map((assignment) => assignment.receiverId)).size ===
      result.length
    }`,
  );
  console.log(
    `  - No self-assignments: ${!result.some(
      (assignment) => assignment.giverId === assignment.receiverId,
    )}`,
  );
}

testAssignments()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => process.exit());

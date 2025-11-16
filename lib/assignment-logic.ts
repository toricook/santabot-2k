// lib/assignment-logic.ts
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { assignments, gamePlayers, users } from "@/lib/db/schema";

const uuidRegex =
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

export async function assignSecretSantas(gameId: string, year: string) {
  if (!uuidRegex.test(gameId)) {
    throw new Error(
      "Invalid game id. Please ensure you opened this admin page from a real game link.",
    );
  }

  // Fetch all users participating in the game
  const participants = await db
    .select({
      id: users.id,
    })
    .from(gamePlayers)
    .innerJoin(users, eq(gamePlayers.userId, users.id))
    .where(eq(gamePlayers.gameId, gameId));

  if (participants.length < 2) {
    throw new Error("Need at least 2 participants in the game");
  }

  // Shuffle participants via Fisher-Yates
  const shuffled = [...participants];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const assignmentData = shuffled.map((giver, index) => {
    const receiver = shuffled[(index + 1) % shuffled.length];
    return {
      giverId: giver.id,
      receiverId: receiver.id,
      gameId,
      year,
    };
  });

  // Clear old assignments for this game/year combo
  await db
    .delete(assignments)
    .where(and(eq(assignments.gameId, gameId), eq(assignments.year, year)));

  await db.insert(assignments).values(assignmentData);

  return assignmentData;
}

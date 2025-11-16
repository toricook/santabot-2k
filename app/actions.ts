'use server';

import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { assignSecretSantas } from "@/lib/assignment-logic";
import { db } from "@/lib/db";
import { assignments, gamePlayers, games, users } from "@/lib/db/schema";
import type { AdminConsoleState, InviteStatus } from "@/app/games/[gameId]/admin/types";

const uuidRegex =
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

export async function triggerSecretSantaAssignment(
  gameId: string,
  year: string,
) {
  const assignments = await assignSecretSantas(gameId, year);

  revalidatePath(`/games/${gameId}/admin`);
  revalidatePath("/");

  return assignments;
}

export async function loadAdminConsoleData(
  gameId: string,
): Promise<AdminConsoleState> {
  if (!uuidRegex.test(gameId)) {
    throw new Error("Invalid game id. Please open the admin console from a real game link.");
  }

  const [game] = await db
    .select({
      id: games.id,
      name: games.name,
    })
    .from(games)
    .where(eq(games.id, gameId))
    .limit(1);

  if (!game) {
    throw new Error("Game not found.");
  }

  const participants = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
    })
    .from(gamePlayers)
    .innerJoin(users, eq(gamePlayers.userId, users.id))
    .where(eq(gamePlayers.gameId, gameId));

  const invitees = participants.map((participant) => ({
    email: participant.email,
    status: "accepted" as InviteStatus,
  }));

  const [latestAssignment] = await db
    .select({
      year: assignments.year,
    })
    .from(assignments)
    .where(eq(assignments.gameId, gameId))
    .orderBy(desc(assignments.createdAt))
    .limit(1);

  return {
    game,
    participants,
    invitees,
    gameStatus: latestAssignment ? "in-progress" : "pre-draw",
    latestAssignmentYear: latestAssignment?.year ?? null,
  };
}

"use server";

import { and, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { assignSecretSantas } from "@/lib/assignment-logic";
import { db } from "@/lib/db";
import { assignments, gamePlayers, games, profiles, users } from "@/lib/db/schema";
import type { AdminConsoleState, InviteStatus } from "@/app/games/[gameId]/admin/types";
import { requireSessionUser } from "@/lib/auth";
import { isMissingProfileTableError } from "@/lib/profile";

const uuidRegex =
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

export async function triggerSecretSantaAssignment(
  gameId: string,
  year: string,
) {
  const { id: userId } = await requireSessionUser();
  await ensureGameOwner(gameId, userId);

  const newAssignments = await assignSecretSantas(gameId, year);

  revalidatePath(`/games/${gameId}/admin`);
  revalidatePath("/");

  return newAssignments;
}

export async function loadAdminConsoleData(
  gameId: string,
): Promise<AdminConsoleState> {
  if (!uuidRegex.test(gameId)) {
    throw new Error("Invalid game id. Please open the admin console from a real game link.");
  }

  const { id: userId } = await requireSessionUser();
  const game = await ensureGameOwner(gameId, userId);

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
    game: {
      id: game.id,
      name: game.name,
      eventDate: game.eventDate?.toISOString() ?? null,
    },
    participants,
    invitees,
    gameStatus: latestAssignment ? "in-progress" : "pre-draw",
    latestAssignmentYear: latestAssignment?.year ?? null,
  };
}

type CreateGameInput = {
  name: string;
  eventDate: string;
  inviteEmails?: string[];
};

export async function createGame(input: CreateGameInput) {
  const sessionUser = await requireSessionUser();
  const trimmedName = input.name.trim();

  if (!trimmedName) {
    throw new Error("Give your game a name so players recognize it.");
  }

  if (!input.eventDate) {
    throw new Error("Choose a date and time for the exchange.");
  }

  const parsedDate = new Date(input.eventDate);
  if (Number.isNaN(parsedDate.valueOf())) {
    throw new Error("Enter a valid date and time.");
  }

  const sanitizedInvites = Array.from(
    new Set(
      (input.inviteEmails ?? [])
        .map((email) => email.trim().toLowerCase())
        .filter(Boolean),
    ),
  );

  const invalidInvite = sanitizedInvites.find((email) => !isValidEmail(email));
  if (invalidInvite) {
    throw new Error(`"${invalidInvite}" is not a valid email address.`);
  }

  const [game] = await db
    .insert(games)
    .values({
      name: trimmedName,
      creatorId: sessionUser.id,
      eventDate: parsedDate,
    })
    .returning({
      id: games.id,
      name: games.name,
      eventDate: games.eventDate,
    });

  await db.insert(gamePlayers).values({
    gameId: game.id,
    userId: sessionUser.id,
  });

  revalidatePath("/");
  revalidatePath(`/games/${game.id}/admin`);

  return {
    gameId: game.id,
    name: game.name,
    joinCode: buildJoinCode(game.id),
    eventDate: game.eventDate?.toISOString() ?? parsedDate.toISOString(),
    invitees: sanitizedInvites,
  };
}

export async function joinGame(inviteCode: string) {
  const code = inviteCode.trim();

  if (!code) {
    throw new Error("Enter the invite code your host shared to continue.");
  }

  const sessionUser = await requireSessionUser();
  const formattedCode = code.toUpperCase();
  let targetGame:
    | {
        id: string;
        name: string;
      }
    | null = null;

  if (uuidRegex.test(code)) {
    const [exactMatch] = await db
      .select({
        id: games.id,
        name: games.name,
      })
      .from(games)
      .where(eq(games.id, code))
      .limit(1);
    targetGame = exactMatch ?? null;
  } else {
    const availableGames = await db
      .select({
        id: games.id,
        name: games.name,
      })
      .from(games);

    targetGame =
      availableGames.find((game) => buildJoinCode(game.id) === formattedCode) ?? null;
  }

  if (!targetGame) {
    throw new Error("No game matches that code. Ask your host to confirm it and try again.");
  }

  const existingMembership = await db
    .select({ id: gamePlayers.id })
    .from(gamePlayers)
    .where(and(eq(gamePlayers.gameId, targetGame.id), eq(gamePlayers.userId, sessionUser.id)))
    .limit(1);

  if (existingMembership.length > 0) {
    throw new Error("You're already part of that game.");
  }

  await db.insert(gamePlayers).values({
    gameId: targetGame.id,
    userId: sessionUser.id,
  });

  revalidatePath("/");
  revalidatePath(`/games/${targetGame.id}/admin`);

  return { gameName: targetGame.name };
}

type SaveProfileInput = {
  name: string;
  age: string;
  favoriteColors: string;
  interests: string;
  wishlist: string;
};

export async function saveProfile(profileInput: SaveProfileInput) {
  const sessionUser = await requireSessionUser();
  const trimmedName = profileInput.name.trim();
  const ageValue = Number.parseInt(profileInput.age, 10);

  if (!trimmedName) {
    throw new Error("Please provide your name.");
  }

  if (Number.isNaN(ageValue) || ageValue < 0 || ageValue > 120) {
    throw new Error("Enter a valid age.");
  }

  const favoriteColors = profileInput.favoriteColors.trim();
  const interests = profileInput.interests.trim();
  const wishlist = profileInput.wishlist.trim();

  try {
    await db
      .insert(profiles)
      .values({
        userId: sessionUser.id,
        name: trimmedName,
        age: ageValue,
        favoriteColors,
        interests,
        wishlist,
      })
      .onConflictDoUpdate({
        target: profiles.userId,
        set: {
          name: trimmedName,
          age: ageValue,
          favoriteColors,
          interests,
          wishlist,
          updatedAt: new Date(),
        },
      });
  } catch (error) {
    if (isMissingProfileTableError(error)) {
      throw new Error(
        "Profiles table not found. Run your database migrations to enable profile editing.",
      );
    }
    throw error;
  }

  revalidatePath("/profile");
}

export async function updateWishlist(wishlistInput: string) {
  const sessionUser = await requireSessionUser();
  const trimmedWishlist = wishlistInput.trim();

  await db
    .update(users)
    .set({
      wishlist: trimmedWishlist.length > 0 ? trimmedWishlist : null,
    })
    .where(eq(users.id, sessionUser.id));

  revalidatePath("/");
  revalidatePath("/profile");
}

async function ensureGameOwner(gameId: string, userId: string) {
  const [game] = await db
    .select({
      id: games.id,
      name: games.name,
      creatorId: games.creatorId,
      eventDate: games.eventDate,
    })
    .from(games)
    .where(eq(games.id, gameId))
    .limit(1);

  if (!game) {
    throw new Error("Game not found.");
  }

  if (game.creatorId !== userId) {
    throw new Error("Only the host can manage this game.");
  }

  return game;
}

function buildJoinCode(gameId: string) {
  return `${gameId.slice(0, 4).toUpperCase()}-HOLIDAY`;
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

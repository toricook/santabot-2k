"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  wishlist: string | null;
};

async function syncUserRecord(userId: string): Promise<SessionUser> {
  const clerkUser = await currentUser();

  if (!clerkUser || clerkUser.id !== userId) {
    throw new Error("Unable to load your Clerk profile. Please re-authenticate.");
  }

  const primaryEmail =
    clerkUser.emailAddresses.find(
      (email) => email.id === clerkUser.primaryEmailAddressId,
    )?.emailAddress ?? clerkUser.emailAddresses[0]?.emailAddress;

  if (!primaryEmail) {
    throw new Error("No email found on your Clerk profile.");
  }

  const displayName =
    clerkUser.fullName ?? clerkUser.username ?? primaryEmail.split("@")[0];

  await db
    .insert(users)
    .values({
      id: userId,
      email: primaryEmail,
      name: displayName,
    })
    .onConflictDoUpdate({
      target: users.id,
      set: {
        email: primaryEmail,
        name: displayName,
      },
    });

  const [record] = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      wishlist: users.wishlist,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!record) {
    throw new Error("Unable to find your user profile after syncing.");
  }

  return record;
}

export async function requireSessionUser(
  prefetchedUserId?: string,
): Promise<SessionUser> {
  const resolvedUserId =
    prefetchedUserId ?? (await auth()).userId;

  if (!resolvedUserId) {
    throw new Error("You must be signed in to perform this action.");
  }

  return syncUserRecord(resolvedUserId);
}

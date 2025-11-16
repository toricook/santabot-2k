import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { profiles } from "@/lib/db/schema";

export type ProfileRecord = {
  name: string;
  age: number;
  favoriteColors: string;
  interests: string;
  wishlist: string;
  updatedAt: Date | null;
};

const missingRelationMessage = 'relation "profiles" does not exist';

export async function getProfileByUserId(
  userId: string,
): Promise<ProfileRecord | null> {
  try {
    const [profile] = await db
      .select({
        name: profiles.name,
        age: profiles.age,
        favoriteColors: profiles.favoriteColors,
        interests: profiles.interests,
        wishlist: profiles.wishlist,
        updatedAt: profiles.updatedAt,
      })
      .from(profiles)
      .where(eq(profiles.userId, userId))
      .limit(1);

    return profile ?? null;
  } catch (error) {
    if (isMissingProfileTableError(error)) {
      console.warn(
        "[profiles] Table not found. Run your database migrations to create the profiles table.",
      );
      return null;
    }
    throw error;
  }
}

export function isMissingProfileTableError(error: unknown) {
  return (
    error instanceof Error &&
    error.message.toLowerCase().includes(missingRelationMessage)
  );
}

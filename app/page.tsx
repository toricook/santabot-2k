import Link from "next/link";
import Script from "next/script";
import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { assignments, gamePlayers, games, users } from "@/lib/db/schema";
import DashboardClient, {
  type DashboardData,
  type GameStatus,
} from "@/components/dashboard/DashboardClient";
import HeroSection from "@/components/HeroSection";
import { auth } from "@clerk/nextjs/server";
import { requireSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { userId } = await auth();

  if (!userId) {
    return (
      <>
        <Script id="santabot-no-session-log" strategy="afterInteractive">
          {`console.log('[santabot] No Clerk session detected on homepage render.');`}
        </Script>
        <HeroSection />
      </>
    );
  }

  const sessionUser = await requireSessionUser(userId);

  const dashboardData = await buildDashboardData(sessionUser.id, sessionUser.name);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-red-50 text-green-950">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-8 sm:px-6 lg:px-10">
        <header className="flex flex-col gap-4 border-b border-green-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.6em] text-green-600">
              Secret Santa
            </p>
            <h1 className="text-4xl font-black text-red-600 sm:text-5xl">
              SantaBot 2K
            </h1>
            <p className="mt-1 text-sm text-green-700">
              Run warm, thoughtful exchanges without spreadsheets.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/profile"
              className="inline-flex items-center rounded-full border border-green-700 px-6 py-2 text-sm font-semibold text-green-800 transition hover:border-red-500 hover:text-red-600"
            >
              Edit profile
            </Link>
            <Link
              href="/join"
              className="inline-flex items-center rounded-full bg-red-600 px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-500"
            >
              Join a game
            </Link>
          </div>
        </header>

        <DashboardClient user={dashboardData} />
      </div>
      <Script id="santabot-session-log" strategy="afterInteractive">
        {`console.log('[santabot] Signed-in Clerk userId:', ${JSON.stringify(userId)});`}
      </Script>
    </div>
  );
}

async function buildDashboardData(
  userId: string,
  name: string,
): Promise<DashboardData> {
  const [gameRows, assignmentRows] = await Promise.all([
    db
      .select({
        id: games.id,
        name: games.name,
        creatorId: games.creatorId,
        joinedAt: gamePlayers.joinedAt,
      })
      .from(gamePlayers)
      .innerJoin(games, eq(gamePlayers.gameId, games.id))
      .where(eq(gamePlayers.userId, userId))
      .orderBy(desc(gamePlayers.joinedAt)),
    db
      .select({
        gameId: assignments.gameId,
        year: assignments.year,
        receiverName: users.name,
        receiverWishlist: users.wishlist,
      })
      .from(assignments)
      .innerJoin(users, eq(assignments.receiverId, users.id))
      .where(eq(assignments.giverId, userId))
      .orderBy(desc(assignments.createdAt)),
  ]);

  const assignmentMap = new Map<
    string,
    {
      year: string;
      receiverName: string;
      receiverWishlist: string | null;
    }
  >();

  assignmentRows.forEach((assignment) => {
    if (assignmentMap.has(assignment.gameId)) return;
    assignmentMap.set(assignment.gameId, {
      year: assignment.year,
      receiverName: assignment.receiverName,
      receiverWishlist: assignment.receiverWishlist,
    });
  });

  const gamesData = gameRows.map((game) => {
    const assignment = assignmentMap.get(game.id);
    const status = determineStatus(assignment?.year);

    return {
      id: game.id,
      name: game.name,
      status,
      description: getDescription(status, assignment?.year),
      nextEvent: getNextEvent(status, assignment?.year),
      isHost: game.creatorId === userId,
      recipient: assignment
        ? {
            name: assignment.receiverName ?? "Mystery Santa",
            wishlist: parseWishlist(assignment.receiverWishlist),
          }
        : undefined,
    };
  });

  return {
    greeting: `Happy gifting season, ${name}!`,
    games: gamesData,
  };
}

function determineStatus(year?: string): GameStatus {
  if (!year) {
    return "pre-draw";
  }

  const numericYear = Number(year);
  const currentYear = new Date().getFullYear();

  if (!Number.isNaN(numericYear) && numericYear < currentYear) {
    return "complete";
  }

  return "in-progress";
}

function getDescription(status: GameStatus, year?: string | null) {
  if (status === "pre-draw") {
    return "Waiting for the host to draw names.";
  }

  if (status === "complete") {
    return `Wrapped up after the ${year ?? "latest"} exchange.`;
  }

  return `Gifting underway for ${year ?? "this season"}.`;
}

function getNextEvent(status: GameStatus, year?: string | null) {
  if (status === "pre-draw") {
    return "Drawing names soon";
  }

  if (status === "complete") {
    return `Share photos from ${year ?? "the last"} exchange`;
  }

  return `Shop for your ${year ?? "current"} match`;
}

function parseWishlist(wishlist: string | null | undefined) {
  if (!wishlist) {
    return [];
  }

  return wishlist
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

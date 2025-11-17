"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export type GameStatus = "pre-draw" | "in-progress" | "complete";

export type DashboardRecipient = {
  name: string;
  wishlist: string[];
};

export type DashboardGame = {
  id: string;
  name: string;
  status: GameStatus;
  description: string;
  nextEvent: string;
  isHost: boolean;
  eventDate?: string | null;
  recipient?: DashboardRecipient;
};

export type DashboardData = {
  greeting: string;
  games: DashboardGame[];
};

const statusCopy: Record<GameStatus, string> = {
  "pre-draw": "Names haven't been drawn yet. You'll be matched as soon as the host kicks things off.",
  "in-progress": "Keep an eye on announcements and make sure your wishlist stays up to date.",
  complete:
    "This exchange is wrapped! Drop a thank-you note or upload your favorite photo from the reveal.",
};

export default function DashboardClient({ user }: { user: DashboardData }) {
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);

  const defaultGameId = user.games[0]?.id ?? null;
  const activeGameId =
    selectedGameId && user.games.some((game) => game.id === selectedGameId)
      ? selectedGameId
      : defaultGameId;

  const selectedGame = useMemo(
    () => user.games.find((game) => game.id === activeGameId),
    [activeGameId, user.games],
  );

  if (user.games.length === 0) {
    return (
      <section className="mt-8 rounded-3xl border border-green-100 bg-white/90 p-10 text-center text-green-900 shadow-xl shadow-red-100/50">
        <p className="text-xs font-semibold uppercase tracking-[0.5em] text-green-600">
          Ready when you are
        </p>
        <h2 className="mt-3 text-3xl font-black text-red-600">No games yet</h2>
        <p className="mt-2 text-sm text-green-800">
          Create a new exchange or use a join code from your host to get started.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <Link
            href="/games/create"
            className="inline-flex items-center rounded-full bg-red-600 px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-500"
          >
            Create a game
          </Link>
          <Link
            href="/join"
            className="inline-flex items-center rounded-full border border-green-700 px-6 py-2 text-sm font-semibold text-green-800 transition hover:border-red-500 hover:text-red-600"
          >
            Join a game
          </Link>
          <Link
            href="/profile"
            className="inline-flex items-center rounded-full bg-red-600 px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-500"
          >
            Edit profile
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-8 flex flex-1 flex-col gap-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.5em] text-green-600">
          Welcome back
        </p>
        <h2 className="mt-2 text-3xl font-bold text-green-950">{user.greeting}</h2>
        <p className="text-sm text-green-700">
          Track every exchange, see their status, and never miss a wishlist update.
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-6 rounded-3xl border border-green-100 bg-white text-green-950 shadow-xl shadow-red-100/40 sm:flex-row">
        <aside className="w-full border-b border-green-100 p-6 sm:w-2/5 sm:border-b-0 sm:border-r">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-green-500">
            Your games
          </p>
          <Link
            href="/games/create"
            className="mt-3 inline-flex items-center justify-center rounded-full border border-green-600 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-green-700 transition hover:border-red-500 hover:text-red-600"
          >
            + Create
          </Link>
          <div className="mt-4 flex flex-col gap-3">
            {user.games.map((game) => {
              const isActive = selectedGame?.id === game.id;
              return (
                <button
                  key={game.id}
                  type="button"
                  onClick={() => setSelectedGameId(game.id)}
                  className={`text-left transition ${
                    isActive
                      ? "rounded-2xl border border-red-100 bg-red-50/70 p-4 shadow-inner shadow-red-100"
                      : "rounded-2xl border border-transparent p-4 hover:border-green-100 hover:bg-green-50/80"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-lg font-semibold text-green-950">
                      {game.name}
                    </h3>
                    <StatusBadge status={game.status} compact />
                  </div>
                  <p className="mt-1 text-sm text-green-800">{game.description}</p>
                  {game.eventDate && (
                    <p className="mt-1 text-xs text-green-600">
                      Exchange on {formatEventDate(game.eventDate)}
                    </p>
                  )}
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.3em] text-green-500">
                    {game.nextEvent}
                  </p>
                  {game.isHost && (
                    <p className="mt-2 text-xs font-semibold text-red-600">
                      You&apos;re the host
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        </aside>
        <section className="flex flex-1 flex-col gap-6 p-6">
          {selectedGame ? (
            <>
              <div className="flex flex-col gap-4 border-b border-green-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.4em] text-green-500">
                    Game overview
                  </p>
                  <h3 className="text-2xl font-bold text-red-600">{selectedGame.name}</h3>
                  <p className="mt-1 text-sm text-green-800">
                    {selectedGame.description}
                  </p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.4em] text-green-500">
                    Next: {selectedGame.nextEvent}
                  </p>
                  {selectedGame.eventDate && (
                    <p className="mt-1 text-xs text-green-600">
                      Exchange on {formatEventDate(selectedGame.eventDate)}
                    </p>
                  )}
                </div>
                <StatusBadge status={selectedGame.status} />
              </div>

              {selectedGame.status === "in-progress" && selectedGame.recipient ? (
                <GiftAssignment recipient={selectedGame.recipient} />
              ) : (
                <div className="rounded-2xl border border-dashed border-green-200 bg-green-50/80 p-5 text-sm text-green-900">
                  {statusCopy[selectedGame.status]}
                </div>
              )}

              {selectedGame.isHost && (
                <Link
                  href={`/games/${selectedGame.id}/admin`}
                  className="inline-flex items-center justify-center rounded-full border border-red-200 bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-500"
                >
                  Open admin panel
                </Link>
              )}
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center rounded-2xl border border-dashed border-green-200 bg-green-50 p-8 text-center text-sm text-green-800">
              Pick a game from the left to see its details.
            </div>
          )}
        </section>
      </div>
    </section>
  );
}

function formatEventDate(value?: string | null) {
  if (!value) return "TBD";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.valueOf())) {
    return "TBD";
  }
  return parsed.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function StatusBadge({
  status,
  compact = false,
}: {
  status: GameStatus;
  compact?: boolean;
}) {
  const badgeCopy: Record<GameStatus, { label: string; className: string }> = {
    "pre-draw": {
      label: "Pre-draw",
      className: "border-green-200 bg-green-50 text-green-700",
    },
    "in-progress": {
      label: "In progress",
      className: "border-red-200 bg-red-50 text-red-600",
    },
    complete: {
      label: "Complete",
      className: "border-green-700 bg-green-700 text-white",
    },
  };

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border ${
        compact ? "px-2.5 py-0.5 text-[10px]" : "px-3 py-1 text-xs"
      } font-semibold uppercase tracking-[0.3em] ${badgeCopy[status].className}`}
    >
      {!compact && (
        <span
          className="inline-block h-2 w-2 rounded-full bg-current"
          aria-hidden
        />
      )}
      {badgeCopy[status].label}
    </span>
  );
}

function GiftAssignment({ recipient }: { recipient: DashboardRecipient }) {
  const hasWishlist = recipient.wishlist.length > 0;

  return (
    <div className="rounded-3xl border border-green-100 bg-green-900/5 p-6 shadow-inner shadow-green-100">
      <p className="text-xs font-semibold uppercase tracking-[0.5em] text-green-600">
        You are gifting
      </p>
      <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h4 className="text-3xl font-bold text-red-600">{recipient.name}</h4>
          <p className="mt-1 text-sm text-green-900">
            {hasWishlist
              ? "Here’s what they’re hoping to unwrap this year."
              : "They haven't shared a wishlist yet. Send a gentle reminder!"}
          </p>
        </div>
      </div>
      <div className="mt-6">
        <h5 className="text-xs font-semibold uppercase tracking-[0.4em] text-green-600">
          Wishlist
        </h5>
        {hasWishlist ? (
          <ul className="mt-3 list-disc space-y-2 pl-6 text-green-900">
            {recipient.wishlist.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 rounded-2xl bg-white/70 p-4 text-sm text-green-800">
            No wishlist items yet.
          </p>
        )}
      </div>
    </div>
  );
}

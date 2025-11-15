"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

type GameStatus = "pre-draw" | "in-progress" | "complete";

type GiftRecipient = {
  name: string;
  wishlist: string[];
  bio: string;
  wishlistNote?: string;
  favoriteTreat?: string;
};

type GamePanel = {
  id: string;
  name: string;
  status: GameStatus;
  description: string;
  nextEvent: string;
  isHost: boolean;
  recipient?: GiftRecipient;
};

type DashboardUser = {
  name: string;
  greeting: string;
  games: GamePanel[];
};

const demoUser: DashboardUser = {
  name: "Casey Rivera",
  greeting: "Happy gifting season, Casey!",
  games: [
    {
      id: "engineering-buddies",
      name: "Engineering Buddies",
      status: "in-progress",
      description: "Drop hints, submit wishlists, and surprise someone on Dec 18.",
      nextEvent: "Share your wish hints by Dec 8",
      isHost: false,
      recipient: {
        name: "Jordan Lee",
        bio: "Weekend hike lover, analog photography nerd, and always experimenting with coffee beans.",
        wishlist: [
          "Pour-over coffee kit",
          "Cozy wool beanie",
          "Indie sci-fi paperback",
        ],
        wishlistNote: "Prefers sustainable or second-hand finds when possible.",
        favoriteTreat: "Single-origin chocolate",
      },
    },
    {
      id: "founders-circle",
      name: "Founders Circle",
      status: "pre-draw",
      description: "Invites close on Nov 30—draw happens automatically right after.",
      nextEvent: "Drawing names on Dec 1",
      isHost: true,
    },
    {
      id: "family-2025",
      name: "Family 2025",
      status: "complete",
      description: "Wrapped up last week—upload reaction photos if you have them!",
      nextEvent: "Share photos with the group",
      isHost: false,
    },
  ],
};

const statusCopy: Record<GameStatus, string> = {
  "pre-draw": "Names haven't been drawn yet. You'll be matched as soon as the host kicks things off.",
  "in-progress": "Keep an eye on announcements and make sure your wishlist stays up to date.",
  complete:
    "This exchange is wrapped! Drop a thank-you note or upload your favorite photo from the reveal.",
};

export default function Home() {
  const searchParams = useSearchParams();
  const previewMode = searchParams.get("view");
  const simulatedUser = previewMode === "dashboard" ? demoUser : null;
  const isLoggedIn = Boolean(simulatedUser);

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
            {isLoggedIn ? (
              <>
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
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="inline-flex items-center rounded-full border border-green-700 px-6 py-2 text-sm font-semibold text-green-800 transition hover:border-red-500 hover:text-red-600"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center rounded-full bg-red-600 px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-500"
                >
                  Create account
                </Link>
              </>
            )}
          </div>
        </header>

        {isLoggedIn && simulatedUser ? (
          <Dashboard user={simulatedUser} />
        ) : (
          <HeroSection />
        )}
      </div>
    </div>
  );
}

function HeroSection() {
  const highlightCards = [
    {
      title: "Share a link",
      copy: "Invite friends or teammates instantly and keep track of who's joined.",
    },
    {
      title: "Draw names",
      copy: "One click assigns everyone a recipient—no repeats, no spoilers.",
    },
    {
      title: "Track gifts",
      copy: "Collect wishlists, hints, and delivery notes all in one cozy dashboard.",
    },
  ];

  return (
    <section className="flex flex-1 flex-col items-center justify-center text-center">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.5em] text-green-600">
          The friendliest Secret Santa helper
        </p>
        <h2 className="mt-5 text-4xl font-black text-red-600 sm:text-5xl">
          Plan Secret Santa exchanges with a dash of holiday cheer.
        </h2>
        <p className="mt-4 text-lg text-green-900">
          Build your group, match gifters, and keep every wishlist organized.
          SantaBot 2K keeps things simple so you can focus on thoughtful gifts.
        </p>
      </div>
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link
          href="/login"
          className="inline-flex items-center rounded-full bg-red-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-red-200 transition hover:-translate-y-0.5 hover:bg-red-500"
        >
          Log in
        </Link>
        <Link
          href="/register"
          className="inline-flex items-center rounded-full border border-red-600 px-8 py-3 text-sm font-semibold text-red-600 bg-white transition hover:border-red-500 hover:text-red-500"
        >
          Create an account
        </Link>
        <Link
          href="/join"
          className="inline-flex items-center rounded-full border border-green-500 px-8 py-3 text-sm font-semibold text-green-700 bg-green-50 transition hover:bg-green-100"
        >
          Join a game
        </Link>
      </div>
      <div className="mt-12 grid w-full gap-5 text-left sm:grid-cols-3">
        {highlightCards.map((card) => (
          <div
            key={card.title}
            className="rounded-3xl border border-green-100 bg-white/80 p-6 shadow-sm shadow-red-100"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-green-600">
              Step
            </p>
            <h3 className="mt-2 text-xl font-semibold text-red-600">
              {card.title}
            </h3>
            <p className="mt-2 text-sm text-green-900">{card.copy}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Dashboard({ user }: { user: DashboardUser }) {
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedGameId && user.games.length > 0) {
      setSelectedGameId(user.games[0].id);
    }
  }, [selectedGameId, user.games]);

  const selectedGame = useMemo(
    () => user.games.find((game) => game.id === selectedGameId),
    [selectedGameId, user.games],
  );

  return (
    <section className="mt-8 flex flex-1 flex-col gap-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.5em] text-green-600">
          Welcome back
        </p>
        <h2 className="mt-2 text-3xl font-bold text-green-950">
          {user.greeting}
        </h2>
        <p className="text-sm text-green-700">
          Track every exchange, see their status, and never miss a wishlist update.
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-6 rounded-3xl border border-green-100 bg-white text-green-950 shadow-xl shadow-red-100/40 sm:flex-row">
        <aside className="w-full border-b border-green-100 p-6 sm:w-2/5 sm:border-b-0 sm:border-r">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-green-600">
              Your games
            </h3>
            <Link
              href="/games/new"
              className="text-xs font-semibold text-red-600 hover:text-red-500"
            >
              + New game
            </Link>
          </div>
          <div className="mt-5 flex flex-col gap-3">
            {user.games.length === 0 && (
              <div className="rounded-2xl border border-dashed border-green-200 bg-green-50/80 p-5 text-sm text-green-800">
                You have not joined any games yet. Tap &quot;Join a game&quot; to get started.
              </div>
            )}
            {user.games.map((game) => {
              const isActive = game.id === selectedGameId;
              return (
                <button
                  key={game.id}
                  type="button"
                  onClick={() => setSelectedGameId(game.id)}
                  className={`rounded-2xl border px-4 py-3 text-left transition ${
                    isActive
                      ? "border-green-700 bg-green-900/90 text-white shadow-lg shadow-green-200"
                      : "border-green-100 bg-green-50/40 text-green-900 hover:border-green-500 hover:bg-green-100"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold uppercase tracking-[0.3em]">
                      {game.name}
                    </p>
                    <StatusBadge status={game.status} compact />
                  </div>
                  <p className="mt-2 text-xs text-green-100 sm:text-sm">
                    {game.nextEvent}
                  </p>
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
                  <h3 className="text-2xl font-bold text-red-600">
                    {selectedGame.name}
                  </h3>
                  <p className="mt-1 text-sm text-green-800">
                    {selectedGame.description}
                  </p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.4em] text-green-500">
                    Next: {selectedGame.nextEvent}
                  </p>
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

function GiftAssignment({ recipient }: { recipient: GiftRecipient }) {
  return (
    <div className="rounded-3xl border border-green-100 bg-green-900/5 p-6 shadow-inner shadow-green-100">
      <p className="text-xs font-semibold uppercase tracking-[0.5em] text-green-600">
        You are gifting
      </p>
      <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h4 className="text-3xl font-bold text-red-600">{recipient.name}</h4>
          <p className="mt-1 text-sm text-green-900">{recipient.bio}</p>
        </div>
        <div className="rounded-full bg-red-600/10 px-4 py-2 text-sm font-semibold text-red-600">
          Favorite treat: {recipient.favoriteTreat ?? "Surprise them!"}
        </div>
      </div>
      <div className="mt-6">
        <h5 className="text-xs font-semibold uppercase tracking-[0.4em] text-green-600">
          Wishlist
        </h5>
        <ul className="mt-3 list-disc space-y-2 pl-6 text-green-900">
          {recipient.wishlist.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        {recipient.wishlistNote && (
          <p className="mt-4 rounded-2xl bg-white/70 p-4 text-sm text-green-800">
            {recipient.wishlistNote}
          </p>
        )}
      </div>
    </div>
  );
}

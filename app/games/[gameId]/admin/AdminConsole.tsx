"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type GameStatus = "pre-draw" | "in-progress";
type InviteStatus = "accepted" | "pending" | "bounced";

type Participant = {
  name: string;
  email: string;
};

type Invitee = {
  email: string;
  status: InviteStatus;
};

const demoParticipants: Participant[] = [
  { name: "Casey Rivera", email: "casey@santabot.dev" },
  { name: "Jordan Lee", email: "jordan@santabot.dev" },
  { name: "Morgan Patel", email: "morgan@santabot.dev" },
  { name: "Alex Scott", email: "alex@santabot.dev" },
];

const demoInvites: Invitee[] = [
  { email: "sammy@example.com", status: "accepted" },
  { email: "reese@example.com", status: "pending" },
  { email: "quinn@example.com", status: "bounced" },
];

export function AdminConsole({ gameId }: { gameId: string }) {
  const [gameStatus, setGameStatus] = useState<GameStatus>("pre-draw");
  const [participants] = useState<Participant[]>(demoParticipants);
  const [invitees, setInvitees] = useState<Invitee[]>(demoInvites);
  const [gameDate, setGameDate] = useState("2025-12-20T18:00");
  const [newEmail, setNewEmail] = useState("");

  const joinCode = useMemo(
    () => `${gameId?.slice(0, 4)?.toUpperCase() ?? "GAME"}-HOLIDAY`,
    [gameId],
  );

  const canInvite = gameStatus === "pre-draw";
  const totalAccepted = invitees.filter(
    (invite) => invite.status === "accepted",
  ).length;

  const handleCopy = () => {
    navigator.clipboard
      ?.writeText(joinCode)
      .then(() => alert("Join code copied!"))
      .catch(() => alert("Unable to copy code, please copy manually."));
  };

  const handleAddInvite = () => {
    if (!newEmail.trim()) return;
    setInvitees((prev) => [
      { email: newEmail.trim().toLowerCase(), status: "pending" },
      ...prev,
    ]);
    setNewEmail("");
  };

  const handleDrawNames = () => {
    setGameStatus("in-progress");
  };

  const handleDelete = () => {
    alert("In a real app this would delete the game. For now it's a stub.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-red-50 px-4 py-10 text-green-950">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-green-100 pb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.5em] text-green-600">
              Host console
            </p>
            <h1 className="text-4xl font-black text-red-600">
              Game admin · {gameId}
            </h1>
            <p className="text-sm text-green-800">
              Monitor members, manage invites, and kick off the drawing when
              you&apos;re ready. These actions are placeholders until the backend is
              wired up.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center rounded-full border border-green-600 px-6 py-2 text-sm font-semibold text-green-700 transition hover:border-red-500 hover:text-red-600"
          >
            Back to dashboard
          </Link>
        </header>

        <section className="grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-green-100 bg-white/90 p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-green-600">
              Status
            </p>
            <h2 className="mt-2 text-2xl font-bold text-red-600">
              {gameStatus === "pre-draw" ? "Pre-draw" : "In progress"}
            </h2>
            <p className="mt-2 text-sm text-green-800">
              {gameStatus === "pre-draw"
                ? "You can invite new players and review everyone before drawing."
                : "Drawing is complete. Invites are locked and players are gifting now."}
            </p>
            <button
              type="button"
              onClick={handleDrawNames}
              disabled={gameStatus === "in-progress"}
              className={`mt-5 inline-flex w-full items-center justify-center rounded-full px-4 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-white transition ${
                gameStatus === "in-progress"
                  ? "cursor-not-allowed bg-green-500/60"
                  : "bg-red-600 hover:bg-red-500"
              }`}
            >
              Draw names
            </button>
          </div>

          <div className="rounded-3xl border border-green-100 bg-white/90 p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-green-600">
              Game date
            </p>
            <input
              type="datetime-local"
              value={gameDate}
              onChange={(event) => setGameDate(event.target.value)}
              className="mt-3 w-full rounded-2xl border border-green-200 bg-green-50/70 px-4 py-3 text-sm text-green-900 focus:border-red-400 focus:outline-none"
              disabled={gameStatus === "in-progress"}
            />
            <p className="mt-2 text-xs text-green-700">
              {gameStatus === "in-progress"
                ? "Date is locked because the game already started."
                : "Set when gifts should be exchanged."}
            </p>
          </div>

          <div className="rounded-3xl border border-green-100 bg-white/90 p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-green-600">
              Danger zone
            </p>
            <p className="mt-2 text-sm text-green-800">
              Delete this game and remove all players. This cannot be undone in
              production, but is mocked here.
            </p>
            <button
              type="button"
              onClick={handleDelete}
              className="mt-4 inline-flex w-full items-center justify-center rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
            >
              Delete game
            </button>
          </div>
        </section>

        <section className="rounded-3xl border border-green-100 bg-white/95 p-6 shadow-lg shadow-red-100/40">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-green-100 pb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-green-600">
                Invite players
              </p>
              <h2 className="text-2xl font-bold text-red-600">
                Share the join code or send email invites
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-2xl border border-green-100 bg-green-50/70 px-4 py-2 text-sm font-mono tracking-[0.4em] text-green-900">
                {joinCode}
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center rounded-full border border-green-600 px-4 py-2 text-sm font-semibold text-green-700 transition hover:border-red-500 hover:text-red-600"
              >
                Copy
              </button>
            </div>
          </div>
          <div className="mt-5 flex flex-col gap-3 md:flex-row">
            <input
              type="email"
              placeholder="friend@example.com"
              value={newEmail}
              onChange={(event) => setNewEmail(event.target.value)}
              disabled={!canInvite}
              className="w-full rounded-2xl border border-green-200 bg-green-50/80 px-4 py-3 text-sm text-green-900 placeholder:text-green-600 focus:border-red-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
            />
            <button
              type="button"
              onClick={handleAddInvite}
              disabled={!canInvite}
              className={`rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white transition ${
                canInvite
                  ? "bg-red-600 hover:bg-red-500"
                  : "cursor-not-allowed bg-green-500/60"
              }`}
            >
              Invite
            </button>
          </div>
          {!canInvite && (
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.3em] text-red-600">
              Invites are locked once names are drawn.
            </p>
          )}
          <div className="mt-6 space-y-3">
            {invitees.map((invite) => (
              <div
                key={invite.email}
                className="flex flex-wrap items-center justify-between rounded-2xl border border-green-100 bg-green-50/60 px-4 py-3 text-sm text-green-900"
              >
                <span className="font-mono">{invite.email}</span>
                <InviteStatusBadge status={invite.status} />
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-green-100 bg-white/95 p-6 shadow-lg shadow-green-100/60">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-green-100 pb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-green-600">
                Participants
              </p>
              <h2 className="text-2xl font-bold text-red-600">
                {participants.length} joined · {totalAccepted} accepted invites
              </h2>
            </div>
            <p className="text-xs text-green-700">
              Export or sync soon — this is placeholder info.
            </p>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {participants.map((participant) => (
              <div
                key={participant.email}
                className="rounded-2xl border border-green-100 bg-green-50/60 p-4"
              >
                <p className="text-sm font-semibold text-green-900">
                  {participant.name}
                </p>
                <p className="text-xs font-mono text-green-700">
                  {participant.email}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function InviteStatusBadge({ status }: { status: InviteStatus }) {
  const colorMap: Record<InviteStatus, string> = {
    accepted: "bg-green-100 text-green-700 border-green-200",
    pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
    bounced: "bg-red-50 text-red-600 border-red-200",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] ${colorMap[status]}`}
    >
      {status}
    </span>
  );
}

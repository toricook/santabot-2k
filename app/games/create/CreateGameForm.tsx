"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { createGame } from "@/app/actions";

type CreateGameResult = Awaited<ReturnType<typeof createGame>>;
type Feedback = {
  type: "success" | "error";
  message: string;
};

export function CreateGameForm() {
  const defaultDate = useMemo(() => buildDefaultEventDate(), []);
  const [name, setName] = useState("Holiday Gift Exchange");
  const [eventDate, setEventDate] = useState(defaultDate);
  const [inviteInput, setInviteInput] = useState("");
  const inviteList = useMemo(() => parseInviteInput(inviteInput), [inviteInput]);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [shareDetails, setShareDetails] = useState<CreateGameResult | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);

    startTransition(async () => {
      try {
        const result = await createGame({
          name,
          eventDate,
          inviteEmails: inviteList,
        });
        setShareDetails(result);
        setFeedback({
          type: "success",
          message: `“${result.name}” is live! Share the code or email invites below.`,
        });
      } catch (error) {
        setFeedback({
          type: "error",
          message:
            error instanceof Error
              ? error.message
              : "We couldn’t create that game. Please try again.",
        });
      }
    });
  };

  const handleCopyCode = () => {
    if (!shareDetails) return;
    navigator.clipboard
      ?.writeText(shareDetails.joinCode)
      .then(() =>
        setFeedback({
          type: "success",
          message: "Join code copied to your clipboard.",
        }),
      )
      .catch(() =>
        setFeedback({
          type: "error",
          message: "Unable to copy join code. Copy it manually instead.",
        }),
      );
  };

  const handleComposeEmail = () => {
    if (!shareDetails || shareDetails.invitees.length === 0) {
      return;
    }
    const subject = encodeURIComponent(`You're invited to ${shareDetails.name}`);
    const friendlyDate = formatFriendlyDate(shareDetails.eventDate);
    const joinLink =
      typeof window !== "undefined" ? `${window.location.origin}/join` : "/join";
    const body = encodeURIComponent(
      `Hi there!\n\nYou're invited to ${shareDetails.name} on ${friendlyDate}.\n` +
        `Use join code ${shareDetails.joinCode} at ${joinLink} to accept.\n\nSee you soon!`,
    );
    const bcc = encodeURIComponent(shareDetails.invitees.join(","));
    window.location.href = `mailto:?bcc=${bcc}&subject=${subject}&body=${body}`;
  };

  return (
    <>
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-green-100 bg-white/95 p-6 shadow-inner shadow-red-50">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-green-600">
              Game name
            </p>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Office Secret Santa"
              className="mt-3 w-full rounded-2xl border border-green-200 bg-green-50/80 px-4 py-3 text-sm text-green-900 focus:border-red-400 focus:outline-none"
              required
            />
            <p className="mt-2 text-xs text-green-700">
              Pick something recognizable. Everyone invited sees this name.
            </p>
          </div>
          <div className="rounded-3xl border border-green-100 bg-white/95 p-6 shadow-inner shadow-red-50">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-green-600">
              Exchange date
            </p>
            <input
              type="datetime-local"
              value={eventDate}
              onChange={(event) => setEventDate(event.target.value)}
              className="mt-3 w-full rounded-2xl border border-green-200 bg-green-50/80 px-4 py-3 text-sm text-green-900 focus:border-red-400 focus:outline-none"
              required
            />
            <p className="mt-2 text-xs text-green-700">
              We use this to timeline reminders and the drawing schedule.
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-green-100 bg-white/95 p-6 shadow-inner shadow-red-50">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-green-600">
                Invite by email
              </p>
              <p className="text-sm text-green-800">
                Paste addresses separated by commas, spaces, or new lines. We’ll prep an invite for
                you.
              </p>
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-green-600">
              {inviteList.length} added
            </p>
          </div>
          <textarea
            value={inviteInput}
            onChange={(event) => setInviteInput(event.target.value)}
            placeholder="friend@example.com, teammate@example.com"
            rows={4}
            className="mt-4 w-full rounded-2xl border border-green-200 bg-green-50/80 px-4 py-3 text-sm text-green-900 focus:border-red-400 focus:outline-none"
          />
          {inviteList.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {inviteList.map((email) => (
                <span
                  key={email}
                  className="inline-flex items-center rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold text-green-800"
                >
                  {email}
                </span>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-xs text-green-700">
              No emails to send yet? You can still share the join code after creating your game.
            </p>
          )}
        </div>

        {feedback && (
          <p
            className={`rounded-2xl px-4 py-3 text-sm font-semibold ${
              feedback.type === "success"
                ? "bg-green-50/90 text-green-800"
                : "bg-red-50 text-red-700"
            }`}
          >
            {feedback.message}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex w-full items-center justify-center rounded-full bg-red-600 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white shadow-sm transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isPending ? "Creating..." : "Create game"}
        </button>
      </form>

      {shareDetails && (
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-green-100 bg-white/95 p-6 shadow-lg shadow-red-100/40">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-green-600">
              Share join code
            </p>
            <p className="mt-2 text-sm text-green-800">
              Send this to anyone who prefers joining manually. The code never expires.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <div className="rounded-2xl border border-green-100 bg-green-50/70 px-4 py-2 text-lg font-mono tracking-[0.4em] text-green-900">
                {shareDetails.joinCode}
              </div>
              <button
                type="button"
                onClick={handleCopyCode}
                className="inline-flex items-center rounded-full border border-green-600 px-4 py-2 text-sm font-semibold text-green-700 transition hover:border-red-500 hover:text-red-600"
              >
                Copy
              </button>
            </div>
            <Link
              href={`/games/${shareDetails.gameId}/admin`}
              className="mt-5 inline-flex w-full items-center justify-center rounded-full border border-red-200 bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-500"
            >
              Open admin panel
            </Link>
          </div>

          <div className="rounded-3xl border border-green-100 bg-white/95 p-6 shadow-lg shadow-green-100/40">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-green-600">
              Send email invites
            </p>
            {shareDetails.invitees.length > 0 ? (
              <>
                <p className="mt-2 text-sm text-green-800">
                  We’ll open your default email client with everyone BCC’d and the join instructions
                  filled in.
                </p>
                <button
                  type="button"
                  onClick={handleComposeEmail}
                  className="mt-4 inline-flex w-full items-center justify-center rounded-full border border-green-600 px-4 py-2 text-sm font-semibold text-green-700 transition hover:border-red-500 hover:text-red-600"
                >
                  Compose invites
                </button>
                <div className="mt-4 space-y-2 rounded-2xl border border-green-100 bg-green-50/70 p-4 text-xs text-green-800">
                  {shareDetails.invitees.map((email) => (
                    <p key={email}>{email}</p>
                  ))}
                </div>
              </>
            ) : (
              <p className="mt-2 text-sm text-green-800">
                No emails provided. Copy the join code instead or add addresses above and save again.
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function parseInviteInput(raw: string) {
  return Array.from(
    new Set(
      raw
        .split(/[\s,]+/)
        .map((value) => value.trim().toLowerCase())
        .filter(Boolean),
    ),
  );
}

function buildDefaultEventDate() {
  const now = new Date();
  const target = new Date(now.getFullYear(), 11, 20, 18, 0);
  if (target.valueOf() <= now.valueOf()) {
    target.setFullYear(target.getFullYear() + 1);
  }
  return toDatetimeLocal(target);
}

function toDatetimeLocal(date: Date) {
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
}

function formatFriendlyDate(value: string | null | undefined) {
  if (!value) {
    return "the exchange date you set";
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.valueOf())) {
    return "the exchange date you set";
  }
  return parsed.toLocaleString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

"use client";

import { useState, useTransition } from "react";
import { joinGame } from "@/app/actions";

export function JoinGameForm() {
  const [code, setCode] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);
    setError(null);

    startTransition(async () => {
      try {
        const result = await joinGame(code);
        setFeedback(`You're in! Welcome to ${result.gameName}.`);
        setCode("");
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "We couldn't join that game. Please try again.",
        );
      }
    });
  };

  return (
    <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-[0.4em] text-green-600">
          Game code
        </label>
        <input
          type="text"
          value={code}
          onChange={(event) => setCode(event.target.value)}
          placeholder="e.g. 1A2B-HOLIDAY"
          className="w-full rounded-2xl border border-green-200 bg-green-50/80 px-4 py-3 text-lg font-semibold tracking-[0.3em] text-green-900 placeholder:text-green-500 focus:border-red-400 focus:outline-none"
          required
        />
      </div>
      <p className="text-xs text-green-700">
        Codes are not case-sensitive. If you don&apos;t have one yet, ask your host for
        their invite link or share your Clerk email with them.
      </p>
      {feedback && (
        <p className="rounded-2xl bg-green-50/90 px-4 py-3 text-sm font-semibold text-green-800">
          {feedback}
        </p>
      )}
      {error && (
        <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={isPending}
        className="inline-flex w-full items-center justify-center rounded-full bg-red-600 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white shadow-sm transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? "Joining..." : "Join game"}
      </button>
    </form>
  );
}

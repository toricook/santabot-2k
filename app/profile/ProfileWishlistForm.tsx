"use client";

import { useState, useTransition } from "react";
import { updateWishlist } from "@/app/actions";

type ProfileWishlistFormProps = {
  initialWishlist: string;
};

export function ProfileWishlistForm({ initialWishlist }: ProfileWishlistFormProps) {
  const [wishlist, setWishlist] = useState(initialWishlist);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);
    setError(null);

    startTransition(async () => {
      try {
        await updateWishlist(wishlist);
        setFeedback("Wishlist saved! Players in your games will see the update.");
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Something went wrong saving your wishlist.",
        );
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col rounded-3xl border border-green-100 bg-green-50/60 p-6 text-green-900 shadow-inner shadow-red-50"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.5em] text-green-600">
        Wishlist notes
      </p>
      <h2 className="mt-1 text-2xl font-bold text-red-600">Share gifting hints</h2>
      <p className="mt-2 text-sm text-green-800">
        Add clothing sizes, favorite treats, or links. Your Santas use this to plan the perfect
        surprise.
      </p>
      <label className="mt-6 text-xs font-semibold uppercase tracking-[0.4em] text-green-600">
        Wishlist
      </label>
      <textarea
        value={wishlist}
        onChange={(event) => setWishlist(event.target.value)}
        rows={8}
        className="mt-2 w-full rounded-2xl border border-green-200 bg-white/80 px-4 py-3 text-sm text-green-900 placeholder:text-green-600 focus:border-red-400 focus:outline-none"
        placeholder="- Cozy socks\n- Favorite roast coffee\n- Something handmade"
      />
      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-green-700">
        <span>Markdown friendly -- add bullet points or simple lists.</span>
        {feedback && <span className="font-semibold text-green-700">{feedback}</span>}
        {error && <span className="font-semibold text-red-600">{error}</span>}
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="mt-6 inline-flex items-center justify-center rounded-full bg-red-600 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white shadow-sm transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? "Saving..." : "Save wishlist"}
      </button>
    </form>
  );
}

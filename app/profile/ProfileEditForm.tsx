"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { saveProfile } from "@/app/actions";
import type { ProfileRecord } from "@/lib/profile";

type ProfileEditFormProps = {
  initialProfile: ProfileRecord | null;
};

export function ProfileEditForm({ initialProfile }: ProfileEditFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initialProfile?.name ?? "");
  const [age, setAge] = useState(initialProfile ? String(initialProfile.age) : "");
  const [favoriteColors, setFavoriteColors] = useState(
    initialProfile?.favoriteColors ?? "",
  );
  const [interests, setInterests] = useState(initialProfile?.interests ?? "");
  const [wishlist, setWishlist] = useState(initialProfile?.wishlist ?? "");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);
    setError(null);

    startTransition(async () => {
      try {
        await saveProfile({
          name,
          age,
          favoriteColors,
          interests,
          wishlist,
        });
        setFeedback("Profile saved! Redirecting…");
        router.push("/profile");
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Unable to save profile right now.",
        );
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="text-xs font-semibold uppercase tracking-[0.4em] text-green-600">
          Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="mt-2 w-full rounded-2xl border border-green-200 bg-white/90 px-4 py-3 text-sm text-green-900 placeholder:text-green-500 focus:border-red-400 focus:outline-none"
          placeholder="Add your display name"
        />
      </div>
      <div>
        <label className="text-xs font-semibold uppercase tracking-[0.4em] text-green-600">
          Age
        </label>
        <input
          type="number"
          value={age}
          onChange={(event) => setAge(event.target.value)}
          min={0}
          max={120}
          className="mt-2 w-full rounded-2xl border border-green-200 bg-white/90 px-4 py-3 text-sm text-green-900 placeholder:text-green-500 focus:border-red-400 focus:outline-none"
          placeholder="Add your age"
        />
      </div>
      <div>
        <label className="text-xs font-semibold uppercase tracking-[0.4em] text-green-600">
          Favorite color(s)
        </label>
        <input
          type="text"
          value={favoriteColors}
          onChange={(event) => setFavoriteColors(event.target.value)}
          className="mt-2 w-full rounded-2xl border border-green-200 bg-white/90 px-4 py-3 text-sm text-green-900 placeholder:text-green-500 focus:border-red-400 focus:outline-none"
          placeholder="Ruby red, forest green..."
        />
      </div>
      <div>
        <label className="text-xs font-semibold uppercase tracking-[0.4em] text-green-600">
          Interests
        </label>
        <textarea
          value={interests}
          onChange={(event) => setInterests(event.target.value)}
          rows={3}
          className="mt-2 w-full rounded-2xl border border-green-200 bg-white/90 px-4 py-3 text-sm text-green-900 placeholder:text-green-500 focus:border-red-400 focus:outline-none"
          placeholder="Crafting winter candles, baking pies..."
        />
      </div>
      <div>
        <label className="text-xs font-semibold uppercase tracking-[0.4em] text-green-600">
          Wishlist
        </label>
        <textarea
          value={wishlist}
          onChange={(event) => setWishlist(event.target.value)}
          rows={4}
          className="mt-2 w-full rounded-2xl border border-green-200 bg-white/90 px-4 py-3 text-sm text-green-900 placeholder:text-green-500 focus:border-red-400 focus:outline-none"
          placeholder="- Cozy socks\n- Pour-over kit\n- Handmade ornaments"
        />
      </div>

      {(feedback || error) && (
        <p
          className={`text-sm ${
            feedback ? "text-green-700" : "text-red-600"
          }`}
        >
          {feedback ?? error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex items-center rounded-full bg-red-600 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white shadow-sm transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? "Saving..." : "Save profile"}
      </button>
    </form>
  );
}

import Link from "next/link";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 via-white to-green-50 px-4 py-12 text-green-950">
      <div className="mx-auto max-w-2xl rounded-3xl border border-green-100 bg-white/90 p-8 shadow-xl shadow-red-100/40">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-green-100 pb-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.5em] text-green-600">
              Your profile
            </p>
            <h1 className="mt-1 text-3xl font-bold text-red-600">Edit details</h1>
            <p className="text-sm text-green-800">
              Update your wishlist and the basics other players can see.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center rounded-full border border-green-600 px-5 py-2 text-sm font-semibold text-green-700 transition hover:border-red-500 hover:text-red-600"
          >
            Back to dashboard
          </Link>
        </div>

        <form className="mt-8 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.4em] text-green-600">
              Display name
            </label>
            <input
              type="text"
              placeholder="Add the name other players should see"
              className="w-full rounded-2xl border border-green-200 bg-green-50/60 px-4 py-3 text-sm text-green-900 placeholder:text-green-600 focus:border-red-400 focus:outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.4em] text-green-600">
              Wishlist
            </label>
            <textarea
              placeholder="List a few gift ideas, sizes, or stores you love."
              rows={4}
              className="w-full rounded-2xl border border-green-200 bg-green-50/60 px-4 py-3 text-sm text-green-900 placeholder:text-green-600 focus:border-red-400 focus:outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.4em] text-green-600">
              Shipping notes
            </label>
            <textarea
              placeholder="Add delivery instructions or preferred pickup spots."
              rows={3}
              className="w-full rounded-2xl border border-green-200 bg-green-50/60 px-4 py-3 text-sm text-green-900 placeholder:text-green-600 focus:border-red-400 focus:outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.4em] text-green-600">
              Favorite treats
            </label>
            <input
              type="text"
              placeholder="Coffee order, snacks, or anything that feels festive."
              className="w-full rounded-2xl border border-green-200 bg-green-50/60 px-4 py-3 text-sm text-green-900 placeholder:text-green-600 focus:border-red-400 focus:outline-none"
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-green-700">
              We&apos;ll show your updates to the games you&apos;re part of.
            </p>
            <button
              type="button"
              className="inline-flex items-center rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-500"
            >
              Save profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

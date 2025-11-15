import Link from "next/link";

export default function JoinGamePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-red-50 px-4 py-12 text-green-950">
      <div className="mx-auto max-w-xl rounded-3xl border border-green-100 bg-white/90 p-8 shadow-xl shadow-red-100/50">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-green-100 pb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.5em] text-green-600">
              Join a game
            </p>
            <h1 className="mt-1 text-3xl font-extrabold text-red-600">
              Enter your invite code
            </h1>
            <p className="text-sm text-green-800">
              Your host should have shared a short code. Enter it below to jump
              into the exchange.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center rounded-full border border-green-600 px-5 py-2 text-sm font-semibold text-green-700 transition hover:border-red-500 hover:text-red-600"
          >
            Back home
          </Link>
        </div>

        <form className="mt-8 space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.4em] text-green-600">
              Game code
            </label>
            <input
              type="text"
              placeholder="e.g. HOLIDAY2025"
              className="w-full rounded-2xl border border-green-200 bg-green-50/80 px-4 py-3 text-lg font-semibold tracking-[0.3em] text-green-900 placeholder:text-green-500 focus:border-red-400 focus:outline-none"
            />
          </div>
          <p className="text-xs text-green-700">
            Codes are not case-sensitive. If you don&apos;t have one yet, ask
            your host to send their invite link.
          </p>
          <button
            type="button"
            className="inline-flex w-full items-center justify-center rounded-full bg-red-600 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white shadow-sm transition hover:bg-red-500"
          >
            Join game
          </button>
        </form>
      </div>
    </div>
  );
}

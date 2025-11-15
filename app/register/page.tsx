import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 via-white to-green-50 px-4 py-12 text-green-950">
      <div className="mx-auto flex max-w-4xl flex-col gap-6 rounded-3xl border border-green-100 bg-white/90 p-8 shadow-xl shadow-red-100/50 lg:flex-row">
        <section className="flex-1 border-b border-green-100 pb-6 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-8">
          <p className="text-xs font-semibold uppercase tracking-[0.5em] text-green-600">
            Start gifting
          </p>
          <h1 className="mt-1 text-3xl font-black text-red-600">
            Create your SantaBot account
          </h1>
          <p className="mt-2 text-sm text-green-800">
            Build games, invite friends, and keep wishlists organized. We&apos;ll plug
            in Clerk for the actual auth flow soon, but here&apos;s the layout.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-green-900">
            <li className="rounded-2xl border border-green-100 bg-green-50/80 p-4">
              Track multiple exchanges from one dashboard.
            </li>
            <li className="rounded-2xl border border-green-100 bg-green-50/80 p-4">
              Share wishlists and gifting notes with your group.
            </li>
            <li className="rounded-2xl border border-green-100 bg-green-50/80 p-4">
              Hosts get an admin panel to run drawings and reminders.
            </li>
          </ul>
          <div className="mt-6 text-sm text-green-800">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-red-600 hover:text-red-500"
            >
              Log in instead
            </Link>
            .
          </div>
        </section>

        <section className="flex-1">
          <form className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.4em] text-green-600">
                Full name
              </label>
              <input
                type="text"
                placeholder="Casey Rivera"
                className="w-full rounded-2xl border border-green-200 bg-green-50/70 px-4 py-3 text-sm text-green-900 placeholder:text-green-600 focus:border-red-400 focus:outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.4em] text-green-600">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-2xl border border-green-200 bg-green-50/70 px-4 py-3 text-sm text-green-900 placeholder:text-green-600 focus:border-red-400 focus:outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.4em] text-green-600">
                Password
              </label>
              <input
                type="password"
                placeholder="Create a secure password"
                className="w-full rounded-2xl border border-green-200 bg-green-50/70 px-4 py-3 text-sm text-green-900 placeholder:text-green-600 focus:border-red-400 focus:outline-none"
              />
            </div>
            <div className="flex items-start gap-3 text-xs text-green-800">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-green-400 text-red-600 focus:ring-red-500"
              />
              <span>
                I agree to keep things festive and follow the community rules.
              </span>
            </div>
            <button
              type="button"
              className="inline-flex w-full items-center justify-center rounded-full bg-red-600 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white shadow-sm transition hover:bg-red-500"
            >
              Create account
            </button>
          </form>
          <p className="mt-4 text-center text-xs text-green-700">
            Once Clerk is wired up, swap this form for their SignUp component.
          </p>
        </section>
      </div>
    </div>
  );
}

import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-red-50 px-4 py-12 text-green-950">
      <div className="mx-auto flex max-w-4xl flex-col gap-6 rounded-3xl border border-green-100 bg-white/90 p-8 shadow-xl shadow-red-100/50 lg:flex-row">
        <section className="flex-1 border-b border-green-100 pb-6 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-8">
          <p className="text-xs font-semibold uppercase tracking-[0.5em] text-green-600">
            Welcome back
          </p>
          <h1 className="mt-1 text-3xl font-black text-red-600">
            Log in to SantaBot 2K
          </h1>
          <p className="mt-2 text-sm text-green-800">
            Pick up where you left off. You can see your game updates, wishlists,
            and gift matches right after signing in.
          </p>
          <div className="mt-8 space-y-4 text-sm text-green-800">
            <p className="rounded-2xl bg-green-50/80 p-4">
              Using social login or Clerk magic links? We&apos;ll plug those in once the
              integration is ready. For now, this form is a visual placeholder.
            </p>
            <p>
              Need to create an account instead?{" "}
              <Link
                href="/register"
                className="font-semibold text-red-600 hover:text-red-500"
              >
                Head over to registration
              </Link>
              .
            </p>
          </div>
        </section>

        <section className="flex-1">
          <form className="space-y-5">
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
                placeholder="••••••••"
                className="w-full rounded-2xl border border-green-200 bg-green-50/70 px-4 py-3 text-sm text-green-900 placeholder:text-green-600 focus:border-red-400 focus:outline-none"
              />
            </div>
            <div className="flex items-center justify-between text-xs text-green-700">
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-green-400 text-red-600 focus:ring-red-500"
                />
                Remember me
              </label>
              <button
                type="button"
                className="font-semibold text-red-600 hover:text-red-500"
              >
                Forgot password?
              </button>
            </div>
            <button
              type="button"
              className="inline-flex w-full items-center justify-center rounded-full bg-red-600 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white shadow-sm transition hover:bg-red-500"
            >
              Log in
            </button>
          </form>
          <p className="mt-4 text-center text-xs text-green-700">
            We&apos;ll hook this up to Clerk soon. Feel free to adjust styling or copy now.
          </p>
        </section>
      </div>
    </div>
  );
}

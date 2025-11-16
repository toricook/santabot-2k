import Link from "next/link";
import { SignIn } from "@clerk/nextjs";

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
          <div className="rounded-3xl border border-green-100 bg-white/80 p-4 shadow-inner shadow-green-100">
            <SignIn routing="path" path="/login" />
          </div>
        </section>
      </div>
    </div>
  );
}

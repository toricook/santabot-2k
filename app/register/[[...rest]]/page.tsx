import Link from "next/link";
import { SignUp } from "@clerk/nextjs";

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
            Build games, invite friends, and keep wishlists organized. Clerk handles
            the secure authentication so you can focus on the fun.
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
          <div className="rounded-3xl border border-green-100 bg-white/80 p-4 shadow-inner shadow-green-100">
            <SignUp routing="path" path="/register" />
          </div>
        </section>
      </div>
    </div>
  );
}

import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { UserProfile } from "@clerk/nextjs";

export default async function AccountSettingsPage() {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 via-white to-green-50 px-4 py-12 text-green-950">
      <div className="mx-auto max-w-4xl rounded-3xl border border-green-100 bg-white/90 p-8 shadow-xl shadow-red-100/40">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-green-100 pb-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.5em] text-green-600">
              Account settings
            </p>
            <h1 className="mt-1 text-3xl font-bold text-red-600">Manage login & security</h1>
            <p className="text-sm text-green-800">
              Update your email, password, and connected accounts via Clerk.
            </p>
          </div>
          <Link
            href="/profile"
            className="inline-flex items-center rounded-full border border-green-600 px-5 py-2 text-sm font-semibold text-green-700 transition hover:border-red-500 hover:text-red-600"
          >
            Back to profile
          </Link>
        </div>

        <div className="mt-8 rounded-3xl border border-green-100 bg-white/95 p-0 shadow-inner shadow-red-50">
          <UserProfile
            path="/account"
            routing="path"
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "shadow-none bg-transparent border-0 p-0",
                scrollBox: "rounded-3xl border border-green-100 p-6",
                footer: "hidden",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}

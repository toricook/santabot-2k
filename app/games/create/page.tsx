import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CreateGameForm } from "@/app/games/create/CreateGameForm";

export default async function CreateGamePage() {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-red-50 px-4 py-12 text-green-950">
      <div className="mx-auto max-w-5xl rounded-3xl border border-green-100 bg-white/95 p-8 shadow-xl shadow-red-100/50">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-green-100 pb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.5em] text-green-600">
              Host a game
            </p>
            <h1 className="mt-1 text-3xl font-extrabold text-red-600">
              Plan your Secret Santa
            </h1>
            <p className="text-sm text-green-800">
              Name the exchange, schedule the swap, and send invites by shareable code or email.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center rounded-full border border-green-600 px-5 py-2 text-sm font-semibold text-green-700 transition hover:border-red-500 hover:text-red-600"
          >
            Back to dashboard
          </Link>
        </div>

        <CreateGameForm />
      </div>
    </div>
  );
}

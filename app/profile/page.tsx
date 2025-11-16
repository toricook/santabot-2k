import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getProfileByUserId } from "@/lib/profile";

export default async function ProfilePage() {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/login");
  }

  const profile = await getProfileByUserId(userId);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-red-50 px-4 py-12 text-green-950">
      <div className="mx-auto max-w-4xl rounded-3xl border border-green-100 bg-white/90 p-8 shadow-xl shadow-red-100/40">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-green-100 pb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.5em] text-green-600">
              Your profile
            </p>
            <h1 className="mt-1 text-3xl font-bold text-red-600">Holiday snapshot</h1>
            <p className="text-sm text-green-800">
              Share a quick snapshot so Santas know your favorites before they shop.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-flex items-center rounded-full border border-green-600 px-5 py-2 text-sm font-semibold text-green-700 transition hover:border-red-500 hover:text-red-600"
            >
              Back to dashboard
            </Link>
            <Link
              href="/account"
              className="inline-flex items-center rounded-full border border-green-600 px-5 py-2 text-sm font-semibold text-green-700 transition hover:border-red-500 hover:text-red-600"
            >
              Account settings
            </Link>
            <Link
              href="/profile/edit"
              className="inline-flex items-center rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-500"
            >
              Edit profile
            </Link>
          </div>
        </header>

        {profile ? (
          <section className="mt-8 space-y-6">
            <ProfileField label="Name" value={profile.name} />
            <ProfileField label="Age" value={`${profile.age}`} />
            <ProfileField label="Favorite color(s)" value={profile.favoriteColors} />
            <ProfileField label="Interests" value={profile.interests} multiline />
            <ProfileField label="Wishlist" value={profile.wishlist} multiline />
            <p className="text-right text-xs text-green-600">
              Updated {profile.updatedAt?.toLocaleDateString() ?? "recently"}
            </p>
          </section>
        ) : (
          <section className="mt-10 rounded-3xl border border-dashed border-green-200 bg-green-50/80 p-8 text-center text-sm text-green-800">
            <p>
              You haven&apos;t shared your profile details yet. Fill them out so your next Santa
              knows exactly what will make you smile.
            </p>
            <Link
              href="/profile/edit"
              className="mt-4 inline-flex items-center rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-500"
            >
              Add your details
            </Link>
          </section>
        )}
      </div>
    </div>
  );
}

function ProfileField({
  label,
  value,
  multiline,
}: {
  label: string;
  value: string;
  multiline?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-green-100 bg-green-50/70 p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.4em] text-green-600">
        {label}
      </p>
      {multiline ? (
        <p className="mt-2 whitespace-pre-line text-sm text-green-900">{value}</p>
      ) : (
        <p className="mt-2 text-sm text-green-900">{value}</p>
      )}
    </div>
  );
}

import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ProfileEditForm } from "@/app/profile/ProfileEditForm";
import { getProfileByUserId } from "@/lib/profile";

export default async function EditProfilePage() {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/login");
  }

  const profile = await getProfileByUserId(userId);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-red-50 px-4 py-12 text-green-950">
      <div className="mx-auto max-w-3xl rounded-3xl border border-green-100 bg-white/90 p-8 shadow-xl shadow-red-100/40">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-green-100 pb-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.5em] text-green-600">
              Edit profile
            </p>
            <h1 className="mt-1 text-3xl font-bold text-red-600">Keep things festive</h1>
            <p className="text-sm text-green-800">
              Update your favorites so Santas always capture your style.
            </p>
          </div>
          <Link
            href="/profile"
            className="inline-flex items-center rounded-full border border-green-600 px-5 py-2 text-sm font-semibold text-green-700 transition hover:border-red-500 hover:text-red-600"
          >
            Back to profile
          </Link>
        </div>

        <div className="mt-8">
          <ProfileEditForm initialProfile={profile ?? null} />
        </div>
      </div>
    </div>
  );
}

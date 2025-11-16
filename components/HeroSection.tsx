"use client";

import Link from "next/link";

const highlightCards = [
  {
    title: "Share a link",
    copy: "Invite friends or teammates instantly and keep track of who's joined.",
  },
  {
    title: "Draw names",
    copy: "One click assigns everyone a recipient--no repeats, no spoilers.",
  },
  {
    title: "Track gifts",
    copy: "Collect wishlists, hints, and delivery notes all in one cozy dashboard.",
  },
];

export default function HeroSection() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-red-50 text-green-950">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-8 sm:px-6 lg:px-10">
        <header className="flex flex-col gap-4 border-b border-green-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.6em] text-green-600">
              Secret Santa
            </p>
            <h1 className="text-4xl font-black text-red-600 sm:text-5xl">
              SantaBot 2K
            </h1>
            <p className="mt-1 text-sm text-green-700">
              Run warm, thoughtful exchanges without spreadsheets.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/login"
              className="inline-flex items-center rounded-full border border-green-700 px-6 py-2 text-sm font-semibold text-green-800 transition hover:border-red-500 hover:text-red-600"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center rounded-full bg-red-600 px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-500"
            >
              Create account
            </Link>
          </div>
        </header>

        <section className="flex flex-1 flex-col items-center justify-center text-center">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.5em] text-green-600">
              The friendliest Secret Santa helper
            </p>
            <h2 className="mt-5 text-4xl font-black text-red-600 sm:text-5xl">
              Plan Secret Santa exchanges with a dash of holiday cheer.
            </h2>
            <p className="mt-4 text-lg text-green-900">
              Build your group, match gifters, and keep every wishlist organized.
              SantaBot 2K keeps things simple so you can focus on thoughtful gifts.
            </p>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/login"
              className="inline-flex items-center rounded-full bg-red-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-red-200 transition hover:-translate-y-0.5 hover:bg-red-500"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center rounded-full border border-red-600 bg-white px-8 py-3 text-sm font-semibold text-red-600 transition hover:border-red-500 hover:text-red-500"
            >
              Create an account
            </Link>
            <Link
              href="/join"
              className="inline-flex items-center rounded-full border border-green-500 bg-green-50 px-8 py-3 text-sm font-semibold text-green-700 transition hover:bg-green-100"
            >
              Join a game
            </Link>
          </div>
          <div className="mt-12 grid w-full gap-5 text-left sm:grid-cols-3">
            {highlightCards.map((card) => (
              <div
                key={card.title}
                className="rounded-3xl border border-green-100 bg-white/80 p-6 shadow-sm shadow-red-100"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-green-600">
                  Step
                </p>
                <h3 className="mt-2 text-xl font-semibold text-red-600">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm text-green-900">{card.copy}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

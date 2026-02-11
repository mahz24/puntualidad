"use client";

import { signIn } from "next-auth/react";

export function ErrorBanner() {
  return (
    <div className="mx-auto max-w-md rounded-xl bg-red-500/20 p-6 text-center backdrop-blur-sm">
      <p className="mb-4 text-lg text-white">
        Your session has expired. Please sign in again to reconnect your
        calendar.
      </p>
      <button
        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        className="rounded-full bg-white px-6 py-2 font-semibold text-gray-800 transition hover:scale-105"
      >
        Re-authenticate
      </button>
    </div>
  );
}

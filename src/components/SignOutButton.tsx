"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="rounded-full border border-white/30 px-6 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
    >
      Sign out
    </button>
  );
}

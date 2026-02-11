import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { SignInButton } from "@/components/SignInButton";

export default async function LandingPage() {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="space-y-8 text-center">
        <h1 className="text-5xl font-bold text-white md:text-7xl">
          Puntualidad
        </h1>
        <p className="text-xl text-white/70 md:text-2xl">
          Never miss a meeting again
        </p>
        <SignInButton />
      </div>
    </main>
  );
}

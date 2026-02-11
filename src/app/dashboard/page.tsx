import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { CountdownDisplay } from "@/components/CountdownDisplay";
import { SignOutButton } from "@/components/SignOutButton";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="absolute right-6 top-6">
        <SignOutButton />
      </div>
      <CountdownDisplay />
    </main>
  );
}

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getNextMeeting } from "@/lib/google-calendar";
import { NextEventResponse } from "@/lib/types";

export async function GET() {
  const session = await auth();

  if (!session?.accessToken) {
    return NextResponse.json<NextEventResponse>(
      { event: null, error: "Not authenticated" },
      { status: 401 }
    );
  }

  if (session.error === "RefreshTokenError") {
    return NextResponse.json<NextEventResponse>(
      { event: null, error: "RefreshTokenError" },
      { status: 401 }
    );
  }

  try {
    const event = await getNextMeeting(session.accessToken);
    return NextResponse.json<NextEventResponse>({ event });
  } catch (error) {
    console.error("Calendar API error:", error);
    return NextResponse.json<NextEventResponse>(
      { event: null, error: "Failed to fetch calendar events" },
      { status: 502 }
    );
  }
}

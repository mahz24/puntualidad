import { CalendarEvent } from "./types";

const CALENDAR_API_BASE =
  "https://www.googleapis.com/calendar/v3/calendars/primary/events";

export async function getNextMeeting(
  accessToken: string
): Promise<CalendarEvent | null> {
  const now = new Date().toISOString();

  const params = new URLSearchParams({
    timeMin: now,
    maxResults: "10",
    singleEvents: "true",
    orderBy: "startTime",
  });

  const response = await fetch(`${CALENDAR_API_BASE}?${params}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Google Calendar API error: ${response.status}`);
  }

  const data = await response.json();
  const events: CalendarEvent[] = data.items ?? [];

  const nowMs = Date.now();

  // Find the first future event that:
  // - Has a specific start time (not all-day)
  // - Is not cancelled
  // - Hasn't already started
  const nextEvent = events.find((event) => {
    if (event.status === "cancelled") return false;
    if (!event.start?.dateTime) return false;
    const startMs = new Date(event.start.dateTime).getTime();
    return startMs > nowMs;
  });

  return nextEvent ?? null;
}

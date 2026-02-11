"use client";

import { useState, useEffect, useCallback } from "react";
import { useCountdown } from "@/hooks/useCountdown";
import { MeetingDetails } from "@/components/MeetingDetails";
import { ErrorBanner } from "@/components/ErrorBanner";
import { CalendarEvent } from "@/lib/types";

const POLL_INTERVAL = 5 * 60 * 1000; // 5 minutes

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

export function CountdownDisplay() {
  const [event, setEvent] = useState<CalendarEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);

  const fetchNextEvent = useCallback(async () => {
    try {
      const res = await fetch("/api/calendar/next-event");
      const data = await res.json();

      if (data.error === "RefreshTokenError") {
        setAuthError(true);
        return;
      }

      if (res.ok) {
        setEvent(data.event);
        setAuthError(false);
      }
    } catch {
      // Network error - keep showing current state
    } finally {
      setLoading(false);
    }
  }, []);

  const countdown = useCountdown(event?.start.dateTime ?? null);

  // Initial fetch
  useEffect(() => {
    fetchNextEvent();
  }, [fetchNextEvent]);

  // Poll every 5 minutes
  useEffect(() => {
    const interval = setInterval(fetchNextEvent, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchNextEvent]);

  // Re-fetch when countdown expires
  useEffect(() => {
    if (countdown.isExpired && event) {
      fetchNextEvent();
    }
  }, [countdown.isExpired, event, fetchNextEvent]);

  // Re-fetch on tab visibility change
  useEffect(() => {
    function handleVisibility() {
      if (document.visibilityState === "visible") {
        fetchNextEvent();
      }
    }
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [fetchNextEvent]);

  if (authError) {
    return <ErrorBanner />;
  }

  if (loading) {
    return (
      <div className="text-center text-xl text-white/70">
        Loading your calendar...
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center">
        <p className="text-4xl font-light text-white/80 md:text-5xl">
          No upcoming meetings
        </p>
        <p className="mt-4 text-white/50">Enjoy your free time!</p>
      </div>
    );
  }

  const { days, hours, minutes, seconds } = countdown;

  return (
    <div className="space-y-8">
      <div className="text-center">
        <p
          className="tabular-nums text-8xl font-bold tracking-tight text-white md:text-9xl"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {days > 0 && (
            <span className="text-6xl md:text-7xl">{days}d </span>
          )}
          {pad(hours)}:{pad(minutes)}:{pad(seconds)}
        </p>
      </div>
      <MeetingDetails event={event} />
    </div>
  );
}

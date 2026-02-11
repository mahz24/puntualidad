import { CalendarEvent } from "@/lib/types";

const timeFormatter = new Intl.DateTimeFormat(undefined, {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  weekday: "long",
  month: "long",
  day: "numeric",
});

export function MeetingDetails({ event }: { event: CalendarEvent }) {
  const startDate = new Date(event.start.dateTime);
  const endDate = new Date(event.end.dateTime);

  const isToday =
    new Date().toDateString() === startDate.toDateString();

  return (
    <div className="mx-auto max-w-lg space-y-3 text-center text-white/90">
      <h2 className="text-2xl font-semibold text-white md:text-3xl">
        {event.summary}
      </h2>

      <p className="text-lg">
        {!isToday && (
          <span>{dateFormatter.format(startDate)} &middot; </span>
        )}
        {timeFormatter.format(startDate)} &ndash; {timeFormatter.format(endDate)}
      </p>

      {event.location && (
        <p className="text-white/70">{event.location}</p>
      )}

      {event.hangoutLink && (
        <a
          href={event.hangoutLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-full bg-white/15 px-5 py-2 text-sm font-medium text-white transition hover:bg-white/25"
        >
          Join Google Meet
        </a>
      )}
    </div>
  );
}

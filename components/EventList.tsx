import { NPSEvent } from '@/types/nps';

interface EventListProps {
  events: NPSEvent[];
}

export default function EventList({ events }: EventListProps) {
  if (events.length === 0) {
    return (
      <div className="text-center text-gray-200 py-8">
        No upcoming events or programs scheduled at this time.
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div
          key={event.id}
          className="bg-gray-800 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h4 className="text-lg font-bold text-gray-100 mb-2">
                {event.title}
              </h4>

              {event.datestart && (
                <div className="text-sm text-gray-200 mb-2">
                  📅 {formatDate(event.datestart)}
                  {event.dateend && event.dateend !== event.datestart && (
                    <> - {formatDate(event.dateend)}</>
                  )}
                </div>
              )}

              {event.location && (
                <div className="text-sm text-gray-200 mb-2">
                  📍 {event.location}
                </div>
              )}

              <div
                className="text-gray-300 text-sm mb-3 line-clamp-3"
                dangerouslySetInnerHTML={{ __html: event.description }} /* https://legacy.reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml */
              />

              {event.category && (
                <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">
                  {event.category}
                </span>
              )}
            </div>

            {event.times && event.times.length > 0 && (
              <div className="text-sm text-gray-200 flex-shrink-0">
                🕒 {event.times[0].timestart}
                {event.times[0].timeend && ` - ${event.times[0].timeend}`}
              </div>
            )}
          </div>

          {event.contactname && (
            <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-200">
              Contact: {event.contactname}
              {event.contacttelephonenumber && ` • ${event.contacttelephonenumber}`}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

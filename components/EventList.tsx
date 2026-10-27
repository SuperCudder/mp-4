import { NPSEvent } from '@/types/nps';
import { Calendar, MapPin, Clock, Phone } from 'lucide-react';

interface EventListProps {
  events: NPSEvent[];
}

export default function EventList({ events }: EventListProps) {
  if (events.length === 0) {
    return (
      <div className="text-center text-canopy/60 py-8 bg-stone-warm/50 border border-parchment rounded-xl">
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
          className="bg-alabaster border border-parchment rounded-xl p-5 hover:border-forest-green/30 hover:shadow-sm transition-all"
        >
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h4 className="text-lg font-bold text-canopy mb-2">
                {event.title}
              </h4>

              {event.datestart && (
                <div className="flex items-center gap-1.5 text-sm text-canopy/80 mb-2">
                  <Calendar className="w-4 h-4 text-forest-green flex-shrink-0" />
                  <span>
                    {formatDate(event.datestart)}
                    {event.dateend && event.dateend !== event.datestart && (
                      <> - {formatDate(event.dateend)}</>
                    )}
                  </span>
                </div>
              )}

              {event.location && (
                <div className="flex items-center gap-1.5 text-sm text-canopy/80 mb-2">
                  <MapPin className="w-4 h-4 text-sinopia flex-shrink-0" />
                  <span>{event.location}</span>
                </div>
              )}

              <div
                className="text-canopy/75 text-sm mb-3 line-clamp-3 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: event.description }} /* https://legacy.reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml */
              />

              {event.category && (
                <span className="inline-block bg-sand text-raw-umber border border-parchment text-xs font-semibold px-2.5 py-0.5 rounded-full font-mono">
                  {event.category}
                </span>
              )}
            </div>

            {event.times && event.times.length > 0 && (
              <div className="inline-flex items-center gap-1.5 text-xs font-mono text-canopy/80 bg-white border border-parchment px-2.5 py-1.5 rounded-lg flex-shrink-0">
                <Clock className="w-3.5 h-3.5 text-sage" />
                <span>
                  {event.times[0].timestart}
                  {event.times[0].timeend && ` - ${event.times[0].timeend}`}
                </span>
              </div>
            )}
          </div>

          {(event.contactname || event.contacttelephonenumber) && (
            <div className="mt-3 pt-3 border-t border-parchment/60 flex items-center gap-2 text-xs text-canopy/70 font-mono">
              <Phone className="w-3.5 h-3.5 text-sage flex-shrink-0" />
              <span>
                {event.contactname && `Contact: ${event.contactname}`}
                {event.contacttelephonenumber && ` • ${event.contacttelephonenumber}`}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

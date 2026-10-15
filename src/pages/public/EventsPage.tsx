import { useState } from 'react';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { DEMO_EVENTS } from '../../data/demoData';
import { formatDateTime } from '../../utils/helpers';
import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';

type Filter = 'all' | 'upcoming' | 'completed';

const STATUS_BADGE: Record<string, { label: string; variant: 'green' | 'gray' | 'orange' | 'red' | 'blue' }> = {
  upcoming:  { label: 'Upcoming',  variant: 'green' },
  ongoing:   { label: 'Ongoing',   variant: 'orange' },
  completed: { label: 'Completed', variant: 'gray' },
  cancelled: { label: 'Cancelled', variant: 'red' },
};

export default function EventsPage() {
  const [filter, setFilter] = useState<Filter>('all');

  const events = DEMO_EVENTS
    .filter((e) => e.publishStatus === 'published')
    .filter((e) => filter === 'all' || e.status === filter)
    .sort((a, b) => b.startDate.getTime() - a.startDate.getTime());

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-50 mb-4">
          <Calendar className="w-7 h-7 text-[#166534]" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 font-heading mb-2">Events & Activities</h1>
        <p className="text-gray-500">Community events, celebrations, and important meetings.</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6" role="tablist">
        {(['all', 'upcoming', 'completed'] as Filter[]).map((f) => (
          <button
            key={f}
            role="tab"
            aria-selected={filter === f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-[#1e3a8a] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {events.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p className="font-medium">No events found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event) => {
            const badge = STATUS_BADGE[event.status];
            return (
              <Card key={event.id} className="overflow-hidden">
                <div className="flex">
                  {/* Date block */}
                  <div className={`w-20 flex-shrink-0 flex flex-col items-center justify-center text-white p-4 ${
                    event.status === 'completed' ? 'bg-gray-400' : 'bg-[#166534]'
                  }`}>
                    <span className="text-xs font-medium uppercase leading-none mb-1">
                      {event.startDate.toLocaleString('en-IN', { month: 'short' })}
                    </span>
                    <span className="text-2xl font-bold leading-none">{event.startDate.getDate()}</span>
                    <span className="text-xs leading-none mt-1">{event.startDate.getFullYear()}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-5 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                      <h2 className="font-semibold text-gray-900">{event.title}</h2>
                      <Badge variant={badge.variant}>{badge.label}</Badge>
                    </div>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{event.description}</p>
                    <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {formatDateTime(event.startDate)}
                        {event.endDate && ` – ${event.endDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}`}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {event.location}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

import { Suspense } from 'react';
import ParkCard from '@/components/ParkCard';
import SearchBar from '@/components/SearchBar';
import { getParks, searchParks, getParkStates } from '../actions/nps';
import Link from 'next/link';

export const metadata = {
  title: 'Browse Parks',
};

interface ParksPageProps {
  searchParams: Promise<{
    state?: string;
    search?: string;
    activity?: string;
  }>;
}

// loading skeleton component
function ParkCardSkeleton() {
  return (
    <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden h-full animate-pulse">
      <div className="h-48 bg-gray-300"></div>
      <div className="p-4">
        <div className="h-6 bg-gray-300 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded mb-3 w-1/3"></div>
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
    </div>
  );
}

function LoadingGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <ParkCardSkeleton key={i} />
      ))}
    </div>
  );
}

async function ParksContent({ searchParams }: ParksPageProps) {
  const params = await searchParams;
  const { state, search, activity } = params;

  let parks;
  let title = 'All National Parks';

  if (search) {
    parks = await searchParks(search);
    title = `Search Results for "${search}"`;
  } else if (state) {
    parks = await getParks(state);
    title = `National Parks in ${state}`;
  } else {
    parks = await getParks();
  }

  // filter by activity if user searches using them
  if (activity && parks) {
    parks = parks.filter((park) =>
      park.activities?.some((a) => a.name.toLowerCase().includes(activity.toLowerCase()))
    );
    title = activity ? `Parks for ${activity}` : title;
  }

  const states = await getParkStates();

  // popular activities, biased but most parks have all these anyways right TODO: research "popular activies"
  const popularActivities = [
    { name: 'Hiking', icon: '🥾' },
    { name: 'Photography', icon: '📸' },
    { name: 'Camping', icon: '🏕️' },
    { name: 'Wildlife Watching', icon: '🦌' },
    { name: 'Fishing', icon: '🎣' },
    { name: 'Biking', icon: '🚴' },
    { name: 'Accessibility', icon: '♿' },
  ];

  return (
    <>
      {/* Search and Filter Section */}
      <section className="bg-forest-green text-white py-12">
        <div className="w-full px-4">
          <h1 className="text-4xl font-bold mb-6 text-center">{title}</h1>

          <div className="max-w-2xl mx-auto mb-6">
            <SearchBar placeholder="Search parks..." />
          </div>

          {/* State Filter Pills */}
          <div className="max-w-4xl mx-auto mb-6">
            <p className="text-sm mb-3 text-center">Filter by state:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Link
                href="/parks"
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors shadow-sm ${
                  !state
                    ? 'bg-xanthous text-gray-900'
                    : 'bg-raw-umber text-white hover:bg-xanthous hover:text-gray-900'
                }`}
              >
                All States
              </Link>
              {states.slice(0, 15).map((s) => (
                <Link
                  key={s}
                  href={`/parks?state=${s}`}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors shadow-sm ${
                    state === s
                      ? 'bg-xanthous text-gray-900'
                      : 'bg-raw-umber text-white hover:bg-xanthous hover:text-gray-900'
                  }`}
                >
                  {s}
                </Link>
              ))}
              {states.length > 15 && (
                <span className="px-3 py-1 text-sm text-green-200">
                  +{states.length - 15} more
                </span>
              )}
            </div>
          </div>

          {/* Activity Filter Pills */}
          <div className="max-w-4xl mx-auto">
            <p className="text-sm mb-3 text-center">Filter by activity:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Link
                href="/parks"
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors shadow-sm ${
                  !activity
                    ? 'bg-xanthous text-gray-900'
                    : 'bg-raw-umber text-white hover:bg-xanthous hover:text-gray-900'
                }`}
              >
                All Activities
              </Link>
              {popularActivities.map((act) => (
                <Link
                  key={act.name}
                  href={`/parks?activity=${encodeURIComponent(act.name)}`}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors shadow-sm ${
                    activity === act.name
                      ? 'bg-xanthous text-gray-900'
                      : 'bg-raw-umber text-white hover:bg-xanthous hover:text-gray-900'
                  }`}
                >
                  {act.icon} {act.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Parks Grid Section */}
      <section className="w-full px-4 py-12 bg-xanthous rounded-xl">
        {parks.length > 0 ? (
          <>
            <p className="text-gray-800 mb-6">
              Showing {parks.length} park{parks.length !== 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {parks.map((park) => (
                <ParkCard key={park.id} park={park} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center text-gray-500 py-12">
            <p className="text-xl mb-4">No parks found</p>
            <p className="mb-6">Try adjusting your search or filter criteria</p>
            <Link
              href="/parks"
              className="inline-block px-6 py-2 bg-forest-green text-white rounded-lg hover:bg-xanthous hover:text-gray-900 transition-colors shadow-md"
            >
              View All Parks
            </Link>
          </div>
        )}
      </section>
    </>
  );
}

export default function ParksPage(props: ParksPageProps) {
  return (
    <div className="bg-raw-umber min-h-screen">
      <Suspense fallback={
        <div className="w-full px-4 py-12">
          <LoadingGrid />
        </div>
      }>
        <ParksContent {...props} />
      </Suspense>
    </div>
  );
}

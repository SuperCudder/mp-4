import { Suspense } from 'react';
import { getParks, getParkStates } from '../actions/nps';
import ParksExplorerClient from '@/components/ParksExplorerClient';

export const metadata = {
  title: 'Browse National Parks',
  description: 'Search, filter, and compare all U.S. National Parks by state, activity, or keyword.',
};

interface ParksPageProps {
  searchParams: Promise<{
    state?: string;
    search?: string;
    activity?: string;
  }>;
}

function LoadingSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-xl mx-auto mb-10 space-y-3">
        <div className="h-4 bg-stone-warm rounded w-32 mx-auto animate-pulse" />
        <div className="h-10 bg-stone-warm rounded-xl w-72 mx-auto animate-pulse" />
        <div className="h-12 bg-stone-warm rounded-2xl w-full max-w-lg mx-auto animate-pulse" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-white border border-parchment/80 rounded-2xl overflow-hidden shadow-eco animate-pulse flex flex-col h-96"
          >
            <div className="h-52 bg-stone-warm/80" />
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="h-3.5 bg-stone-warm rounded w-1/4" />
                <div className="h-6 bg-stone-warm rounded w-3/4" />
                <div className="h-3 bg-stone-warm rounded w-full" />
              </div>
              <div className="h-4 bg-stone-warm rounded w-28" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

async function ParksDataLoader({ searchParams }: ParksPageProps) {
  const params = await searchParams;
  const [allParks, states] = await Promise.all([
    getParks(undefined, 500),
    getParkStates(),
  ]);

  return (
    <ParksExplorerClient
      initialParks={allParks}
      states={states}
      initialState={params.state || ''}
      initialSearch={params.search || ''}
      initialActivity={params.activity || ''}
    />
  );
}

export default function ParksPage(props: ParksPageProps) {
  return (
    <div className="bg-alabaster min-h-screen">
      <Suspense fallback={<LoadingSkeleton />}>
        <ParksDataLoader {...props} />
      </Suspense>
    </div>
  );
}

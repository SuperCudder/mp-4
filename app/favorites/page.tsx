'use client';
/* store/pull fav from client browser bc no db use here */
import { useState, useEffect } from 'react';
import { useFavorites } from '@/hooks/useFavorites';
import { NPSPark } from '@/types/nps';
import ParkCard from '@/components/ParkCard';
import Link from 'next/link';

export default function FavoritesPage() {
  const { favorites, clearFavorites, isLoaded } = useFavorites();
  const [favoritedParks, setFavoritedParks] = useState<NPSPark[]>([]);
  const [isLoadingParks, setIsLoadingParks] = useState(true);

  useEffect(() => {
    if (isLoaded && favorites.length > 0) {
      // fetch park details for all favorited parks
      const fetchFavorites = async () => {
        try { /* fetch parks filtered by fav code*/
          const response = await fetch('/api/parks');
          const allParks = await response.json();
          const filtered = allParks.filter((park: NPSPark) =>
            favorites.includes(park.parkCode)
          );
          setFavoritedParks(filtered);
        } catch (error) {
          console.error('Error fetching favorite parks:', error);
        } finally {
          setIsLoadingParks(false);
        }
      };

      fetchFavorites();
    } else if (isLoaded) {
      setIsLoadingParks(false);
    }
  }, [favorites, isLoaded]);

  const handleClearAll = () => {
    if (confirm('Confirm clearing favorites?')) {
      clearFavorites();
      setFavoritedParks([]);
    }
  };

  if (!isLoaded || isLoadingParks) { /* if not loaded give a fallback*/
    return (
      <div className="bg-gray-800 min-h-screen">
        <section className="bg-sinopia text-white py-12">
          <div className="w-full px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              ❤️ Favorite Parks
            </h1>
            <p className="text-xl text-red-100">
              Your personalized collection of national parks
            </p>
          </div>
        </section>
        <div className="w-full px-4 py-12">
          <p className="text-gray-600 text-center">Loading your favorites...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 min-h-screen">
      {/* Header */}
      <section className="bg-sinopia text-white py-12">
        <div className="w-full px-4">
            <Link href="/" className="inline-block bg-raw-umber text-white hover:text-sinopia rounded px-4 py-2 mb-4">
                {"<"} Back
            </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            ❤️ My Favorite Parks
          </h1>
          <p className="text-xl text-red-100">
            Your personalized collection of {favorites.length} national park{favorites.length !== 1 ? 's' : ''}
          </p>
        </div>
      </section>

      <div className="w-full px-4 py-8">
        {favorites.length === 0 ? (
          <div className="bg-gray-800 rounded-lg shadow-md p-12 text-center">
            <span className="text-6xl mb-4 block">🤍</span>
            <h2 className="text-2xl font-bold text-white mb-2">No favorites yet</h2>
            <p className="text-white mb-6">
              Add parks to your favorites by clicking the heart icon
            </p>
            <Link
              href="/parks"
              className="inline-block px-6 py-3 bg-forest-green text-white font-semibold rounded-lg hover:bg-xanthous hover:text-gray-900 transition-colors shadow-md"
            >
              Browse Parks
            </Link>
          </div>
        ) : (
          <>
            {/* Actions Bar */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-100">
                Showing {favoritedParks.length} favorite park{favoritedParks.length !== 1 ? 's' : ''}
              </p>
              <button
                onClick={handleClearAll}
                className="px-4 py-2 text-white hover:text-black font-medium text-sm border border-red-700 rounded-lg hover:bg-red-600 transition-colors"
              >
                Clear All Favorites
              </button>
            </div>

            {/* Favorites Grid */}
            {favoritedParks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoritedParks.map((park) => (
                  <ParkCard key={park.id} park={park} />
                ))}
              </div>
            ) : (
              <div className="bg-gray-800 border-l-4 border-yellow-500 p-6 rounded-r-lg">
                <p className="text-yellow-800">
                  Some of your favorite parks couldn&#39;t be loaded.
                </p>
              </div>
            )}

            {/* Tips */}
            <div className="mt-8 bg-paynes-gray border-l-4 border-xanthous p-6 rounded-r-lg">
              <h3 className="font-bold text-white mb-2">💡 Pro Tips</h3>
              <ul className="text-sm text-white space-y-1">
                <li>- Click the heart icon on any park to add or remove it from favorites</li>
                <li>- Use the compare tool for a side by side look </li>
                <li>- Plan your trip by checking alerts for your parks</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

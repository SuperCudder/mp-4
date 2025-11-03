'use client'; /* since users choices arent tracked browser is fine, plus fav usage*/
/* used this collection for icons: https://www.svgrepo.com/collection/landscapes-16/ */
import { useState, useEffect } from 'react';
import { NPSPark } from '@/types/nps';
import Link from 'next/link';
import Image from 'next/image';
import SearchBar from '@/components/SearchBar';
import Desert from '@/app/src/icons/desert.svg'; /* used svgr: https://react-svgr.com/*/
import Mountain from '@/app/src/icons/mountain.svg';
import Island from '@/app/src/icons/island.svg';
import Canyon from '@/app/src/icons/canyon.svg';
import Forest from '@/app/src/icons/forest.svg';

const icons = [Island, Canyon, Forest];

const randomIndex = Math.floor(Math.random() * icons.length);
const RandomIcon = icons[randomIndex];

/* the idea behind this was to allow people to make educated choices for which parks to visit, or for those going on a roadtrip to plan ahead.
always nice to be able to directly compare things, without having to alt tab, or pull multiple different windows imo */
export default function ComparePage() {
  const [parks, setParks] = useState<NPSPark[]>([]);
  const [selectedParks, setSelectedParks] = useState<(NPSPark | null)[]>([null, null, null]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    /* fetch parks on client side */
    const fetchParks = async () => {
      try {
        const response = await fetch('/api/parks'); /* fetch park data like home page */
        const data = await response.json();
        setParks(data);
      } catch (error) {
        console.error('Error fetching parks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchParks();
  }, []);

  const filteredParks = parks.filter((park) =>
    park.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    park.states.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectPark = (index: number, park: NPSPark) => { /* which parks selected by users*/
    const newSelected = [...selectedParks];
    newSelected[index] = park;
    setSelectedParks(newSelected);
  };

  const removePark = (index: number) => {
    const newSelected = [...selectedParks];
    newSelected[index] = null;
    setSelectedParks(newSelected);
  };

  const getComparisonData = (park: NPSPark | null) => {
    if (!park) return null; /* if no park null else return full arr of park data for comparison*/

    return {
      name: park.fullName,
      image: park.images?.[0]?.url,
      states: park.states,
      description: park.description.substring(0, 200) + '...',
      activities: park.activities?.slice(0, 5).map(a => a.name) || [],
      entranceFee: park.entranceFees?.[0]?.cost || 'N/A',
      parkCode: park.parkCode,
    };
  };

  return (
    <div className="bg-gray-800 min-h-screen">
      {/* Header */}
      <section className="bg-paynes-gray text-white py-12">
        <div className="w-full px-4">
            <Link href="/" className="inline-block bg-raw-umber text-white hover:text-sinopia rounded px-4 py-2 mb-4">
                {"<"} Back
            </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <Mountain className="w-20 h-20 inline-block"/>
              <span className="text-7xl text-sinopia inline-block relative top-4"> ? </span>
              <Desert className="w-20 h-20 inline-block"/>
              <span className="text-4xl relative top-1 pl-2" >Compare Parks Side-by-Side </span>
          </h1>
          <p className="text-xl text-white">
            Select up to 3 parks to compare features, activities, and costs. Find the best park for your next trip!
          </p>
        </div>
      </section>

      <div className="w-full px-4 py-8">
        {/* Park Selector */}
        <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-8 border-2">
          <h2 className="text-2xl font-bold text-white mb-4">Select Parks to Compare</h2>

          <SearchBar
            placeholder="Search parks by name or state..."
            onChange={(query) => setSearchTerm(query)}
            className="mb-4"
          />

          {isLoading ? (
            <p className="text-grey-300">Loading parks...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
              {filteredParks.slice(0, 50).map((park) => (
                <button
                  key={park.id}
                  onClick={() => {
                    const emptyIndex = selectedParks.findIndex((p) => p === null);
                    if (emptyIndex !== -1) {
                      selectPark(emptyIndex, park);
                    }
                  }}
                  disabled={selectedParks.some((p) => p?.id === park.id)}
                  className={`text-left p-3 rounded-lg border-2 transition-all ${
                    selectedParks.some((p) => p?.id === park.id)
                      ? 'border-xanthous bg-sinopia cursor-not-allowed opacity-50'
                      : 'border-gray-500 hover:border-xanthous hover:bg-sinopia hover:text-gray-900'
                  }`}
                >
                  <p className="font-semibold text-sm line-clamp-1">{park.fullName}</p>
                  <p className="text-xs text-gray-300">{park.states}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {selectedParks.map((park, index) => {
            const data = getComparisonData(park);

            return (
              <div key={index} className="bg-gray-800 border-2 rounded-lg shadow-md overflow-hidden">
                {data ? (
                  <>
                    {/* Park Header */}
                    <div className="relative h-48 bg-gray-200">
                      {data.image && (
                        <Image
                          src={data.image}
                          alt={data.name}
                          fill
                          className="object-cover"
                        />
                      )}
                      <button
                        onClick={() => removePark(index)}
                        className="absolute top-2 right-2 bg-sinopia hover:bg-forest-green text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Park Details */}
                    <div className="p-4 space-y-4">
                      <div>
                        <h3 className="font-bold text-lg line-clamp-2 mb-1">{data.name}</h3>
                        <p className="text-sm text-gray-200">{data.states}</p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-sm text-gray-200 mb-1">Description</h4>
                        <p className="text-sm text-gray-300">{data.description}</p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-sm text-gray-300 mb-2">Top Activities</h4>
                        <div className="flex flex-wrap gap-1">
                          {data.activities.map((activity, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-raw-umber text-gray-100 text-xs rounded"
                            >
                              {activity}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-sm text-gray-200 mb-1">Entrance Fee</h4>
                        <p className="text-lg font-bold text-forest-green">
                          {data.entranceFee === 'N/A' ? 'Free' : `$${data.entranceFee}`}
                        </p>
                      </div>

                      <Link
                        href={`/parks/${data.parkCode}`}
                        className="block w-full text-center px-4 py-2 bg-forest-green text-white font-semibold rounded-lg hover:bg-xanthous hover:text-gray-900 transition-colors shadow-md"
                      >
                        View Full Details
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className="h-full flex items-center justify-center p-8 text-center">
                    <div>
                      <div className="text-6xl mb-4">
                          <RandomIcon className="items-center justify-center mx-auto h-10 w-10" />
                      </div>
                      <p className="text-gray-300 font-medium">
                        Select a park to compare
                      </p>
                      <p className="text-sm text-gray-400 mt-2">
                        Slot {index + 1} of 3
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Comparison Tips */}
        <div className="mt-8 bg-paynes-gray border-l-4 border-xanthous p-6 rounded-r-lg shadow-md">
          <h3 className="font-bold text-white mb-2">💡 Comparison Tips</h3>
          <ul className="text-sm text-white space-y-1">
            <li>- Compare entrance fees to plan your budget</li>
            <li>- Look for the activities you want</li>
            <li>- Compare locations to plan a road trip</li>
            <li>- Visit a parks page for detailed info and alerts</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

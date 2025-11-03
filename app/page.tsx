import SearchBar from '@/components/SearchBar';
import ParkCard from '@/components/ParkCard';
import AlertsDashboard from '@/components/AlertsDashboard';
import { getParks, getAlerts } from './actions/nps';
import Link from 'next/link';
import Canyon from "@/app/src/icons/canyon.svg"

export default async function Home() {
  // fetch featured parks and recent alerts in parallel
  const [featuredParks, recentAlerts] = await Promise.all([
    getParks(undefined, 6),
    getAlerts(undefined), // get all recent alerts
  ]);

  return (
    <div className="min-h-screen bg-gray-800">
      {/* Hero Section */}
      <section className="w-full px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl border-2 border-forest-green font-bold text-white mb-6 bg-paynes-gray rounded-3xl p-5">
            Explore America&#39;s National Parks
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Discover parks, view current alerts, find events, and plan your next adventure!
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <SearchBar placeholder="Search by park name or state (e.g., 'Yellowstone' or 'CA')..." />
          </div>
        </div>
      </section>

      {/* Safety-First Alerts Dashboard */}
      <section className="w-full px-4 py-12 bg-gray-800 rounded">
        <div className="max-w-6xl mx-auto bg-paynes-gray border-2 border-forest-green p-5 rounded-3xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className=" text-3xl font-bold text-gray-100 flex items-center">
              <span className="text-4xl text-white mr-3"> Current Park Alerts</span>
            </h2>
            <Link
              href="/alerts"
              className="text-gray-100 hover:text-xanthous font-semibold"
            >
              View All Alerts {"->"}
            </Link>
          </div>
          <AlertsDashboard alerts={recentAlerts.slice(0, 10)} />
        </div>
      </section>

      {/* Featured Parks Section */}
      <section className="w-full px-4 py-12 bg-gradient-to-b bg-paynes-gray rounded-xl border-2 border-forest-green">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">
          Featured Parks
        </h2>

        {featuredParks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredParks.map((park) => (
              <ParkCard key={park.id} park={park} />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-12">
            <p className="text-lg mb-4">
              Unable to load parks at this time.
            </p>
            <p className="text-sm">
              Please check your API key configuration in .env.local
            </p>
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            href="/parks"
            className="inline-block px-8 py-3 bg-forest-green text-white font-semibold rounded-lg hover:bg-xanthous hover:text-gray-900 transition-colors shadow-md"
          >
            View All Parks
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center p-5 ">
            <div className=" text-5xl mb-4"><Canyon className="w-10 h-10 mx-auto"/></div>
            <h3 className="text-xl font-bold text-gray-100 mb-2">
              Explore Parks
            </h3>
            <p className="text-gray-300">
              Browse detailed information about all U.S. National Parks
            </p>
          </div>

          <div className="text-center p-5 rounded">
            <div className="text-5xl mb-4">⚠️</div>
            <h3 className="text-xl font-bold text-gray-100 mb-2">
              Current Alerts
            </h3>
            <p className="text-gray-300">
              Stay informed about closures, warnings, and important updates
            </p>
          </div>

          <div className="text-center p-5 rounded">
            <div className="text-5xl mb-4">📅</div>
            <h3 className="text-xl font-bold text-gray-100 mb-2">
              Events & Programs
            </h3>
            <p className="text-gray-300">
              Discover ranger programs and special events happening at parks
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

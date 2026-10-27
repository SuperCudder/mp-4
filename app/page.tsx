import HeroCarousel from '@/components/HeroCarousel';
import ParkCard from '@/components/ParkCard';
import AlertsDashboard from '@/components/AlertsDashboard';
import { getParks, getAlerts } from './actions/nps';
import Link from 'next/link';
import { Compass, ShieldAlert, Scale, ArrowRight } from 'lucide-react';

export default async function Home() {
  // Fetch featured parks and active alerts concurrently
  const [featuredParks, recentAlerts] = await Promise.all([
    getParks(undefined, 8),
    getAlerts(undefined),
  ]);

  return (
    <div className="flex flex-col w-full">
      {/* Dynamic Animated Hero Showcase & Search */}
      <HeroCarousel featuredParks={featuredParks.slice(0, 5)} />

      {/* Current Park Alerts Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="font-mono text-xs uppercase tracking-wider text-raw-umber font-semibold block mb-1">
              Visitor Advisories
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-canopy">
              Current Park Alerts
            </h2>
            <p className="text-sm text-canopy/75 mt-1">
              Real-time safety bulletins, weather hazards, and park access notices.
            </p>
          </div>
          <Link
            href="/alerts"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-forest-green hover:text-moss transition-colors group"
          >
            <span>View All Alerts</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <AlertsDashboard alerts={recentAlerts.slice(0, 10)} />
      </section>

      {/* Featured Parks Showcase Grid */}
      <section className="bg-stone-warm/50 border-y border-parchment py-16 sm:py-20 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="font-mono text-xs uppercase tracking-wider text-raw-umber font-semibold block mb-1">
                Hand-Picked Destinations
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-canopy">
                Featured National Parks
              </h2>
              <p className="text-sm text-canopy/75 mt-1">
                Iconic American landscapes, mountain trails, and natural wonders.
              </p>
            </div>
            <Link
              href="/parks"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-forest-green hover:text-moss transition-colors group"
            >
              <span>Explore All Parks</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {featuredParks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {featuredParks.slice(0, 6).map((park) => (
                <ParkCard key={park.id} park={park} />
              ))}
            </div>
          ) : (
            <div className="text-center bg-white border border-parchment rounded-2xl p-12 max-w-xl mx-auto shadow-sm">
              <p className="text-lg font-bold text-canopy mb-2">
                Unable to load parks at this time
              </p>
              <p className="text-sm text-canopy/70">
                Please verify your API key configuration in .env.local
              </p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/parks"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-forest-green hover:bg-moss text-white font-semibold rounded-xl shadow-sm transition-all duration-200 text-sm focus:outline-none focus:ring-2 focus:ring-forest-green/30"
            >
              <span>Browse All National Parks</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Guide Highlights / Bento Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="font-mono text-xs uppercase tracking-wider text-raw-umber font-semibold block mb-1">
            Trip Planning Tools
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-canopy">
            Everything You Need for Your Next Trip
          </h2>
          <p className="text-sm text-canopy/75 mt-1">
            Carefully designed tools to help you discover, compare, and prepare for your national park visits.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
          {/* Card 1 */}
          <div className="bg-white border border-parchment rounded-2xl p-6 sm:p-8 shadow-eco hover:border-forest-green/30 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-forest-green/10 text-forest-green flex items-center justify-center mb-5">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-canopy mb-2">
                Explore 400+ Parks
              </h3>
              <p className="text-sm text-canopy/75 leading-relaxed mb-4">
                Detailed guides on entrance fees, visitor centers, operating hours, coordinates, and weather conditions.
              </p>
            </div>
            <Link
              href="/parks"
              className="inline-flex items-center gap-1 text-xs font-semibold text-forest-green hover:text-moss transition-colors"
            >
              <span>Open park directory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-parchment rounded-2xl p-6 sm:p-8 shadow-eco hover:border-sinopia/30 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-sinopia/10 text-sinopia flex items-center justify-center mb-5">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-canopy mb-2">
                Live Safety Alerts
              </h3>
              <p className="text-sm text-canopy/75 leading-relaxed mb-4">
                Stay informed with official park closures, active wildlife warnings, trail condition reports, and weather notices.
              </p>
            </div>
            <Link
              href="/alerts"
              className="inline-flex items-center gap-1 text-xs font-semibold text-sinopia hover:text-espresso transition-colors"
            >
              <span>View safety alerts</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-parchment rounded-2xl p-6 sm:p-8 shadow-eco hover:border-xanthous/40 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-xanthous/15 text-raw-umber flex items-center justify-center mb-5">
                <Scale className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-canopy mb-2">
                Side-by-Side Comparison
              </h3>
              <p className="text-sm text-canopy/75 leading-relaxed mb-4">
                Compare fees, climate, amenities, and activities across up to 3 parks simultaneously to plan your itinerary.
              </p>
            </div>
            <Link
              href="/compare"
              className="inline-flex items-center gap-1 text-xs font-semibold text-raw-umber hover:text-canopy transition-colors"
            >
              <span>Compare destinations</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

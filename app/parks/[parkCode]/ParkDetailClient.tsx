'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Compass,
  MapPin,
  Ticket,
  ShieldAlert,
  Sparkles,
  Calendar,
  Camera,
  Clock,
  CreditCard,
  Phone,
  Mail,
  Navigation,
  CloudSun,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  X,
  GitCompare,
  Info,
  Check,
  Copy,
  CheckCircle2,
} from 'lucide-react';
import { NPSPark, NPSAlert, NPSEvent } from '@/types/nps';
import AlertBanner from '@/components/AlertBanner';
import EventList from '@/components/EventList';
import FavoriteButton from '@/components/FavoriteButton';
import { useComparison } from '@/hooks/useComparison';

interface ParkDetailClientProps {
  park: NPSPark;
  alerts: NPSAlert[];
  events: NPSEvent[];
}

type TabType = 'overview' | 'alerts' | 'plan' | 'photos';

export default function ParkDetailClient({
  park,
  alerts,
  events,
}: ParkDetailClientProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [isActivitiesExpanded, setIsActivitiesExpanded] = useState(false);
  const [copiedCoordinates, setCopiedCoordinates] = useState(false);

  const { isInComparison, toggleComparison, comparison } = useComparison();
  const inComparison = isInComparison(park.parkCode);

  const images = park.images || [];
  const primaryImage = images[0];

  // Coordinates string & copy handler
  const coordinatesString =
    park.latitude && park.longitude
      ? `${Number(park.latitude).toFixed(3)}°, ${Number(park.longitude).toFixed(3)}°`
      : 'N/A';

  const copyCoordinates = async () => {
    if (park.latitude && park.longitude) {
      try {
        await navigator.clipboard.writeText(`${park.latitude}, ${park.longitude}`);
        setCopiedCoordinates(true);
        setTimeout(() => setCopiedCoordinates(false), 2000);
      } catch (err) {
        console.error('Failed to copy coordinates:', err);
      }
    }
  };

  // Keyboard navigation for photo lightbox
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (selectedImageIndex === null) return;
      if (e.key === 'Escape') {
        setSelectedImageIndex(null);
      } else if (e.key === 'ArrowRight') {
        setSelectedImageIndex((prev) =>
          prev !== null ? (prev + 1) % images.length : null
        );
      } else if (e.key === 'ArrowLeft') {
        setSelectedImageIndex((prev) =>
          prev !== null ? (prev - 1 + images.length) % images.length : null
        );
      }
    },
    [selectedImageIndex, images.length]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const activeImage = selectedImageIndex !== null ? images[selectedImageIndex] : null;

  const activities = park.activities || [];
  const displayedActivities = isActivitiesExpanded
    ? activities
    : activities.slice(0, 16);

  const primaryFee =
    park.entranceFees && park.entranceFees.length > 0 && park.entranceFees[0].cost
      ? Number(park.entranceFees[0].cost) === 0
        ? 'Free Entry'
        : `$${park.entranceFees[0].cost}`
      : 'Free Entry';

  const tabs: Array<{ id: TabType; label: string; count?: number; icon: typeof Info }> = [
    { id: 'overview', label: 'Overview', icon: Info },
    { id: 'alerts', label: 'Alerts', count: alerts.length, icon: ShieldAlert },
    { id: 'plan', label: 'Plan Your Visit', icon: Calendar },
    { id: 'photos', label: 'Photo Gallery', count: images.length, icon: Camera },
  ];

  return (
    <div className="bg-alabaster min-h-screen text-canopy selection:bg-moss/20">
      {/* Hero Banner */}
      <section className="relative min-h-[460px] md:min-h-[520px] flex flex-col justify-between overflow-hidden bg-canopy">
        {primaryImage?.url && (
          <Image
            src={primaryImage.url}
            alt={primaryImage.altText || park.fullName}
            fill
            className="object-cover object-center opacity-65 scale-105 transition-transform duration-1000"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-canopy via-canopy/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-canopy/75 via-transparent to-transparent" />

        {/* Top Navigation & Breadcrumb */}
        <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex items-center justify-between">
          <Link
            href="/parks"
            className="inline-flex items-center gap-2 text-stone-warm hover:text-white bg-canopy/50 hover:bg-canopy/75 backdrop-blur-md px-4 py-2 rounded-full border border-white/15 text-sm font-medium transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Parks</span>
          </Link>

          {/* Floating Quick Action Bar */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => toggleComparison(park.parkCode)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold backdrop-blur-md border transition-all shadow-sm ${
                inComparison
                  ? 'bg-xanthous text-canopy border-xanthous shadow-md hover:bg-xanthous/90'
                  : 'bg-white/15 hover:bg-white/25 text-white border-white/20'
              }`}
              title={
                inComparison
                  ? 'Click to remove from comparison'
                  : comparison.length >= 3
                  ? 'Comparison is full (max 3)'
                  : 'Add to comparison matrix'
              }
            >
              <GitCompare className={`w-3.5 h-3.5 ${inComparison ? 'text-canopy' : 'text-xanthous'}`} />
              <span className="hidden sm:inline">
                {inComparison ? 'In Comparison' : 'Add to Compare'}
              </span>
              <span className="sm:hidden">
                {inComparison ? 'Compared' : 'Compare'}
              </span>
            </button>

            {park.url && (
              <a
                href={park.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold bg-white/15 hover:bg-white/25 backdrop-blur-md text-white border border-white/20 transition-all shadow-sm"
                title="Open official NPS website"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Official Website</span>
              </a>
            )}

            <div className="bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 rounded-full p-1 transition-all shadow-sm">
              <FavoriteButton
                parkCode={park.parkCode}
                className="flex items-center justify-center w-8 h-8 rounded-full hover:scale-110 transition-transform"
              />
            </div>
          </div>
        </div>

        {/* Hero Title & Identity */}
        <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-10 pt-16">
          <div className="max-w-3xl space-y-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="font-mono text-xs uppercase tracking-widest bg-forest-green/80 text-sand px-3 py-1 rounded-full border border-white/15 backdrop-blur-sm">
                {park.designation || 'National Park'}
              </span>
              <span className="font-mono text-xs uppercase tracking-widest bg-white/10 text-stone-warm px-3 py-1 rounded-full border border-white/15 backdrop-blur-sm">
                {park.parkCode.toUpperCase()}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
              {park.fullName}
            </h1>

            <div className="flex items-center gap-2 text-stone-warm text-base sm:text-lg">
              <MapPin className="w-5 h-5 text-xanthous flex-shrink-0" />
              <span>{park.states}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Animated In-Page Sticky Navigation Bar */}
      <nav className="bg-white/95 backdrop-blur-md border-y border-parchment sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 sm:gap-2 py-2.5 overflow-x-auto scrollbar-none">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap focus:outline-none ${
                    isActive ? 'text-white' : 'text-stone-600 hover:text-canopy'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="parkDetailTab"
                      className="absolute inset-0 bg-forest-green rounded-xl shadow-sm -z-10"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span
                      className={`font-mono text-[11px] px-2 py-0.5 rounded-full transition-colors ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : tab.id === 'alerts' && tab.count > 0
                          ? 'bg-sinopia/15 text-sinopia font-bold'
                          : 'bg-stone-warm text-stone-600'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Single-Screen Tab Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <AnimatePresence mode="wait">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.25 }}
              className="space-y-8"
            >
              {/* Quick Glance Stats Strip */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white border border-parchment rounded-2xl p-4 sm:p-5 shadow-eco space-y-1">
                  <div className="flex items-center gap-2 text-sage text-xs font-medium">
                    <MapPin className="w-4 h-4 text-forest-green" />
                    <span>State / Region</span>
                  </div>
                  <p className="text-lg font-bold text-canopy truncate">{park.states}</p>
                  <p className="text-xs text-stone-500 font-sans">{park.designation || 'National Park'}</p>
                </div>

                <div className="bg-white border border-parchment rounded-2xl p-4 sm:p-5 shadow-eco space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sage text-xs font-medium">
                      <Compass className="w-4 h-4 text-forest-green" />
                      <span>Coordinates</span>
                    </div>
                    {park.latitude && park.longitude && (
                      <button
                        onClick={copyCoordinates}
                        className="text-[11px] font-mono text-moss hover:text-forest-green inline-flex items-center gap-1 transition-colors"
                        title="Copy coordinates"
                      >
                        {copiedCoordinates ? (
                          <>
                            <Check className="w-3 h-3 text-forest-green" />
                            <span className="text-forest-green font-bold">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                  <p className="text-base sm:text-lg font-mono font-bold text-canopy truncate">
                    {coordinatesString}
                  </p>
                  <p className="text-xs text-stone-500 font-sans">WGS 84 Datum</p>
                </div>

                <div className="bg-white border border-parchment rounded-2xl p-4 sm:p-5 shadow-eco space-y-1">
                  <div className="flex items-center gap-2 text-sage text-xs font-medium">
                    <Ticket className="w-4 h-4 text-forest-green" />
                    <span>Entrance Fee</span>
                  </div>
                  <p className="text-lg font-mono font-bold text-forest-green truncate">
                    {primaryFee}
                  </p>
                  <p className="text-xs text-stone-500 font-sans truncate">
                    {park.entranceFees?.[0]?.title || 'Standard vehicle pass'}
                  </p>
                </div>

                <div
                  onClick={() => setActiveTab('alerts')}
                  className={`border rounded-2xl p-4 sm:p-5 shadow-eco space-y-1 cursor-pointer transition-all hover:shadow-eco-hover ${
                    alerts.length > 0
                      ? 'bg-sinopia/5 border-sinopia/30 hover:border-sinopia/50'
                      : 'bg-white border-parchment'
                  }`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') setActiveTab('alerts');
                  }}
                >
                  <div className="flex items-center justify-between text-xs font-medium">
                    <div className="flex items-center gap-2">
                      <ShieldAlert
                        className={`w-4 h-4 ${alerts.length > 0 ? 'text-sinopia' : 'text-forest-green'}`}
                      />
                      <span className={alerts.length > 0 ? 'text-sinopia font-semibold' : 'text-sage'}>
                        Current Alerts
                      </span>
                    </div>
                    <span className="text-[11px] text-moss underline">View</span>
                  </div>
                  <p
                    className={`text-lg font-bold truncate ${
                      alerts.length > 0 ? 'text-sinopia font-mono' : 'text-canopy font-mono'
                    }`}
                  >
                    {alerts.length} Active Notice{alerts.length === 1 ? '' : 's'}
                  </p>
                  <p className="text-xs text-stone-500 font-sans">
                    {alerts.length > 0 ? 'Safety updates available' : 'All clear across park'}
                  </p>
                </div>
              </div>

              {/* Park Description & Overview Content */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  {/* About Card */}
                  <div className="bg-white border border-parchment rounded-2xl shadow-eco p-6 sm:p-8 space-y-5">
                    <div className="flex items-center gap-2.5 border-b border-parchment pb-4">
                      <Info className="w-5 h-5 text-forest-green flex-shrink-0" />
                      <h2 className="text-xl sm:text-2xl font-bold text-canopy">
                        About {park.name}
                      </h2>
                    </div>

                    <p className="text-stone-700 leading-relaxed text-base sm:text-lg whitespace-pre-line font-sans">
                      {park.description}
                    </p>
                  </div>

                  {/* Activities Grid */}
                  {activities.length > 0 && (
                    <div className="bg-white border border-parchment rounded-2xl shadow-eco p-6 sm:p-8 space-y-5">
                      <div className="flex items-center justify-between border-b border-parchment pb-4">
                        <div className="flex items-center gap-2.5">
                          <Sparkles className="w-5 h-5 text-forest-green flex-shrink-0" />
                          <h2 className="text-xl sm:text-2xl font-bold text-canopy">
                            Activities & Experiences
                          </h2>
                        </div>
                        <span className="font-mono text-xs text-stone-500">
                          {activities.length} total
                        </span>
                      </div>

                      <motion.div layout className="flex flex-wrap gap-2">
                        {displayedActivities.map((activity) => (
                          <Link
                            key={activity.id}
                            href={`/parks?activity=${encodeURIComponent(activity.name)}`}
                            className="inline-flex items-center gap-2 px-3.5 py-2 bg-stone-warm/70 hover:bg-forest-green hover:text-white text-canopy border border-parchment/80 rounded-xl text-xs sm:text-sm font-medium transition-all shadow-sm group"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-moss group-hover:bg-sand transition-colors" />
                            <span>{activity.name}</span>
                          </Link>
                        ))}
                      </motion.div>

                      {activities.length > 16 && (
                        <div className="pt-2 text-center border-t border-parchment/60">
                          <button
                            onClick={() => setIsActivitiesExpanded(!isActivitiesExpanded)}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-moss hover:text-forest-green transition-colors py-1"
                          >
                            {isActivitiesExpanded ? (
                              <>
                                <span>Show fewer activities</span>
                                <ChevronUp className="w-4 h-4" />
                              </>
                            ) : (
                              <>
                                <span>Show all {activities.length} activities</span>
                                <ChevronDown className="w-4 h-4" />
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Sidebar Quick Highlights */}
                <aside className="space-y-6">
                  {/* Weather Snippet Card */}
                  {park.weatherInfo && (
                    <div className="bg-white border border-parchment rounded-2xl shadow-eco p-6 space-y-3">
                      <div className="flex items-center gap-2 border-b border-parchment pb-3 text-forest-green">
                        <CloudSun className="w-5 h-5" />
                        <h3 className="font-bold text-canopy text-base">Weather & Climate</h3>
                      </div>
                      <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">
                        {park.weatherInfo}
                      </p>
                      <button
                        onClick={() => setActiveTab('plan')}
                        className="text-xs font-semibold text-moss hover:text-forest-green inline-flex items-center gap-1 pt-1"
                      >
                        <span>More trip planning details</span>
                        <ArrowLeft className="w-3 h-3 rotate-180" />
                      </button>
                    </div>
                  )}

                  {/* Quick Compare Card */}
                  <div className="bg-stone-warm/50 border border-parchment rounded-2xl p-6 space-y-3">
                    <div className="flex items-center gap-2 text-forest-green">
                      <GitCompare className="w-5 h-5" />
                      <h3 className="font-bold text-canopy text-base">Compare With Other Parks</h3>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      Compare fees, activities, operating schedules, and weather side-by-side with other national parks.
                    </p>
                    <Link
                      href={`/compare?parks=${park.parkCode}`}
                      className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-forest-green hover:bg-moss text-white rounded-xl text-xs font-semibold transition-colors shadow-sm"
                    >
                      <GitCompare className="w-3.5 h-3.5 text-xanthous" />
                      <span>Open in Comparison Matrix</span>
                    </Link>
                  </div>
                </aside>
              </div>
            </motion.div>
          )}

          {/* TAB 2: ALERTS */}
          {activeTab === 'alerts' && (
            <motion.div
              key="alerts"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.25 }}
              className="space-y-6 max-w-4xl mx-auto"
            >
              <div className="flex items-center justify-between border-b border-parchment pb-4">
                <div>
                  <h2 className="text-2xl font-bold text-canopy">
                    Active Park Advisories
                  </h2>
                  <p className="text-stone-600 text-xs sm:text-sm font-sans mt-0.5">
                    Real-time safety alerts and closures reported by the National Park Service
                  </p>
                </div>
                <span className="font-mono text-xs font-bold px-3 py-1 rounded-full bg-stone-warm text-canopy">
                  {alerts.length} Total
                </span>
              </div>

              {alerts.length > 0 ? (
                <div className="space-y-4">
                  {alerts.map((alert) => (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white border border-parchment rounded-2xl shadow-eco overflow-hidden"
                    >
                      <div className="p-4 sm:p-5">
                        <AlertBanner alert={alert} />
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="bg-white border border-parchment rounded-2xl shadow-eco p-10 sm:p-14 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-sage-light text-forest-green flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div className="space-y-1.5 max-w-md mx-auto">
                    <h3 className="text-xl font-bold text-canopy">
                      All clear - No active alerts for this park
                    </h3>
                    <p className="text-stone-500 text-xs sm:text-sm font-sans leading-relaxed">
                      There are currently no active road closures, hazard warnings, or seasonal advisories reported for {park.fullName}. Always check at the visitor center for day-to-day trail conditions.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 3: PLAN YOUR VISIT */}
          {activeTab === 'plan' && (
            <motion.div
              key="plan"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.25 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Operating Hours Card */}
                {park.operatingHours && park.operatingHours.length > 0 && (
                  <div className="bg-white border border-parchment rounded-2xl shadow-eco p-6 sm:p-7 space-y-5">
                    <div className="flex items-center gap-2.5 border-b border-parchment pb-4">
                      <Clock className="w-5 h-5 text-forest-green" />
                      <h3 className="text-xl font-bold text-canopy">
                        Operating Hours & Schedules
                      </h3>
                    </div>

                    <div className="space-y-3">
                      {park.operatingHours[0].standardHours && (
                        <div className="space-y-1.5 text-xs sm:text-sm font-mono">
                          {Object.entries(park.operatingHours[0].standardHours).map(
                            ([day, hours]) => (
                              <div
                                key={day}
                                className="flex justify-between items-center py-2 px-3 rounded-xl bg-stone-warm/50 border border-parchment/60"
                              >
                                <span className="capitalize font-sans font-medium text-canopy">
                                  {day}
                                </span>
                                <span className="text-forest-green font-semibold">
                                  {hours}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      )}

                      {park.operatingHours[0].description && (
                        <p className="text-xs text-stone-600 pt-3 border-t border-parchment leading-relaxed font-sans">
                          {park.operatingHours[0].description}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Entrance Fees & Passes Card */}
                <div className="bg-white border border-parchment rounded-2xl shadow-eco p-6 sm:p-7 space-y-5">
                  <div className="flex items-center gap-2.5 border-b border-parchment pb-4">
                    <CreditCard className="w-5 h-5 text-forest-green" />
                    <h3 className="text-xl font-bold text-canopy">
                      Entrance Fees & Passes
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {park.entranceFees && park.entranceFees.length > 0 ? (
                      park.entranceFees.map((fee, index) => (
                        <div
                          key={index}
                          className="p-3.5 rounded-xl bg-stone-warm/50 border border-parchment/70 space-y-1"
                        >
                          <div className="flex justify-between items-baseline gap-2">
                            <span className="font-semibold text-xs sm:text-sm text-canopy">
                              {fee.title}
                            </span>
                            <span className="font-mono text-base font-bold text-forest-green flex-shrink-0">
                              {Number(fee.cost) === 0 || !fee.cost ? 'Free' : `$${fee.cost}`}
                            </span>
                          </div>
                          {fee.description && (
                            <p className="text-xs text-stone-600 leading-relaxed font-sans">
                              {fee.description}
                            </p>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-stone-500 font-sans">
                        No entrance fee information listed. Many federal monuments and historic sites are free to enter.
                      </p>
                    )}
                  </div>
                </div>

                {/* Weather & Climate Guide */}
                {park.weatherInfo && (
                  <div className="bg-white border border-parchment rounded-2xl shadow-eco p-6 sm:p-7 space-y-4">
                    <div className="flex items-center gap-2.5 border-b border-parchment pb-4">
                      <CloudSun className="w-5 h-5 text-forest-green" />
                      <h3 className="text-xl font-bold text-canopy">
                        Weather & Seasonal Guide
                      </h3>
                    </div>

                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">
                      {park.weatherInfo}
                    </p>
                  </div>
                )}

                {/* Directions & Navigation Card */}
                <div className="bg-white border border-parchment rounded-2xl shadow-eco p-6 sm:p-7 space-y-4">
                  <div className="flex items-center gap-2.5 border-b border-parchment pb-4">
                    <Navigation className="w-5 h-5 text-forest-green" />
                    <h3 className="text-xl font-bold text-canopy">
                      Directions & Getting There
                    </h3>
                  </div>

                  {park.directionsInfo && (
                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">
                      {park.directionsInfo}
                    </p>
                  )}

                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    {park.latitude && park.longitude && (
                      <a
                        href={`https://www.google.com/maps?q=${park.latitude},${park.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3.5 py-2 bg-stone-warm hover:bg-forest-green hover:text-white text-canopy border border-parchment rounded-xl text-xs font-medium transition-colors"
                      >
                        <Compass className="w-4 h-4 text-moss" />
                        <span>Open in Google Maps</span>
                      </a>
                    )}

                    {park.directionsUrl && (
                      <a
                        href={park.directionsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3.5 py-2 bg-stone-warm hover:bg-forest-green hover:text-white text-canopy border border-parchment rounded-xl text-xs font-medium transition-colors"
                      >
                        <ExternalLink className="w-4 h-4 text-moss" />
                        <span>Official Directions Page</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Contact Information Card */}
                {park.contacts && (
                  <div className="bg-white border border-parchment rounded-2xl shadow-eco p-6 sm:p-7 space-y-4">
                    <div className="flex items-center gap-2.5 border-b border-parchment pb-4">
                      <Phone className="w-5 h-5 text-forest-green" />
                      <h3 className="text-xl font-bold text-canopy">
                        Park Contact Information
                      </h3>
                    </div>

                    <div className="space-y-3 text-xs sm:text-sm font-sans">
                      {park.contacts.phoneNumbers?.map((phone, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-moss flex-shrink-0" />
                          <a
                            href={`tel:${phone.phoneNumber}`}
                            className="font-mono text-xs sm:text-sm text-canopy hover:text-forest-green hover:underline font-semibold"
                          >
                            {phone.phoneNumber}
                          </a>
                          {phone.description && (
                            <span className="text-stone-500 text-xs">
                              ({phone.description})
                            </span>
                          )}
                        </div>
                      ))}

                      {park.contacts.emailAddresses?.map((email, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-moss flex-shrink-0" />
                          <a
                            href={`mailto:${email.emailAddress}`}
                            className="font-mono text-xs sm:text-sm text-canopy hover:text-forest-green hover:underline truncate"
                          >
                            {email.emailAddress}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Upcoming Events Section */}
              <div className="bg-white border border-parchment rounded-2xl shadow-eco p-6 sm:p-8 space-y-6">
                <div className="flex items-center gap-2.5 border-b border-parchment pb-4">
                  <Calendar className="w-5 h-5 text-forest-green flex-shrink-0" />
                  <h3 className="text-xl sm:text-2xl font-bold text-canopy">
                    Upcoming Events & Ranger Programs
                  </h3>
                </div>
                <EventList events={events} />
              </div>
            </motion.div>
          )}

          {/* TAB 4: PHOTO GALLERY */}
          {activeTab === 'photos' && (
            <motion.div
              key="photos"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between border-b border-parchment pb-4">
                <div>
                  <h2 className="text-2xl font-bold text-canopy">
                    Photo Gallery
                  </h2>
                  <p className="text-stone-600 text-xs sm:text-sm font-sans mt-0.5">
                    High-resolution imagery of scenic views, wildlife, and natural features
                  </p>
                </div>
                <span className="font-mono text-xs font-bold px-3 py-1 rounded-full bg-stone-warm text-canopy">
                  {images.length} {images.length === 1 ? 'Photo' : 'Photos'}
                </span>
              </div>

              {images.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setSelectedImageIndex(index)}
                      className={`group relative rounded-2xl overflow-hidden border border-parchment bg-sand shadow-sm hover:shadow-eco-hover transition-all text-left focus:outline-none focus:ring-2 focus:ring-forest-green ${
                        index === 0 ? 'sm:col-span-2 sm:row-span-2 h-72 sm:h-[420px]' : 'h-52 sm:h-64'
                      }`}
                    >
                      <Image
                        src={image.url}
                        alt={image.altText || `${park.fullName} - Photo ${index + 1}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-canopy/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                        <p className="text-white text-xs sm:text-sm font-medium line-clamp-2">
                          {image.title || image.caption || park.fullName}
                        </p>
                        {image.credit && (
                          <p className="text-sand/80 text-[10px] font-mono mt-1 line-clamp-1">
                            Credit: {image.credit}
                          </p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="bg-white border border-parchment rounded-2xl p-12 text-center text-stone-500 font-sans text-sm">
                  No photography currently available for this park.
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Interactive Lightbox Modal */}
      <AnimatePresence>
        {selectedImageIndex !== null && activeImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-canopy/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 md:p-10"
            onClick={() => setSelectedImageIndex(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full bg-espresso rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex flex-col max-h-[90vh]"
            >
              {/* Modal Top Bar */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/40">
                <span className="font-mono text-xs text-sand tracking-widest">
                  PHOTO {selectedImageIndex + 1} OF {images.length}
                </span>

                <button
                  onClick={() => setSelectedImageIndex(null)}
                  className="rounded-full bg-white/10 hover:bg-white/20 text-white p-1.5 transition-colors"
                  aria-label="Close photo preview"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Photo Area with Next/Prev Buttons */}
              <div className="relative flex-1 min-h-[300px] sm:min-h-[480px] bg-black/60 flex items-center justify-center">
                <Image
                  src={activeImage.url}
                  alt={activeImage.altText || park.fullName}
                  fill
                  className="object-contain"
                  priority
                />

                {images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImageIndex(
                          (selectedImageIndex - 1 + images.length) % images.length
                        );
                      }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-sm border border-white/15 transition-all shadow-lg"
                      aria-label="Previous photo"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImageIndex(
                          (selectedImageIndex + 1) % images.length
                        );
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-sm border border-white/15 transition-all shadow-lg"
                      aria-label="Next photo"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}
              </div>

              {/* Modal Caption Footer */}
              <div className="px-6 py-4 bg-black/50 border-t border-white/10 text-stone-200 space-y-1">
                <p className="text-sm font-medium text-white">
                  {activeImage.title || activeImage.caption || park.fullName}
                </p>
                {activeImage.credit && (
                  <p className="font-mono text-xs text-sand/70">
                    Credit: {activeImage.credit}
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert,
  AlertTriangle,
  Info,
  CheckCircle2,
  Search,
  ArrowLeft,
  X,
  ExternalLink,
  MapPin,
  Flame,
} from 'lucide-react';
import { NPSAlert } from '@/types/nps';
import AlertBanner from '@/components/AlertBanner';

interface AlertsFilterClientProps {
  allAlerts: NPSAlert[];
}

type TabCategory = 'all' | 'critical' | 'caution' | 'information';

export default function AlertsFilterClient({ allAlerts }: AlertsFilterClientProps) {
  const [activeTab, setActiveTab] = useState<TabCategory>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Categorize alerts
  const criticalAlerts = useMemo(
    () =>
      allAlerts.filter(
        (alert) => alert.category === 'Park Closure' || alert.category === 'Danger'
      ),
    [allAlerts]
  );

  const warningAlerts = useMemo(
    () => allAlerts.filter((alert) => alert.category === 'Caution'),
    [allAlerts]
  );

  const infoAlerts = useMemo(
    () => allAlerts.filter((alert) => alert.category === 'Information'),
    [allAlerts]
  );

  // Filter based on active tab and search query
  const filteredAlerts = useMemo(() => {
    let list: NPSAlert[] = allAlerts;
    if (activeTab === 'critical') {
      list = criticalAlerts;
    } else if (activeTab === 'caution') {
      list = warningAlerts;
    } else if (activeTab === 'information') {
      list = infoAlerts;
    }

    if (!searchTerm.trim()) {
      return list;
    }

    const query = searchTerm.toLowerCase().trim();
    return list.filter(
      (alert) =>
        alert.title.toLowerCase().includes(query) ||
        alert.description.toLowerCase().includes(query) ||
        (alert.parkCode && alert.parkCode.toLowerCase().includes(query))
    );
  }, [allAlerts, activeTab, criticalAlerts, warningAlerts, infoAlerts, searchTerm]);

  const tabs: Array<{
    id: TabCategory;
    label: string;
    count: number;
    icon: typeof ShieldAlert;
    accentColor: string;
    badgeBg: string;
  }> = [
    {
      id: 'all',
      label: 'All Alerts',
      count: allAlerts.length,
      icon: ShieldAlert,
      accentColor: 'text-canopy',
      badgeBg: 'bg-stone-warm text-canopy',
    },
    {
      id: 'critical',
      label: 'Park Closures & Dangers',
      count: criticalAlerts.length,
      icon: Flame,
      accentColor: 'text-sinopia',
      badgeBg: 'bg-sinopia/10 text-sinopia',
    },
    {
      id: 'caution',
      label: 'Caution & Warnings',
      count: warningAlerts.length,
      icon: AlertTriangle,
      accentColor: 'text-xanthous',
      badgeBg: 'bg-xanthous/15 text-raw-umber',
    },
    {
      id: 'information',
      label: 'Informational',
      count: infoAlerts.length,
      icon: Info,
      accentColor: 'text-forest-green',
      badgeBg: 'bg-sage-light text-forest-green',
    },
  ];

  return (
    <div className="bg-alabaster min-h-screen text-canopy selection:bg-moss/20">
      {/* Header Section */}
      <section className="bg-white border-b border-parchment py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <Link
            href="/parks"
            className="inline-flex items-center gap-2 text-stone-600 hover:text-canopy bg-stone-warm/80 hover:bg-stone-warm px-3.5 py-1.5 rounded-full border border-parchment text-xs font-medium transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Parks</span>
          </Link>

          <div className="max-w-3xl space-y-2">
            <div className="flex items-center gap-2 text-moss">
              <ShieldAlert className="w-5 h-5 text-forest-green" />
              <span className="font-mono text-xs uppercase tracking-widest font-semibold">
                Park Safety & Advisories
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-canopy">
              Current Park Alerts
            </h1>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed font-sans">
              Active closures, warnings, and updates across the National Park Service.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        {/* Interactive 4-Tab Filter Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative text-left p-5 rounded-2xl border transition-all text-canopy focus:outline-none ${
                  isActive
                    ? 'bg-white border-forest-green shadow-eco ring-1 ring-forest-green'
                    : 'bg-white/70 hover:bg-white border-parchment hover:border-moss/40 shadow-sm'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeAlertTab"
                    className="absolute inset-0 rounded-2xl border-2 border-forest-green pointer-events-none"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}

                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2 rounded-xl bg-stone-warm/80 ${tab.accentColor}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`font-mono text-xs font-bold px-2.5 py-0.5 rounded-full ${tab.badgeBg}`}
                  >
                    {tab.count}
                  </span>
                </div>

                <div className="space-y-0.5">
                  <span className="text-xs text-stone-500 font-mono uppercase tracking-wider block">
                    Category
                  </span>
                  <span className="font-bold text-sm sm:text-base text-canopy block">
                    {tab.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Real-Time Keyword & Park Code Search Bar */}
        <div className="bg-white border border-parchment rounded-2xl shadow-eco p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search alerts by title, description, or park code (e.g. fire, road closure, acad)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 bg-stone-warm/40 border border-parchment rounded-xl text-xs sm:text-sm text-canopy placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-forest-green focus:bg-white transition-all font-sans"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                aria-label="Clear search input"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between w-full sm:w-auto gap-3 text-xs font-mono text-stone-500 self-stretch sm:self-auto">
            <span>
              Showing <strong className="text-canopy">{filteredAlerts.length}</strong> of{' '}
              {allAlerts.length}
            </span>
            {(searchTerm || activeTab !== 'all') && (
              <button
                onClick={() => {
                  setActiveTab('all');
                  setSearchTerm('');
                }}
                className="text-xs text-forest-green hover:underline font-semibold"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Alert Items List */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredAlerts.length > 0 ? (
              filteredAlerts.map((alert) => (
                <motion.div
                  key={alert.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white border border-parchment rounded-2xl shadow-eco overflow-hidden hover:shadow-eco-hover transition-shadow"
                >
                  <div className="p-1">
                    {/* Park Code Header Strip if available */}
                    {alert.parkCode && (
                      <div className="px-4 pt-3 pb-1 flex items-center justify-between text-xs font-mono border-b border-parchment/60 mb-2">
                        <span className="flex items-center gap-1.5 text-stone-500">
                          <MapPin className="w-3.5 h-3.5 text-moss" />
                          Park Code: <strong className="text-canopy">{alert.parkCode.toUpperCase()}</strong>
                        </span>
                        <Link
                          href={`/parks/${alert.parkCode}`}
                          className="inline-flex items-center gap-1 text-forest-green hover:text-moss font-semibold hover:underline"
                        >
                          <span>View Park Details</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                    )}

                    <div className="p-3 sm:p-4">
                      <AlertBanner alert={alert} />
                    </div>
                  </div>
                </motion.div>
              ))
            ) : allAlerts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white border border-parchment rounded-2xl shadow-eco p-12 text-center space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-sage-light text-forest-green flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold text-canopy">
                    All Clear Across System
                  </h2>
                  <p className="text-stone-500 text-sm max-w-md mx-auto font-sans">
                    No active closures, hazard warnings, or informational advisories have been published by the National Park Service at this moment.
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white border border-parchment rounded-2xl shadow-eco p-12 text-center space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-stone-warm text-stone-500 flex items-center justify-center mx-auto">
                  <Search className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-xl font-bold text-canopy">
                    No Matching Alerts Found
                  </h2>
                  <p className="text-stone-500 text-sm max-w-md mx-auto font-sans">
                    No alerts match &ldquo;{searchTerm}&rdquo; in the selected category. Try adjusting your query or resetting filters.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setActiveTab('all');
                    setSearchTerm('');
                  }}
                  className="px-4 py-2 bg-forest-green hover:bg-moss text-white rounded-xl text-xs font-semibold transition-colors"
                >
                  Reset All Filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

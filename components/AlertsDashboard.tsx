'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { NPSAlert } from '@/types/nps';
import {
  ShieldAlert,
  AlertTriangle,
  Info,
  CheckCircle2,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from 'lucide-react';

interface AlertsDashboardProps {
  alerts: NPSAlert[];
}

export default function AlertsDashboard({ alerts }: AlertsDashboardProps) {
  const [selectedCategory, setSelectedCategory] = useState<
    'all' | 'critical' | 'caution' | 'info'
  >('all');
  const [expandedAlertId, setExpandedAlertId] = useState<string | null>(null);

  const criticalAlerts = alerts.filter(
    (alert) => alert.category === 'Park Closure' || alert.category === 'Danger'
  );
  const warningAlerts = alerts.filter((alert) => alert.category === 'Caution');
  const infoAlerts = alerts.filter((alert) => alert.category === 'Information');

  if (alerts.length === 0) {
    return (
      <div className="bg-sage-light/50 border border-sage/30 p-6 rounded-2xl">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-8 h-8 text-forest-green flex-shrink-0" />
          <div>
            <h3 className="text-base font-bold text-forest-green">All Clear</h3>
            <p className="text-sm text-canopy/70">
              There are currently no active safety closures or hazard warnings reported across monitored parks.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Filter alerts by selected tab
  const displayedAlerts = (() => {
    switch (selectedCategory) {
      case 'critical':
        return criticalAlerts;
      case 'caution':
        return warningAlerts;
      case 'info':
        return infoAlerts;
      default:
        return alerts;
    }
  })();

  const toggleExpand = (id: string) => {
    setExpandedAlertId(expandedAlertId === id ? null : id);
  };

  return (
    <div className="space-y-6">
      {/* Interactive Category Filter Tabs / Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          type="button"
          onClick={() => setSelectedCategory('all')}
          className={`p-3.5 rounded-2xl border text-left transition-all shadow-sm ${
            selectedCategory === 'all'
              ? 'bg-forest-green text-white border-forest-green shadow-forest-green/20'
              : 'bg-white hover:bg-stone-warm text-canopy border-parchment'
          }`}
        >
          <span
            className={`text-[11px] font-mono uppercase tracking-wider block font-semibold ${
              selectedCategory === 'all' ? 'text-white/80' : 'text-raw-umber'
            }`}
          >
            All Alerts
          </span>
          <span className="text-2xl font-bold font-mono">{alerts.length}</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedCategory('critical')}
          className={`p-3.5 rounded-2xl border text-left transition-all shadow-sm ${
            selectedCategory === 'critical'
              ? 'bg-sinopia text-white border-sinopia shadow-sinopia/20'
              : 'bg-[#FDF6F3] hover:bg-[#FCEEE8] text-sinopia border-sinopia/30'
          }`}
        >
          <span
            className={`text-[11px] font-mono uppercase tracking-wider block font-semibold ${
              selectedCategory === 'critical' ? 'text-white/80' : 'text-sinopia'
            }`}
          >
            Critical & Closures
          </span>
          <span className="text-2xl font-bold font-mono">{criticalAlerts.length}</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedCategory('caution')}
          className={`p-3.5 rounded-2xl border text-left transition-all shadow-sm ${
            selectedCategory === 'caution'
              ? 'bg-xanthous text-canopy border-xanthous shadow-xanthous/20 font-bold'
              : 'bg-[#FDF9F0] hover:bg-[#FAF4E4] text-[#8B6514] border-xanthous/40'
          }`}
        >
          <span
            className={`text-[11px] font-mono uppercase tracking-wider block font-semibold ${
              selectedCategory === 'caution' ? 'text-canopy/75' : 'text-[#8B6514]'
            }`}
          >
            Caution Advisories
          </span>
          <span className="text-2xl font-bold font-mono">{warningAlerts.length}</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedCategory('info')}
          className={`p-3.5 rounded-2xl border text-left transition-all shadow-sm ${
            selectedCategory === 'info'
              ? 'bg-moss text-white border-moss shadow-moss/20'
              : 'bg-sage-light/60 hover:bg-sage-light text-forest-green border-sage/30'
          }`}
        >
          <span
            className={`text-[11px] font-mono uppercase tracking-wider block font-semibold ${
              selectedCategory === 'info' ? 'text-white/80' : 'text-forest-green'
            }`}
          >
            Information
          </span>
          <span className="text-2xl font-bold font-mono">{infoAlerts.length}</span>
        </button>
      </div>

      {/* Animated Alerts List */}
      <motion.div layout className="space-y-3">
        <AnimatePresence mode="popLayout">
          {displayedAlerts.slice(0, 8).map((alert) => {
            const isCritical =
              alert.category === 'Park Closure' || alert.category === 'Danger';
            const isWarning = alert.category === 'Caution';
            const isExpanded = expandedAlertId === alert.id;

            return (
              <motion.div
                key={alert.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className={`bg-white border rounded-2xl overflow-hidden shadow-sm transition-all ${
                  isCritical
                    ? 'border-sinopia/30 hover:border-sinopia/60'
                    : isWarning
                    ? 'border-xanthous/40 hover:border-xanthous/70'
                    : 'border-parchment hover:border-forest-green/40'
                }`}
              >
                {/* Clickable Header for Collapsible */}
                <div
                  onClick={() => toggleExpand(alert.id)}
                  className="p-4 sm:p-5 flex items-start justify-between gap-3 cursor-pointer select-none hover:bg-stone-warm/30 transition-colors"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div
                      className={`p-2 rounded-xl flex-shrink-0 mt-0.5 ${
                        isCritical
                          ? 'bg-sinopia/10 text-sinopia'
                          : isWarning
                          ? 'bg-xanthous/20 text-[#8B6514]'
                          : 'bg-sage-light text-forest-green'
                      }`}
                    >
                      {isCritical ? (
                        <ShieldAlert className="w-5 h-5" />
                      ) : isWarning ? (
                        <AlertTriangle className="w-5 h-5" />
                      ) : (
                        <Info className="w-5 h-5" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span
                          className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                            isCritical
                              ? 'bg-sinopia/15 text-sinopia'
                              : isWarning
                              ? 'bg-xanthous/25 text-[#8B6514]'
                              : 'bg-sage-light text-forest-green'
                          }`}
                        >
                          {alert.category}
                        </span>

                        {alert.parkCode && (
                          <span className="font-mono text-[11px] font-semibold text-canopy/70 uppercase">
                            Park: {alert.parkCode}
                          </span>
                        )}
                      </div>

                      <h4 className="text-base sm:text-lg font-bold text-canopy leading-snug">
                        {alert.title}
                      </h4>

                      {!isExpanded && (
                        <p className="text-xs sm:text-sm text-canopy/70 line-clamp-1 mt-1">
                          {alert.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0 pt-1 text-canopy/50">
                    <span className="hidden sm:inline text-xs font-medium">
                      {isExpanded ? 'Less' : 'Details'}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </div>

                {/* Collapsible Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="px-4 sm:px-5 pb-5 pt-1 border-t border-parchment/60 bg-sand/30"
                    >
                      <p className="text-sm text-canopy/85 leading-relaxed mb-4">
                        {alert.description}
                      </p>

                      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2 font-mono text-canopy/60">
                          {alert.lastIndexedDate && (
                            <span>
                              Updated: {new Date(alert.lastIndexedDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          {alert.url && (
                            <a
                              href={alert.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 font-semibold text-canopy/80 hover:text-canopy transition-colors"
                            >
                              <span>Official Bulletin</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}

                          {alert.parkCode && (
                            <Link
                              href={`/parks/${alert.parkCode}`}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-forest-green hover:bg-moss text-white rounded-lg font-semibold transition-colors shadow-sm"
                            >
                              <span>View Park</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Link to all alerts if many */}
      {alerts.length > 8 && (
        <div className="text-center pt-2">
          <Link
            href="/alerts"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-warm hover:bg-parchment text-canopy font-semibold rounded-xl text-sm transition-colors"
          >
            <span>View All {alerts.length} Park Alerts</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}

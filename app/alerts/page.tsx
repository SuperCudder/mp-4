import { getAlerts } from '../actions/nps';
import AlertBanner from '@/components/AlertBanner';
import Link from 'next/link';

export const metadata = {
  title: 'Alerts',
  description: 'Current alerts, closures, and safety information for U.S. National Parks',
};

export default async function AlertsPage() {
  const allAlerts = await getAlerts();

  // categorize alerts
  const criticalAlerts = allAlerts.filter(
    (alert) => alert.category === 'Park Closure' || alert.category === 'Danger'
  );
  const warningAlerts = allAlerts.filter((alert) => alert.category === 'Caution');
  const infoAlerts = allAlerts.filter((alert) => alert.category === 'Information');

  return (
    <div className="bg-gray-800 min-h-screen">
      {/* Header */}
      <section className="bg-sinopia text-white py-12">
        <div className="w-full px-4">
          <Link href="/" className="text-white hover:text-gray-200 mb-4 inline-block">
            {"<"} Back
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            🚨 National Park Alerts
          </h1>
          <p className="text-xl text-gray-100">
            Current closures, warnings, and important updates from across the National Park System
          </p>
        </div>
      </section>

      <div className="w-full px-4 py-8">
        {/* Alert Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-200 rounded-xl border-2 shadow-md p-6 border-sinopia">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-700 text-sm font-medium">Critical Alerts</p>
                <p className="text-3xl font-bold text-red-700">{criticalAlerts.length}</p>
              </div>
              <span className="text-4xl">🚨</span>
            </div>
          </div>

          <div className="bg-yellow-200 rounded-lg shadow-md p-6 border-l-4 border-xanthous">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-800 text-sm font-medium">Caution Alerts</p>
                <p className="text-3xl font-bold text-gray-800">{warningAlerts.length}</p>
              </div>
              <span className="text-4xl">⚠️</span>
            </div>
          </div>

          <div className="bg-blue-200 rounded-lg shadow-md p-6 border-l-4 border-paynes-gray">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-800 text-sm font-medium">Information</p>
                <p className="text-3xl font-bold text-gray-800">{infoAlerts.length}</p>
              </div>
              <span className="text-4xl">ℹ️</span>
            </div>
          </div>
        </div>

        {/* Critical Alerts Section */}
        {criticalAlerts.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-red-400 mb-4 flex items-center">
              <span className="text-3xl mr-2">🚨</span>
              Critical Alerts - Immediate Attention Required
            </h2>
            <div className="space-y-4">
              {criticalAlerts.map((alert) => (
                <AlertBanner key={alert.id} alert={alert} />
              ))}
            </div>
          </section>
        )}

        {/* Warning Alerts Section */}
        {warningAlerts.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-xanthous mb-4 flex items-center">
              <span className="text-3xl mr-2">⚠️</span>
              Caution Alerts - Plan Accordingly
            </h2>
            <div className="space-y-4">
              {warningAlerts.map((alert) => (
                <AlertBanner key={alert.id} alert={alert} />
              ))}
            </div>
          </section>
        )}

        {/* Information Alerts Section */}
        {infoAlerts.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-blue-200 mb-4 flex items-center">
              <span className="text-3xl mr-2">ℹ️</span>
              Informational Updates
            </h2>
            <div className="space-y-4">
              {infoAlerts.map((alert) => (
                <AlertBanner key={alert.id} alert={alert} />
              ))}
            </div>
          </section>
        )}

        {allAlerts.length === 0 && (
          <div className="bg-gray-50 border-l-4 border-forest-green p-8 rounded-r-lg text-center">
            <span className="text-6xl mb-4 block">✅</span>
            <h2 className="text-2xl font-bold text-forest-green mb-2">All Clear!</h2>
            <p className="text-paynes-gray">No active alerts at this time.</p>
          </div>
        )}
      </div>
    </div>
  );
}

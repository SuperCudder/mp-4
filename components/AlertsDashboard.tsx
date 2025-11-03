import Link from 'next/link';
import { NPSAlert } from '@/types/nps';

interface AlertsDashboardProps {
  alerts: NPSAlert[];
}

export default function AlertsDashboard({ alerts }: AlertsDashboardProps) {
  // categorize alerts danger
  const criticalAlerts = alerts.filter( /* filter by alert type if most important*/
    (alert) => alert.category === 'Park Closure' || alert.category === 'Danger'
  );
  const warningAlerts = alerts.filter((alert) => alert.category === 'Caution'); /* filter warnings */
  const infoAlerts = alerts.filter((alert) => alert.category === 'Information'); /* filter for simple info*/

  const getSeverityColor = (category: string) => {
    // return border color based on severity
    switch (category) {
      case 'Park Closure':
      case 'Danger':
        return 'border-sinopia';
      case 'Caution':
        return 'border-xanthous';
      default:
        return 'border-paynes-gray';
    }
  };

  const getSeverityIcon = (category: string) => {
    switch (category) {
      case 'Park Closure':
      case 'Danger':
        return '🚨';
      case 'Caution':
        return '⚠️';
      default:
        return 'ℹ️';
    }
  };

  if (alerts.length === 0) { /* if no alerts (prob super rare) give fallback */
    return (
      <div className="bg-paynes-gray border-l-4 border-forest-green p-6 rounded-r-lg">
        <div className="flex items-center">
          <span className="text-3xl mr-3">✅</span>
          <div>
            <h3 className="text-lg font-bold text-sinopia">All Clear!</h3>
            <p className="text-gray-200">No active alerts right now.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Critical Alerts - Important */}
      {criticalAlerts.length > 0 && (
        <div className={`bg-gray-800 border-2 ${getSeverityColor('Danger')} rounded-lg p-6 shadow-lg`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold text-red-400 flex items-center">
              <span className="text-4xl mr-3">{getSeverityIcon('Danger')}</span>
              Critical Alerts ({criticalAlerts.length})
            </h3>
          </div>
          <div className="space-y-3">
            {criticalAlerts.slice(0, 3).map((alert) => (
              <div
                key={alert.id}
                className={`bg-paynes-gray border-l-4 ${getSeverityColor(alert.category)} p-4 rounded-r shadow`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-100 mb-1">{alert.title}</h4>
                    <p className="text-sm text-gray-200 mb-2 line-clamp-2">
                      {alert.description}
                    </p>
                    <Link
                      href={`/parks/${alert.parkCode}`}
                      className="text-sinopia hover:text-forest-green font-semibold text-sm"
                    >
                      View Park Details {"→"}
                    </Link>
                  </div>
                  <span className="ml-3 px-3 py-1 bg-sinopia text-gray-100 text-xs font-bold rounded-full">
                    {alert.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
          {criticalAlerts.length > 3 && (
            <Link
              href="/alerts"
              className="mt-4 inline-block text-sinopia hover:text-forest-green font-semibold text-sm"
            >
              View all {criticalAlerts.length} critical alerts {"→"}
            </Link>
          )}
        </div>
      )}

      {/* Warning Alerts */}
      {warningAlerts.length > 0 && (
        <div className={`bg-yellow-300 border-l-4 ${getSeverityColor('Caution')} rounded p-4`}>
          <h3 className="text-lg font-bold text-gray-800 flex items-center mb-3">
            <span className="text-2xl mr-2">{getSeverityIcon('Caution')}</span>
            Caution Alerts ({warningAlerts.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {warningAlerts.slice(0, 4).map((alert) => (
              <div key={alert.id} className="bg-yellow-200 p-3 rounded shadow-sm">
                <h4 className="font-semibold text-gray-800 text-sm mb-1">
                  {alert.title}
                </h4>
                <Link
                  href={`/parks/${alert.parkCode}`}
                  className="text-sinopia hover:text-xanthous text-xs font-medium"
                >
                  View Details {"→"}
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info Summary */}
      {infoAlerts.length > 0 && (
        <div className={`bg-blue-200 border-l-4 ${getSeverityColor('Information')} rounded-r-lg p-4`}>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-800 flex items-center">
              <span className="text-2xl mr-2">{getSeverityIcon('Information')}</span>
              {infoAlerts.length} Informational Update{infoAlerts.length !== 1 ? 's' : ''}
            </h3>
            <Link
              href="/alerts"
              className="text-paynes-gray hover:text-forest-green font-semibold text-sm"
            >
              View All {"→"}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

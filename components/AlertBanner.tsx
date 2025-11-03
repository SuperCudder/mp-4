import { NPSAlert } from '@/types/nps';

interface AlertBannerProps {
  alert: NPSAlert;
}

export default function AlertBanner({ alert }: AlertBannerProps) {
  /* determine alert color based on category */
  const getAlertStyles = (category: string) => {
    switch (category) { /* depending on alert type, return specific style for that type of alert*/
      case 'Park Closure':
      case 'Danger':
        return 'bg-red-400 border-l-4 border-red-700 text-gray-900 rounded-xl';
      case 'Caution':
        return 'bg-yellow-200 border-l-4 border-xanthous text-gray-900 rounded-xl';
      case 'Information':
      default:
        return 'bg-blue-200 border-paynes-gray text-gray-900';
    }
  };
    /* https://unicode.org/emoji/charts/full-emoji-list.html for icons */
  const getAlertIcon = (category: string) => {
    switch (category) {
      case 'Park Closure':
      case 'Danger':
        return '⛔';
      case 'Caution':
        return '⚠️';
      case 'Information':
      default:
        return 'ℹ️';
    }
  };

  return (
    <div
      className={`border-l-4 p-4 rounded-r-lg ${getAlertStyles(alert.category)}`}
    >
      <div className="flex items-start">
        <span className="text-2xl mr-3 flex-shrink-0">{getAlertIcon(alert.category)}</span>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-bold text-lg">{alert.title}</h4>
            <span className="text-xs text-gray-200 font-semibold px-2 py-1 rounded bg-black">
              {alert.category}
            </span>
          </div>
          <p className="text-sm whitespace-pre-line">{alert.description}</p>
          {alert.url && (
            <a
              href={alert.url}
              target="_blank" /* opens in new tab */
              rel="noopener noreferrer" /* phishing security */
              className="text-sm font-semibold mt-2 inline-block hover:underline"
            >
              Learn more {"->"}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

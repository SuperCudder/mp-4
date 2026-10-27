import { NPSAlert } from '@/types/nps';
import { ShieldAlert, AlertTriangle, Info, ExternalLink } from 'lucide-react';

interface AlertBannerProps {
  alert: NPSAlert;
}

export default function AlertBanner({ alert }: AlertBannerProps) {
  /* determine alert styling and icons based on category */
  const getAlertConfig = (category: string) => {
    switch (category) {
      case 'Park Closure':
      case 'Danger':
        return {
          wrapper: 'bg-[#FDF6F3] border-sinopia/40 text-espresso shadow-sm',
          badge: 'bg-sinopia/15 text-sinopia border border-sinopia/30',
          icon: <ShieldAlert className="w-5 h-5 text-sinopia flex-shrink-0 mt-0.5" />,
          accent: 'text-sinopia',
        };
      case 'Caution':
        return {
          wrapper: 'bg-[#FDF9F0] border-xanthous/50 text-espresso shadow-sm',
          badge: 'bg-xanthous/20 text-[#8B6514] border border-xanthous/40',
          icon: <AlertTriangle className="w-5 h-5 text-xanthous flex-shrink-0 mt-0.5" />,
          accent: 'text-raw-umber',
        };
      case 'Information':
      default:
        return {
          wrapper: 'bg-sage-light/60 border-sage/40 text-canopy shadow-sm',
          badge: 'bg-sage/15 text-forest-green border border-sage/30',
          icon: <Info className="w-5 h-5 text-forest-green flex-shrink-0 mt-0.5" />,
          accent: 'text-forest-green',
        };
    }
  };

  const config = getAlertConfig(alert.category);

  return (
    <div
      className={`border rounded-xl p-4 transition-all ${config.wrapper}`}
    >
      <div className="flex items-start gap-3.5">
        {config.icon}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <h4 className="font-bold text-base text-canopy">{alert.title}</h4>
            <span className={`text-[11px] font-mono font-semibold uppercase px-2.5 py-0.5 rounded-full ${config.badge}`}>
              {alert.category}
            </span>
          </div>
          <p className="text-sm leading-relaxed text-canopy/80 whitespace-pre-line">{alert.description}</p>
          {alert.url && (
            <a
              href={alert.url}
              target="_blank" /* opens in new tab */
              rel="noopener noreferrer" /* phishing security */
              className={`inline-flex items-center gap-1 text-sm font-semibold mt-3 transition-opacity hover:opacity-80 ${config.accent}`}
            >
              <span>Learn more</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

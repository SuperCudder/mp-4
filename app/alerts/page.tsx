import { getAlerts } from '../actions/nps';
import AlertsFilterClient from './AlertsFilterClient';

export const metadata = {
  title: 'Current Park Alerts | National Park Service',
  description: 'Active closures, warnings, and updates across the National Park Service',
};

export default async function AlertsPage() {
  const allAlerts = await getAlerts();

  return <AlertsFilterClient allAlerts={allAlerts} />;
}

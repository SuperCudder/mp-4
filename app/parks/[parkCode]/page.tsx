import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getParkByCode, getAlerts, getEvents } from '@/app/actions/nps';
import ParkDetailClient from './ParkDetailClient';

interface ParkDetailPageProps {
  params: Promise<{
    parkCode: string;
  }>;
}

export async function generateMetadata({ params }: ParkDetailPageProps): Promise<Metadata> {
  const { parkCode } = await params;
  const park = await getParkByCode(parkCode);

  if (!park) {
    return {
      title: 'Park Not Found | National Park Service',
    };
  }

  return {
    title: `${park.fullName} - Park Details | National Park Service`,
    description: park.description,
  };
}

export default async function ParkDetailPage({ params }: ParkDetailPageProps) {
  const { parkCode } = await params;

  // Fetch park data, alerts, and events in parallel
  const [park, alerts, events] = await Promise.all([
    getParkByCode(parkCode),
    getAlerts(parkCode),
    getEvents(parkCode),
  ]);

  if (!park) {
    notFound();
  }

  return <ParkDetailClient park={park} alerts={alerts} events={events} />;
}

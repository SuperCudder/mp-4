import Image from 'next/image';
import Link from 'next/link';
import { NPSPark } from '@/types/nps';
import FavoriteButton from './FavoriteButton';

interface ParkCardProps {
  park: NPSPark;
}

export default function ParkCard({ park }: ParkCardProps) {
  const imageUrl = park.images?.[0]?.url || '/placeholder-park.jpg';
  const imageAlt = park.images?.[0]?.altText || park.fullName;

  return (
    <Link href={`/parks/${park.parkCode}`}>
      <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
        {/* Park Image */}
        <div className="relative h-48 w-full bg-paynes-gray">
          {park.images?.[0]?.url ? (
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No image available
            </div>
          )}
          {/* Favorite Button */}
          <div className="absolute top-2 right-2 z-10">
            <FavoriteButton parkCode={park.parkCode} className="bg-sinopia rounded-full p-2 shadow-lg hover:scale-110" />
          </div>
        </div>

        {/* Park Info */}
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="text-xl font-bold text-gray-100 mb-2 line-clamp-2">
            {park.fullName}
          </h3>

          <p className="text-sm text-gray-200 mb-3">
            {park.states}
          </p>

          <p className="text-gray-300 text-sm line-clamp-3 flex-1">
            {park.description}
          </p>

          <div className="mt-4 text-forest-green font-semibold text-sm hover:text-xanthous transition-colors">
            View Details {"->"}
          </div>
        </div>
      </div>
    </Link>
  );
}

import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getParkByCode, getAlerts, getEvents } from '@/app/actions/nps';
import AlertBanner from '@/components/AlertBanner';
import EventList from '@/components/EventList';
import FavoriteButton from '@/components/FavoriteButton';

interface ParkDetailPageProps {
  params: Promise<{
    parkCode: string;
  }>;
}

export default async function ParkDetailPage({ params }: ParkDetailPageProps) {
  const { parkCode } = await params;

  // fetch park data and related information in parallel using get funcs made for the api fetch
  const [park, alerts, events] = await Promise.all([
    getParkByCode(parkCode),
    getAlerts(parkCode),
    getEvents(parkCode),
  ]);

  if (!park) { /* if no park throw err */
    notFound();
  }

  return (
    <div className="bg-gray-800 min-h-screen">
      {/* Hero Section with Park Image */}
      <section className="relative h-96 bg-gray-800">
        {park.images?.[0]?.url && (
          <Image
            src={park.images[0].url}
            alt={park.images[0].altText || park.fullName}
            fill
            className="object-cover opacity-80"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="w-full">
            <Link
              href="/parks"
              className="text-white hover:text-sinopia mb-4 inline-block"
            >
              {"<"} Back
            </Link>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {park.fullName}
                </h1>
                <p className="p-2 text-xl text-gray-200">{park.states}</p>
              </div>
              <div className="ml-4">
                <FavoriteButton parkCode={park.parkCode} className="bg-sinopia rounded-full p-3 shadow-lg hover:scale-110" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="w-full px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Alerts Section */}
            {alerts.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-100 mb-4">
                    📰 Current Alerts
                </h2>
                <div className="space-y-4">
                  {alerts.map((alert) => (
                    <AlertBanner key={alert.id} alert={alert} />
                  ))}
                </div>
              </section>
            )}

            {/* Description Section */}
            <section className="bg-paynes-gray rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-100 mb-4">
                About This Park
              </h2>
              <p className="text-gray-200 leading-relaxed whitespace-pre-line">
                {park.description}
              </p>

              {/* Activities */}
              {park.activities && park.activities.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-200 mb-3">
                    Activities
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {park.activities.slice(0, 10).map((activity) => (
                      <span
                        key={activity.id}
                        className="px-3 py-1 bg-raw-umber text-white text-sm rounded-full"
                      >
                        {activity.name}
                      </span>
                    ))}
                    {park.activities.length > 10 && (
                      <span className="px-3 py-1 text-gray-300 text-sm">
                        +{park.activities.length - 10} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </section>

            {/* Events Section */}
            <section className="bg-paynes-gray rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-100 mb-4">
                📅 Upcoming Events & Programs
              </h2>
              <EventList events={events} />
            </section>

            {/* Photo Gallery */}
            {park.images && park.images.length > 1 && (
              <section className="bg-paynes-gray rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-100 mb-4">
                  Photo Gallery
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {park.images.slice(1, 5).map((image, index) => (
                    <div
                      key={index}
                      className="relative h-64 rounded-lg overflow-hidden"
                    >
                      <Image
                        src={image.url}
                        alt={image.altText || `${park.fullName} - Image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      {image.caption && (
                        <div className="absolute bottom-0 left-0 right-0 bg-gray-800 bg-opacity-70 text-white text-sm p-2">
                          {image.caption}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Operating Hours */}
            {park.operatingHours && park.operatingHours.length > 0 && (
              <div className="bg-paynes-gray rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-100 mb-4">
                  🕒 Operating Hours
                </h3>
                <div className="space-y-2">
                  {park.operatingHours[0].standardHours && (
                    <div className="text-sm">
                      {Object.entries(park.operatingHours[0].standardHours).map(
                        ([day, hours]) => (
                          <div key={day} className="flex justify-between py-1">
                            <span className="font-medium capitalize">{day}:</span>
                            <span className="text-gray-200">{hours}</span>
                          </div>
                        )
                      )}
                    </div>
                  )}
                  {park.operatingHours[0].description && (
                    <p className="text-sm text-gray-300 mt-3 pt-3 border-t">
                      {park.operatingHours[0].description}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Entrance Fees */}
            {park.entranceFees && park.entranceFees.length > 0 && (
              <div className="bg-paynes-gray rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-200 mb-4">
                  💵 Entrance Fees
                </h3>
                <div className="space-y-3">
                  {park.entranceFees.map((fee, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium text-gray-200">
                          {fee.title}
                        </span>
                        <span className="text-xanthous font-bold">
                          ${fee.cost}
                        </span>
                      </div>
                      {fee.description && (
                        <p className="text-sm text-gray-200">{fee.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Information */}
            {park.contacts && (
              <div className="bg-paynes-gray rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-100 mb-4">
                  📞 Contact Information
                </h3>
                <div className="space-y-3 text-sm">
                  {park.contacts.phoneNumbers &&
                    park.contacts.phoneNumbers.length > 0 && (
                      <div>
                        <p className="font-medium text-gray-100 mb-1">Phone</p>
                        {park.contacts.phoneNumbers.map((phone, index) => (
                          <p key={index} className="text-xanthous">
                            {phone.phoneNumber}
                            {phone.description && ` (${phone.description})`}
                          </p>
                        ))}
                      </div>
                    )}

                  {park.contacts.emailAddresses &&
                    park.contacts.emailAddresses.length > 0 && (
                      <div>
                        <p className="font-medium text-gray-200 mb-1">Email</p>
                        {park.contacts.emailAddresses.map((email, index) => (
                          <a
                            key={index}
                            href={`mailto:${email.emailAddress}`}
                            className="text-xanthous hover:text-sinopia hover:underline block"
                          >
                            {email.emailAddress}
                          </a>
                        ))}
                      </div>
                    )}
                </div>
              </div>
            )}

            {/* Directions */}
            {park.directionsInfo && (
              <div className="bg-paynes-gray rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-200 mb-4">
                  🗺️ Directions
                </h3>
                <p className="text-sm text-gray-300 mb-4">
                  {park.directionsInfo}
                </p>
                {park.directionsUrl && (
                  <a
                    href={park.directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xanthous hover:text-sinopia hover:underline text-sm font-medium"
                  >
                    Get detailed directions {"->"}
                  </a>
                )}
              </div>
            )}

            {/* Weather */}
            {park.weatherInfo && (
              <div className="bg-paynes-gray rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-200 mb-4">
                  🌤️ Weather
                </h3>
                <p className="text-sm text-gray-300">{park.weatherInfo}</p>
              </div>
            )}

            {/* External Links */}
            <div className="bg-paynes-gray rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-200 mb-4">
                🔗 More Information
              </h3>
              <div className="space-y-2">
                {park.url && (
                  <a
                    href={park.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-xanthous hover:text-sinopia hover:underline text-sm"
                  >
                    Official Park Website {"->"}
                  </a>
                )}
                {park.latitude && park.longitude && (
                  <a
                    href={`https://www.google.com/maps?q=${park.latitude},${park.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-xanthous hover:text-sinopia hover:underline text-sm"
                  >
                    View on Google Maps {"->"}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

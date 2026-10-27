import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Favorite Parks | National Park Service',
  description: 'Your saved collection of national parks',
};

export default function FavoritesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

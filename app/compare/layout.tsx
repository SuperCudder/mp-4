import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Compare Parks | National Park Service',
  description: 'Compare features, activities, and entrance fees across up to 3 national parks side by side',
};

export default function CompareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

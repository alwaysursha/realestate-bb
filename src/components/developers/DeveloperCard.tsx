import Image from 'next/image';
import Link from 'next/link';

interface DeveloperCardProps {
  name: string;
  logo: string;
  description: string;
  projectCount: number;
  establishedYear: number;
  slug: string;
}

export default function DeveloperCard({
  name,
  logo,
  description,
  projectCount,
  establishedYear,
  slug
}: DeveloperCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <Link href={`/developers/${slug}`}>
        <div className="p-6">
          <div className="relative h-24 w-full mb-4">
            <Image
              src={logo}
              alt={`${name} logo`}
              fill
              style={{ objectFit: 'contain' }}
              className="transition-transform duration-300 hover:scale-105"
            />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{name}</h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>
          <div className="flex justify-between text-sm text-gray-500">
            <span>{projectCount} Projects</span>
            <span>Est. {establishedYear}</span>
          </div>
        </div>
      </Link>
    </div>
  );
} 
import { featuredProperties } from '../../../data/properties';

// This function generates all possible property IDs at build time
export async function generateStaticParams() {
  return featuredProperties.map((property) => ({
    id: property.id.toString(),
  }));
}

export default generateStaticParams; 
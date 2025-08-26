import { CarsPage } from '@/component-pages/CarsPage';
import { generatePageMetadata } from '@/lib/metadata';
import { getServerLanguage } from '@/lib/server-cookies';
import { StructuredData } from '@/components/ui/StructuredData';

export default function CarsPageRoute() {
  return (
    <>
      <StructuredData pageName="vehicles" />
      <CarsPage />
    </>
  );
}

// Generate dynamic metadata based on the user's language
export async function generateMetadata() {
  const language = await getServerLanguage();
  
  return generatePageMetadata({
    pageName: 'vehicles',
    language,
    additionalKeywords: [
      'car rental fleet',
      'luxury vehicles',
      'economy cars',
      'SUV rental',
      'automatic transmission',
      'manual transmission'
    ]
  });
}

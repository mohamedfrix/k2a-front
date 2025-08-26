import LandingPage from "@/component-pages/LandingPage";
import { generatePageMetadata } from '@/lib/metadata';
import { getServerLanguage } from '@/lib/server-cookies';

// Server Component - handles metadata generation
export default async function Home() {
  return (
    <>
      <LandingPage />
    </>
  );
}

// Generate dynamic metadata based on the user's language
export async function generateMetadata() {
  const language = await getServerLanguage();
  
  return generatePageMetadata({
    pageName: 'home',
    language,
    additionalKeywords: [
      'premium cars',
      'car booking',
      'vehicle reservation',
      'luxury car rental',
      'Algeria car rental'
    ]
  });
}
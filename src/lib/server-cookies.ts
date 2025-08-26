import { cookies } from 'next/headers';
import { Language, DEFAULT_LANGUAGE, LANGUAGE_COOKIE_NAME, SUPPORTED_LANGUAGES } from './language';

// Server-side function to get language from cookies
export async function getServerLanguage(): Promise<Language> {
  const cookieStore = await cookies();
  const language = cookieStore.get(LANGUAGE_COOKIE_NAME)?.value as Language;
  
  if (language && Object.keys(SUPPORTED_LANGUAGES).includes(language)) {
    return language;
  }
  
  return DEFAULT_LANGUAGE;
}

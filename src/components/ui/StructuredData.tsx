'use client';

import { useLanguage } from '@/hooks/useLanguage';
import { generateStructuredData } from '@/lib/metadata';

interface StructuredDataProps {
  pageName?: string;
}

export function StructuredData({ pageName }: StructuredDataProps) {
  const { language } = useLanguage();
  const structuredData = generateStructuredData(language, pageName);

  return (
    <>
      {structuredData.map((data, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(data),
          }}
        />
      ))}
    </>
  );
}

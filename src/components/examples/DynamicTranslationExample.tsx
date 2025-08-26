'use client';

import { useLanguage } from '../../hooks/useLanguage';

export function DynamicTranslationExample() {
  const { t, hasTranslation, getAllKeys, translations, language } = useLanguage();

  return (
    <div className="p-6 bg-gray-50 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Dynamic Translation System Demo</h2>
      
      {/* Basic translations */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Basic Translations:</h3>
        <p>Title: {t('aboutUs.title')}</p>
        <p>Welcome: {t('common.welcome')}</p>
      </div>

      {/* Deep nested translations */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Deep Nested Translations:</h3>
        <p>Form Name Field: {t('contact.form.fields.name')}</p>
        <p>Validation Message: {t('contact.form.validation.required')}</p>
        <p>Web Feature Title: {t('features.web.title')}</p>
      </div>

      {/* Dynamic key checking */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Dynamic Key Checking:</h3>
        <p>Has 'aboutUs.title': {hasTranslation('aboutUs.title') ? '✅ Yes' : '❌ No'}</p>
        <p>Has 'nonexistent.key': {hasTranslation('nonexistent.key') ? '✅ Yes' : '❌ No'}</p>
        <p>Missing key example: {t('this.key.does.not.exist')}</p>
      </div>

      {/* Array access (requires special handling) */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Complex Data Access:</h3>
        <p>First testimonial name: {translations.testimonials?.[0]?.name || 'Not found'}</p>
        <p>Web technologies: {translations.features?.web?.technologies?.join(', ') || 'Not found'}</p>
      </div>

      {/* All available keys */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Available Translation Keys ({language}):</h3>
        <div className="bg-white p-3 rounded max-h-40 overflow-y-auto">
          <ul className="text-sm">
            {getAllKeys().slice(0, 10).map(key => (
              <li key={key} className="font-mono">{key}</li>
            ))}
            {getAllKeys().length > 10 && (
              <li className="text-gray-500">... and {getAllKeys().length - 10} more</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

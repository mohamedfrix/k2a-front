import { useLanguage } from "@/context/LanguageContext";
import brochure_image from "@/assets/images/K2A Location de Voitures 1.svg";
import Image from "next/image";

export default function OurBrochure() {

    const { t, textDirection } = useLanguage();
    const minioUrl = process.env.NEXT_MINIO_URL || '';

  return (
    <div className="bg-primary w-full flex flex-col items-center">
        {/* Section Header */}
        <div className="text-center mb-16 mt-12">
          <h2 
            className="font-unbounded font-bold text-3xl sm:text-4xl lg:text-5xl mb-6 text-white"
            style={{ 
              direction: textDirection 
            }}
          >
            {t('brochure.title')}
          </h2>
          <p 
            className="font-inter text-lg sm:text-xl max-w-4xl mx-auto leading-relaxed text-white"
            style={{ 
              direction: textDirection,
              unicodeBidi: 'embed'
            }}
          >
            {t('brochure.description')}
          </p>
        </div>

        <Image
            src={"/images/K2A Location de Voitures 3.png"}
            alt="Brochure Image"
            width={500}
            height={300}
            className="mb-8"
          />

        <a 
            href={`/images/K2ABrochure.pdf`} 
            download 
            className="bg-white text-primary font-semibold px-6 py-3 rounded-md hover:bg-gray-100 transition"
        >
            {t('brochure.download')}
        </a>

        <div className="h-16"></div>
     
    </div>
  );
}
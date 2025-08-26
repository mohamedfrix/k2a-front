import { StaticImageData } from "next/image";

export interface WhyUsFeature {
  id: string;
  icon: string | StaticImageData;
  titleKey: string;
  descriptionKey: string;
  availability?: string;
}

export interface WhyUsCardProps {
  feature: WhyUsFeature;
  className?: string;
  variant?: 'default' | 'highlighted';
}

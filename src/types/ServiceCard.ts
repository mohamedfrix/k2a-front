import { StaticImageData } from "next/image";

export interface ServiceFeature {
  id: string;
  icon: string | StaticImageData;
  titleKey: string;
  descriptionKey: string;
  availability?: string;
}

export interface ServiceCardProps {
  feature: ServiceFeature;
  className?: string;
  variant?: 'default' | 'highlighted';
  onExplore?: () => void;
  onGetInfo?: () => void;
}

import type { StaticImageData } from 'next/image';

export type SlideImageSource =
  | string
  | StaticImageData
  | {
      primary: string | StaticImageData;
      fallback?: string | StaticImageData;
      width?: number | null;
      height?: number | null;
    };

export type Slide = {
  id: string;
  image: SlideImageSource;
  alt?: string;
  eyebrow?: string;
  headline?: string;
  copy?: string;
  badges?: string[];
  required?: boolean;
  ctas?: {
    bookUrl?: string;
    callTel?: string;
    menuUrl?: string;
    secondaryUrl?: string;
  };
};

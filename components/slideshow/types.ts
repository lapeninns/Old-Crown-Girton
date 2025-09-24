import type { StaticImageData } from 'next/image';

export type SlideImageSource =
  | string
  | StaticImageData
  | {
      primary: string | StaticImageData;
      fallback?: string | StaticImageData;
    };

export type Slide = {
  id: string;
  image: SlideImageSource;
  alt?: string;
  eyebrow?: string;
  headline?: string;
  copy?: string;
  badges?: string[];
  ctas?: {
    bookUrl?: string;
    callTel?: string;
  };
};

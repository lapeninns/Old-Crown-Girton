export type Slide = {
  id: string;
  image: string;
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

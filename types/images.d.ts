declare module '*.avif' {
  const src: import('next/image').StaticImageData;
  export default src;
}

declare module '*.webp' {
  const src: import('next/image').StaticImageData;
  export default src;
}

declare module '*.jpg' {
  const src: import('next/image').StaticImageData;
  export default src;
}

declare module '*.jpeg' {
  const src: import('next/image').StaticImageData;
  export default src;
}

declare module '*.png' {
  const src: import('next/image').StaticImageData;
  export default src;
}

// Default export as URL string for raw SVG; use ?component for React component via SVGR
declare module '*.svg' {
  const src: string;
  export default src;
}

declare module '*.svg?component' {
  import * as React from 'react';
  const Component: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  export default Component;
}


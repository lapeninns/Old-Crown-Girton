export interface ComponentImages {
  [componentName: string]: {
    [category: string]: {
      [imageName: string]: string;
    };
  };
}

export interface ImageVariantMap {
  light?: string;
  dark?: string;
  mobile?: string;
  tablet?: string;
  desktop?: string;
  active?: string;
  hover?: string;
  disabled?: string;
}


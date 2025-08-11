// Types for externalized runtime JSON content
export type Project = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  url?: string;
};

export type SiteData = {
  version: number;
  projects: Project[];
};

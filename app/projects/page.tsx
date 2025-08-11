"use client";
import { useData } from '@/hooks/useData';
import type { SiteData } from '@/types';
import ProjectCard from '@/components/ProjectCard';

export default function ProjectsPage() {
  const { data, error, loading } = useData<SiteData>('site.json');

  if (loading) return <Skeleton />;
  if (error) return <ErrorView message={error.message} />;
  if (!data) return null;

  return (
    <main className="mx-auto max-w-5xl p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
        <p className="text-sm text-gray-600">Content v{data.version}</p>
      </header>
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {data.projects.map((p) => <ProjectCard key={p.id} {...p} />)}
      </section>
    </main>
  );
}

function Skeleton() {
  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-40 animate-pulse rounded-2xl bg-gray-100" />
        ))}
      </div>
    </div>
  );
}

function ErrorView({ message }: { message: string }) {
  return <div className="mx-auto max-w-2xl p-6 text-red-600">Failed to load data: {message}</div>;
}

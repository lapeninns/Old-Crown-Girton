import type { Project } from '@/types';

export default function ProjectCard({ title, description, tags, url }: Project) {
  return (
    <article className="rounded-2xl border bg-neutral-50 p-5 shadow-sm hover:shadow-md transition">
      <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
      <p className="mt-2 text-sm text-brand-600">{description}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {tags.map((t) => (
          <span key={t} className="rounded-full border px-2 py-0.5 text-xs text-brand-600">#{t}</span>
        ))}
      </div>
      {url && <a className="mt-4 inline-block text-sm font-medium underline underline-offset-4" href={url} target="_blank" rel="noreferrer">Visit</a>}
    </article>
  );
}

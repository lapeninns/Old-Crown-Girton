import { NotFoundContent, NotFoundActions, NotFoundBackground } from './_components';

export default function Custom404() {
  return (
    <section className="relative bg-neutral-50 text-neutral-900 min-h-screen w-full flex flex-col justify-center gap-8 items-center p-10">
      <NotFoundBackground />
      <NotFoundContent />
      <NotFoundActions />
    </section>
  );
}
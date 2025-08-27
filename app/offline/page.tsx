"use client";

import { OfflineStatus, OfflineFeatures, OfflineActions, OfflineBackground } from './_components';

export default function OfflinePage() {
  return (
    <section className="relative bg-neutral-50 text-neutral-900 min-h-screen w-full flex flex-col justify-center gap-8 items-center p-10">
      <OfflineBackground />
      <OfflineStatus />
      <OfflineFeatures />
      <OfflineActions />
    </section>
  );
}
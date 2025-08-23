import React from 'react';
import type { Menu as MenuType } from '@/src/lib/data/schemas';
import { getMenuSmart } from '@/src/lib/data/loader';
import ErrorBoundary from '@/src/components/common/ErrorBoundary';
import Menu from '@/src/components/menu/Menu';

// This file keeps the route/component but defers all data to the data layer and Menu component

async function getData(): Promise<MenuType | null> {
  try {
  return await getMenuSmart();
  } catch (e) {
    return null;
  }
}

export default async function MenuContainer() {
  const data = await getData();
  if (!data) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="p-6 bg-accent-50 border border-accent-200 rounded">
          Failed to load menu at this time. Please try again later.
        </div>
      </div>
    );
  }
  return (
    <ErrorBoundary>
      <Menu menu={data} />
    </ErrorBoundary>
  );
}

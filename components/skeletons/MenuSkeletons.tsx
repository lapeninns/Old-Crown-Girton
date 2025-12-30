import React from 'react';
import { Skeleton } from './Skeleton';

export function MenuInteractiveSkeleton() {
    return (
        <div className="min-h-96 bg-white py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar / Filters Skeleton */}
                    <div className="w-full lg:w-1/4 space-y-6">
                        <Skeleton className="h-10 w-full rounded-lg" />
                        <div className="space-y-3">
                            <Skeleton className="h-6 w-3/4" />
                            <div className="flex flex-wrap gap-2">
                                <Skeleton className="h-8 w-20 rounded-full" />
                                <Skeleton className="h-8 w-24 rounded-full" />
                                <Skeleton className="h-8 w-16 rounded-full" />
                            </div>
                        </div>
                    </div>

                    {/* Main Content Skeleton */}
                    <div className="w-full lg:w-3/4 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="border border-neutral-200 rounded-lg p-4 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-2 w-2/3">
                                            <Skeleton className="h-6 w-3/4" />
                                            <Skeleton className="h-4 w-full" />
                                            <Skeleton className="h-4 w-1/2" />
                                        </div>
                                        <Skeleton className="h-20 w-20 rounded-md" />
                                    </div>
                                    <div className="flex justify-between items-center pt-2">
                                        <Skeleton className="h-6 w-16" />
                                        <Skeleton className="h-8 w-8 rounded-full" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function MenuHeroSkeleton() {
    return (
        <section className="relative bg-gradient-to-br from-brand-600 to-brand-800 text-white py-16 md:py-24">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div>
                    <Skeleton className="h-12 bg-white/20 rounded w-3/4 mx-auto mb-4" />
                    <Skeleton className="h-6 bg-white/10 rounded w-1/2 mx-auto mb-8" />
                    <div className="flex justify-center gap-4">
                        <Skeleton className="h-12 w-32 bg-white/20 rounded-lg" />
                        <Skeleton className="h-12 w-36 bg-white/20 rounded-lg" />
                    </div>
                </div>
            </div>
        </section>
    );
}

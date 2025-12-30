import React from 'react';
import { Skeleton } from './Skeleton';

export function NavbarSkeleton() {
    return (
        <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm h-16 border-b border-gray-200">
            <div className="container mx-auto px-4 h-full flex items-center justify-between">
                <Skeleton className="h-8 w-32" />
                <div className="hidden md:flex space-x-6">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                </div>
                <Skeleton className="h-8 w-24" />
            </div>
        </div>
    );
}

export function HeroSkeleton() {
    return (
        <div className="h-screen bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center">
            <div className="text-center space-y-4">
                <Skeleton className="h-12 w-96 mx-auto bg-neutral-300" />
                <Skeleton className="h-6 w-64 mx-auto bg-neutral-300" />
            </div>
        </div>
    );
}

export function PressFeatureSkeleton() {
    return (
        <div className="bg-brand-700 py-10 md:py-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
                <Skeleton className="h-4 w-32 bg-white/30" />
                <Skeleton className="h-8 w-3/4 bg-white/40" />
                <Skeleton className="h-4 w-full md:w-2/3 bg-white/30" />
            </div>
        </div>
    );
}

export function SectionStartSkeleton() {
    return (
        <div className="h-96 bg-neutral-50">
            <div className="container mx-auto px-4 py-16 space-y-6">
                <Skeleton className="h-8 w-1/2 mx-auto bg-neutral-200" />
                <Skeleton className="h-4 w-3/4 mx-auto bg-neutral-200" />
                <Skeleton className="h-4 w-2/3 mx-auto bg-neutral-200" />
            </div>
        </div>
    );
}

export function MenuHighlightsSkeleton() {
    return (
        <div className="h-96 bg-neutral-50">
            <div className="container mx-auto px-4 py-16 space-y-6">
                <Skeleton className="h-8 w-1/3 mx-auto bg-neutral-200" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-32 bg-neutral-200" />
                    ))}
                </div>
            </div>
        </div>
    );
}

export function StandardSectionSkeleton({ height = "h-64" }: { height?: string }) {
    return <Skeleton className={`${height} bg-neutral-50 w-full mb-8`} />;
}

export function LocationSkeleton() {
    return (
        <div className="h-96 bg-neutral-50">
            <div className="container mx-auto px-4 py-16 space-y-6">
                <Skeleton className="h-6 w-1/4 bg-neutral-200" />
                <Skeleton className="h-64 w-full bg-neutral-200" />
            </div>
        </div>
    );
}

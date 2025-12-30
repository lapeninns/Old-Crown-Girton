import React from 'react';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "circle";
}

export function Skeleton({
    className,
    variant = "default",
    ...props
}: SkeletonProps) {
    const baseClasses = "animate-pulse bg-neutral-200 rounded";
    const variantClasses = variant === "circle" ? "rounded-full" : "";
    const combinedClasses = `${baseClasses} ${variantClasses} ${className || ""}`.trim();

    return (
        <div
            className={combinedClasses}
            {...props}
        />
    );
}

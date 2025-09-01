import React from "react";

interface SkeletonProps {
  className?: string;
  count?: number;
  variant?: "text" | "card" | "list" | "table" | "image";
}

const Skeleton: React.FC<SkeletonProps> = ({
  className,
  count = 1,
  variant = "text",
}) => {
  const skeletons = Array.from({ length: count }, (_, i) => {
    let skeletonClass = "bg-gray-300 rounded animate-pulse";
    switch (variant) {
      case "text":
        skeletonClass += " h-4 w-full";
        break;
      case "card":
        skeletonClass += " h-48 w-full";
        break;
      case "list":
        skeletonClass += " h-12 w-full";
        break;
      case "table":
        skeletonClass += " h-96 w-full";
        break;
      case "image":
        skeletonClass += " h-64 w-full";
        break;
      default:
        skeletonClass += " h-4 w-full";
    }
    return <div key={i} className={`${skeletonClass} ${className || ""}`}></div>;
  });

  return <>{skeletons}</>;
};

export default Skeleton;

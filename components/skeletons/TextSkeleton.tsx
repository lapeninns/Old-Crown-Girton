import React from "react";
import Skeleton from "./Skeleton";

const TextSkeleton: React.FC<{ className?: string; count?: number }> = ({
  className,
  count,
}) => {
  return <Skeleton variant="text" className={className} count={count} />;
};

export default TextSkeleton;

import React from "react";
import Skeleton from "./Skeleton";

const ImageSkeleton: React.FC<{ className?: string; count?: number }> = ({
  className,
  count,
}) => {
  return <Skeleton variant="image" className={className} count={count} />;
};

export default ImageSkeleton;

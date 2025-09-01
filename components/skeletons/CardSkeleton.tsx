import React from "react";
import Skeleton from "./Skeleton";

const CardSkeleton: React.FC<{ className?: string; count?: number }> = ({
  className,
  count,
}) => {
  return <Skeleton variant="card" className={className} count={count} />;
};

export default CardSkeleton;

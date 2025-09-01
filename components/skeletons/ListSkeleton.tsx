import React from "react";
import Skeleton from "./Skeleton";

const ListSkeleton: React.FC<{ className?: string; count?: number }> = ({
  className,
  count,
}) => {
  return <Skeleton variant="list" className={className} count={count} />;
};

export default ListSkeleton;

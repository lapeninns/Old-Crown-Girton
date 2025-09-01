import React from "react";
import Skeleton from "./Skeleton";

const TableSkeleton: React.FC<{ className?: string; count?: number }> = ({
  className,
  count,
}) => {
  return <Skeleton variant="table" className={className} count={count} />;
};

export default TableSkeleton;

import React from "react";
import { CardSkeleton, TextSkeleton } from "./skeletons";

const PageSkeleton: React.FC = () => {
  return (
    <div className="p-4">
      <TextSkeleton count={1} className="w-1/4 mb-4" />
      <CardSkeleton className="mb-4" />
      <TextSkeleton count={5} />
    </div>
  );
};

export default PageSkeleton;

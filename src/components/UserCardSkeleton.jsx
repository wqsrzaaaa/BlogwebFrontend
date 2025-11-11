import React from "react";

export default function UserCardSkeleton() {
  return (
    <div className="flex items-center justify-between p-2 rounded-lg animate-pulse border border-gray-200 dark:border-gray-600">
      <div className="flex items-center gap-2">
        {/* Profile Image Skeleton */}
        <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600"></div>

        <div className="flex flex-col gap-1">
          {/* Username Skeleton */}
          <div className="w-24 h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
          {/* Bio Skeleton */}
          <div className="w-32 h-2 bg-gray-200 dark:bg-gray-600 rounded"></div>
        </div>
      </div>

      {/* Button Skeleton */}
      <div className="w-20 h-7 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
    </div>
  );
}

import React from "react";

export default function BlogSkeleton() {
  return (
    <div className="rounded-2xl border-zinc-400 dark:border-gray-700 shadow-md hover:shadow-lg p-2 flex flex-col sm:flex-row-reverse gap-4 animate-pulse">
      {/* Image Skeleton */}
      <div className="w-full sm:w-40 h-48 sm:h-32 bg-gray-300 dark:bg-gray-600 rounded-xl" />

      {/* Text Skeleton */}
      <div className="flex-1 w-full space-y-3">
        {/* Title */}
        <div className="w-3/4 h-6 bg-gray-300 dark:bg-gray-600 rounded" />

        {/* Description */}
        <div className="w-full h-4 bg-gray-300 dark:bg-gray-600 rounded" />
        <div className="w-5/6 h-4 bg-gray-300 dark:bg-gray-600 rounded" />
        <div className="w-4/6 h-4 bg-gray-300 dark:bg-gray-600 rounded" />

        {/* Author + Likes */}
        <div className="flex items-center justify-between mt-2">
          {/* Author */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full" />
            <div className="w-20 h-4 bg-gray-300 dark:bg-gray-600 rounded" />
          </div>

          {/* Likes */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full" />
            <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full" />
            <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full" />
            <div className="w-12 h-4 bg-gray-300 dark:bg-gray-600 rounded ml-2" />
          </div>
        </div>

        {/* Date */}
        <div className="w-16 h-3 bg-gray-300 dark:bg-gray-600 rounded mt-2 md:hidden block" />
      </div>
    </div>
  );
}

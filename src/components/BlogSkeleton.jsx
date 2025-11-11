import React from "react";

export default function BlogSkeleton() {
  return (
    <div className="min-h-screen md:py-10 py-2 px-2 md:px-10 animate-pulse">
      {/* Banner Skeleton */}
      <div className="relative w-full h-[50vh] md:h-[60vh] rounded-xl overflow-hidden shadow-lg bg-gray-300 dark:bg-gray-600"></div>

      <div className="max-w-4xl mx-auto mt-10 bg-white dark:bg-gray-600 rounded-xl shadow p-6 md:p-10">
        {/* Author info skeleton */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="w-[60px] h-[60px] bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            <div className="flex flex-col gap-2">
              <div className="w-32 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
              <div className="w-24 h-3 bg-gray-200 dark:bg-gray-600 rounded"></div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="space-y-3 mt-6">
          <div className="w-full h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
          <div className="w-5/6 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
          <div className="w-4/6 h-4 bg-gray-200 dark:bg-gray-600 rounded"></div>
          <div className="w-full h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
          <div className="w-3/4 h-4 bg-gray-200 dark:bg-gray-600 rounded"></div>
        </div>

        {/* Buttons Skeleton */}
        <div className="flex gap-4 mt-10">
          <div className="w-24 h-10 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
          <div className="w-24 h-10 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}

import React from 'react'

const SkeletonUI = () => {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer animate-pulse"
        >
          <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded-md w-3/4 mb-3"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded-md w-full mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded-md w-5/6"></div>
        </div>
      ))}
    </div>
  )
}

export default SkeletonUI

"use client";

import { Suspense } from "react";
import SearchBlogCom from "./_searchBlogs/SearchBlogsCom";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <SearchBlogCom />
    </Suspense>
  );
}

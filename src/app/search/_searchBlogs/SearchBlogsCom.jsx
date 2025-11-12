"use client"

import Navbar from '@/(Components)/Navbar';
import SkeletonUI from '@/components/SkeletonUI';
import { useBlogStore } from '@/store/Store';
import { motion } from 'framer-motion'
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import Link from 'next/link';

const SearchBlogCom = () => {

  const [blogs, setBlogs] = useState([]);
  const router = useRouter()
  const seachparams = useSearchParams()
  const query = seachparams.get("q") || ""
  const [loading, setloading] = useState(true)

  const fetchBlogs = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/all`);
      const data = await res.json();
      const filtered = data.data.filter((blog) =>
        blog.title.toLowerCase().includes(query.toLowerCase())
      );
      setBlogs(filtered);
    } catch (error) {
      console.log(error);
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    fetchBlogs()
  }, [query])

  const setSelectedBlog = useBlogStore(state => state.setSelectedBlog)

 function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
    });
  }
  if (loading)
    return (
      <>
        <Navbar />
        <div className="mt-24 px-8">
          <h1 className="text-2xl font-bold mb-4">
            Searching for: <span className="text-orange-500">{query}</span>
          </h1>
          <SkeletonUI />
        </div>
      </>
    );

  return (
    <>
      <Navbar />
      <div className="mt-24 px-2 md:px-8">

        <h1 className="text-2xl font-bold mb-4">
          Search Results for: <span className="text-orange-500">{query}</span>
        </h1>

        {blogs.length > 0 ? (
          <div className="space-y-4">
            <div className="space-y-8">
              {
                blogs.map((blog) => (
                  <motion.div
                    key={blog._id}
                    onClick={() => {
                      setSelectedBlog(blog);
                      router.push(`/story/${blog._id}`);
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="rounded-2xl hover:scale-101 md:dark:border-b-1 border-zinc-400 dark:shadow-none cursor-pointer h-fit p-2 shadow-md hover:shadow-lg transition flex flex-col sm:flex-row-reverse items-center sm:items-start gap-4"
                  >
                    {/* Image */}
                    <img
                      src={
                        blog.image ||
                        "https://tse2.mm.bing.net/th/id/OIP.90sDWdblfZFiciIEpsGFwwHaEY?rs=1&pid=ImgDetMain&o=7&rm=3"
                      }
                      alt={blog.title || "Blog cover"}
                      className="w-full sm:w-40 h-48 sm:h-32 object-cover rounded-xl"
                    />

                    {/* Text content */}
                    <div className="flex-1 w-full">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-1">
                        {blog.title || "Blog Title Goes Here"}
                      </h2>
                      <p
                        className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-3"
                        dangerouslySetInnerHTML={{ __html: blog.description }}
                      />

                      <div className="flex items-center justify-between">
                        {/* Author + Liked by */}
                        <div className="flex items-center gap-3">
                          {/* Author */}
                          <div className="flex items-center gap-2">
                            <img
                              src={blog.author?.profile || "/defaultprofile.png"}
                              alt={blog.author?.username || "Author"}
                              className="w-8 h-8 rounded-full  object-cover"
                            />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {blog.author?.username || "user"}
                            </span>
                          </div>

                          {/* Liked by users */}
                          <div className="flex items-center -space-x-2">
                            {blog.likes?.slice(0, 3).map((user, index) => (
                              <img
                                key={index}
                                src={user.profile || "/defaultprofile.png"}
                                alt={user.username || `User${index + 1}`}
                                className="w-6 h-6 object-cover rounded-full border border-white"
                              />
                            ))}
                            {blog.likes?.length > 0 && (
                              <span className="text-xs text-gray-500 dark:text-gray-300 ml-4">
                                +{blog.likes.length} liked
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <p className="text-zinc-400 md:hidden block text-sm mt-2">{formatDate(blog.date)}</p>
                    </div>
                  </motion.div>
                ))
              }
              <p className='w-full h-22 flex items-center justify-center'>A list of your recent search <span className='text-orange-400 pl-2'> '{query}'</span> </p>
            </div>
          </div>
        ) : (
          <div className="min-h-[70vh] flex flex-col items-center justify-center md:px-4">
            <div className="flex flex-col items-center">
              {/* Animated SVG */}
              <div className="w-[320px] h-[320px] relative  left-1/2  -translate-x-1/3">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  {/* shadow */}
                  <ellipse cx="100" cy="170" rx="48" ry="8" fill="#000" opacity="0.08" />
                  {/* paper (card) */}
                  <g className="paper" transform="translate(40,30)">
                    <rect x="0" y="0" width="120" height="140" rx="8" fill="#fff" stroke="#e6e6e6" />
                    {/* folded corner */}
                    <path d="M120 0 L100 0 L120 20 Z" fill="#f8f8f8" />
                    {/* lines */}
                    <g opacity="0.8">
                      <rect x="12" y="18" width="96" height="8" rx="2" fill="#f0f0f3" />
                      <rect x="12" y="34" width="80" height="6" rx="2" fill="#f0f0f3" />
                      <rect x="12" y="48" width="96" height="6" rx="2" fill="#f0f0f3" />
                      <rect x="12" y="62" width="96" height="6" rx="2" fill="#f0f0f3" />
                    </g>
                    {/* little "404" stamp */}
                    <g transform="translate(12,100)">
                      <rect x="0" y="0" width="66" height="20" rx="4" fill="#fff2e8" stroke="#ffd6b3" />
                      <text x="33" y="14" textAnchor="middle" fontSize="10" fontFamily="sans-serif" fill="#ff7a18">Not Found</text>
                    </g>
                  </g>

                  {/* magnifying glass (animated) */}
                  <g className="magnifier" transform="translate(80,120)">
                    <circle cx="0" cy="0" r="20" fill="#fff" stroke="#cbd5e1" strokeWidth="4" />
                    <circle cx="0" cy="0" r="14" fill="#f8fafc" />
                    <line x1="14" y1="14" x2="30" y2="30" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
                    {/* highlight */}
                    <circle cx="-5" cy="-5" r="3.5" fill="#e0f2ff" opacity="0.9" />
                    {/* magnifier lens sweep (animated) */}
                    <rect x="-14" y="-2" width="28" height="4" rx="2" fill="#e6f2ff" className="sweep" />
                  </g>
                </svg>
              </div>

              <p className="mt-2 text-gray-500 text-center max-w-xl">No blog with name <span className='text-orange-400'>{query}</span></p>

              <div className="mt-6 flex gap-3">
                <Link href="/" className="px-4 py-2 rounded-lg bg-orange-500 text-white hover:brightness-95">
                  Go Home
                </Link>
                <button
                  onClick={() => location.reload()}
                  className="px-4 py-2  rounded-lg border border-gray-200  hover:bg-gray-50"
                >
                  Retry
                </button>
              </div>
            </div>
            <style jsx>{`
        .paper {
          transform-origin: center;
          animation: bob 3s ease-in-out infinite;
        }

        .magnifier {
          transform-origin: center;
          animation: mag-move 3s ease-in-out infinite;
        }

        .sweep {
          transform-origin: center;
          animation: sweep 1.6s linear infinite;
          opacity: 0.9;
        }

        @keyframes bob {
          0% { transform: translateY(0) rotate(-2deg); }
          50% { transform: translateY(-6px) rotate(1deg); }
          100% { transform: translateY(0) rotate(-2deg); }
        }

        @keyframes mag-move {
          0% { transform: translate(40px, 70px) rotate(12deg) scale(1); }
          50% { transform: translate(60px, 50px) rotate(-6deg) scale(1.04); }
          100% { transform: translate(40px, 70px) rotate(12deg) scale(1); }
        }

        @keyframes sweep {
          0% { transform: translateX(-12px) scaleX(0.2); opacity: 0.0; }
          20% { transform: translateX(-9px) scaleX(0.45); opacity: 0.25; }
          50% { transform: translateX(0px) scaleX(1); opacity: 0.9; }
          80% { transform: translateX(9px) scaleX(0.45); opacity: 0.25; }
          100% { transform: translateX(12px) scaleX(0.2); opacity: 0.0; }
        }
      `}</style>
          </div>
        )}
      </div>

    </>
  );
}

export default SearchBlogCom
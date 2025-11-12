"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation } from "swiper/modules";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useBlogStore } from "@/store/Store";
import { ArrowLeftRight, ArrowRight } from "lucide-react";

export default function CardSlider() {
  const [loading, setLoading] = useState(true);
  const [allBlogs, setAllBlogs] = useState([]);
  const router = useRouter();
  const setSelectedBlog = useBlogStore((state) => state.setSelectedBlog);

  useEffect(() => {
    const allBlogsFetching = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/all`);
        if (!res.ok) throw new Error("Error fetching all blogs");
        const data = await res.json();
        setAllBlogs(data.data || []);
      } catch (error) {
        console.log("err", error);
      } finally {
        setLoading(false);
      }
    };

    allBlogsFetching();
  }, []);

  const storyBlogs = allBlogs.filter((blog) =>
    blog.Categories.some((cat) => cat.toLowerCase() === "story")
  );

  const skeletonArray = Array(3).fill(null);

  return (
    <div className="w-full px-2 md:px-6 mt-20">
      <h1 className="text-xl md:pb-6 pb-0">Top Stories Today</h1>
      <p className="text-sm pb-5 flex items-center flex-nowrap md:hidden text-red-500">Slide to see more <ArrowRight size={17} /></p>

      {loading ? (
        <Swiper
          modules={[Pagination, Navigation]}
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{
            0: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {skeletonArray.map((_, num) => (
            <SwiperSlide
              key={num}
              className="shadow-md rounded-xl !overflow-hidden relative flex items-center justify-center text-white text-xl font-semibold swiper-slide-custom"
              style={{ height: "35vh" }}
            >
              {/* Image skeleton */}
              <div className="w-full h-full bg-zinc-200 dark:bg-gray-600 rounded-xl relative overflow-hidden">
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
              </div>

              {/* Content skeleton */}
              <div className="w-full h-1/2 absolute bottom-0 flex flex-col z-10 p-3 justify-center gap-2">
                <div className="h-4 bg-zinc-300 dark:bg-gray-600 rounded w-2/3 relative overflow-hidden">
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer"></div>
                </div>
                <div className="h-3 bg-zinc-300 dark:bg-gray-600 rounded w-4/5 relative overflow-hidden">
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer"></div>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <div className="w-6 h-6 bg-zinc-300 dark:bg-gray-600 rounded-full relative overflow-hidden">
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer"></div>
                  </div>
                  <div className="h-3 bg-zinc-300 dark:bg-gray-600 rounded w-20 relative overflow-hidden">
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer"></div>
                  </div>
                </div>
              </div>

              {/* Overlay */}
              <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/80 via-black/40 to-transparent rounded-b-xl"></div>
            </SwiperSlide>
          ))}

        </Swiper>
      )
        : (
          <Swiper
            modules={[Pagination, Navigation]}
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{
              0: { slidesPerView: 1 },
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {storyBlogs.map((blog, num) => (
              <SwiperSlide
                onClick={() => {
                  setSelectedBlog(blog);
                  router.push(`/story/${blog._id}`);
                }}
                key={num}
                className="shadow-md rounded-xl cursor-pointer !overflow-hidden gap-12 relative flex items-center text-white justify-center text-xl font-semibold"
                style={{ height: "35vh", }}
              >
                <img
                  src={blog.image}
                  alt="story"
                  className="w-full h-full object-center rounded-xl object-cover"
                />
                <div className="w-full h-[60%] absolute bottom-0 flex flex-col z-3 p-3 justify-end gap-1">
                  <div>
                    <h1 className="text-[15px]">{blog.title}</h1>
                  <p className="text-sm text-zinc-300 font-extralight">
                    {blog.description.replace(/<[^>]+>/g, "").slice(0, 40)}...
                  </p>
                  </div>

                  <div className="flex gap-2">
                    <img
                      src={
                        blog.author.profile
                          ? blog.author.profile
                          : "/defaultprofile.png"
                      }
                      alt="profile"
                      className="w-6 h-6 rounded-full"
                    />
                    <p className="text-sm font-light">{blog.author.username}</p>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/80 via-black/40 to-transparent rounded-b-xl"></div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
    </div>
  );
}

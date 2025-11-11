"use client";
import { useBlogStore } from "@/store/Store";
import Image from "next/image";
import { Facebook, Twitter, Linkedin, ArrowUpFromLine } from "lucide-react";
import Navbar from "@/(Components)/Navbar";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function StoryPage() {
  const blog = useBlogStore((state) => state.selectedBlog);
  const router = useRouter();
  const [currentUser, setcurrentUser] = useState(null)
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const user = Cookies.get('user')

  const fetchUser = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/current-user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      if (!res.ok) {
        console.log("error in fetching user");
      }
      const data = await res.json()
      setcurrentUser(data.user)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (!blog) {
      router.push("/");
    } else {
      setLikes(blog.likes?.length || 0);

      const userId = Cookies.get("userId");
      if (blog.likes?.some((u) => u._id === userId)) {
        setIsLiked(true);
      }
    }
  }, [blog, router]);

  const handleLike = async () => {
    if (!blog) return;
    if (!user) {
      router.push('/signin')
      return;
    }
    setIsLiked((prev) => !prev);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/${blog._id}/like`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );

      const data = await res.json();

      if (res.ok) {
        setLikes(data.likes.length);
        setIsLiked(data.likes);
      } else {
        console.error("Like failed:", data.message);
      }
    } catch (err) {
      console.error("Error liking blog:", err);
    }
  };

  useEffect(() => {
    fetchUser()
  }, [])


   function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
    });
  }

  useEffect(() => {
    const myLike = blog?.likes?.some((e) => e._id === user)
    setIsLiked(myLike)
  }, [blog?.likes])

  if (!blog) return null;
  return (
    <>
      <Navbar />
      <div className="min-h-screen mt-15">
        {/* Blog Banner */}
        <div className="relative w-full  h-[40%] md:h-[70vh]">
          <img src={blog.image} alt={"story"}
            className="w-full h-full object-contain object-center  relative z-2" />
          <div className="w-full h-full bg-black/40 absolute top-0 left-0 z-3"></div>
          <div className="absolute inset-0 bg-gradient-to-l from-gray-700 to-gray-950 bg-opacity-40 flex items-end p-2 sm:p-6">
            <h1 className="text-white relative z-4 text-xl sm:text-5xl font-bold">{blog.title}</h1>
          </div>
        </div>

        {/* Blog Info */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <Image
                src={blog.author?.profile || "/defaultprofile.png"}
                alt={blog.author?.username || "Author"}
                width={50}
                height={50}
                onClick={()=> router.push(`/user/profile/${blog.author._id}`)}
                className="rounded-full w-14 h-14 object-cover cursor-pointer"
              />
              <div>
                <p className="font-semibold text-gray-800 dark:text-white">{blog.author?.username || "Unknown"}</p>
                <p className="text-gray-500 dark:text-gray-300 text-sm">{new Date(blog.date).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-gray-500 dark:text-gray-300 text-sm">Share:</span>
              <Facebook className="text-blue-600 cursor-pointer hover:scale-110 transition" />
              <Twitter className="text-blue-400 cursor-pointer hover:scale-110 transition" />
              <Linkedin className="text-blue-700 cursor-pointer hover:scale-110 transition" />
            </div>
          </div>

          {blog.Categories && (
            <div className="mb-6 flex gap-2">
              {blog.Categories.map((cat , i) => (
                <span key={i} className="bg-blue-100 text-blue-800 dark:text-gray-300 dark:bg-gray-800 text-xs font-medium px-3 py-1 rounded-full">
                  {cat}
                </span>
              ))}
            </div>
          )}

          {/* Blog Content */}
          <div className="prose prose-lg prose-slate max-w-none dark:text-gray-100 text-gray-800">
            <p dangerouslySetInnerHTML={{ __html: blog.description }} />
          </div>

          <p className="text-zinc-400">{formatDate(blog.date)}</p>

          <div className="mt-12 flex items-center gap-4">
            <motion.div
              whileTap={{ scale: 0.8 }}
              animate={{ scale: likes ? 1.2 : 1 }}
              transition={{ type: "spring", stiffness: 300 }}
              onClick={handleLike}
            >
              <ArrowUpFromLine
                size={22}
                className={`cursor-pointer transition-colors duration-300 ${isLiked ? "text-red-500" : "text-zinc-800 dark:text-gray-300"} `}
              />
            </motion.div>

            <div className="flex items-center -space-x-2">
              {blog.likes?.slice(0, 3).map((user, index) => (
                <img
                  key={index}
                  src={user.profile || "/defaultprofile.png"}
                  alt={user.username || `User${index + 1}`}
                  className="w-6 h-6 rounded-full border border-white"
                />
              ))}
              {blog.likes?.length > 0 && (
                <span className="text-xs text-gray-500 dark:text-gray-300 ml-4">
                  +{blog?.likes?.length} like
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

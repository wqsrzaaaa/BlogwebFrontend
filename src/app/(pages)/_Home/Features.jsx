"use client";

import { useEffect, useState } from "react";
import { UserPlus } from "lucide-react";
import Image from "next/image";
import Cookies from "js-cookie";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useBlogStore } from "@/store/Store";
import UserCardSkeleton from "@/components/UserCardSkeleton";
import BlogSkeleton from "@/components/BlogSkeleton";

export default function Features({ showLogin, setShowLogin }) {
  const [activeTab, setActiveTab] = useState("foryou");
  const [users, setusers] = useState([])
  const [loading, setloading] = useState(true)
  const [currentUser, setcurrentUser] = useState(null)
  const [allBlogs, setAllBlogs] = useState([]);
  const [interestBlogs, setInterestBlogs] = useState([]);
  const router = useRouter()

  const categoriesList = [
    "Technology",
    "Design",
    "Lifestyle",
    "Health",
    "Travel",
    "Food",
    "Education",
    "Business",
    "story"
  ];


  const token = Cookies.get("token")
  const fetchUser = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/current-user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        console.log("error in fetching user");
        return;
      }
      const data = await res.json();
      setcurrentUser(data.user);

      if (data.user?.following) {
        setFollowing(data.user.following.map(u => u._id));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setloading(false)
    }
  };


  const allUsers = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/alluser`);
      if (!res.ok) {
        console.log("Error fetching all users");
        return;
      }
      const data = await res.json();
      setusers(data.users)
    } catch (err) {
      console.error("Fetch failed:", err);
    } finally {
      setloading(false)
    }
  };
  const [following, setFollowing] = useState([]);

  const flwFeature = async (targetUserId) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/follow/${targetUserId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ currentUserId: currentUser._id }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setFollowing((prev) =>
          prev.includes(targetUserId) ? prev : [...prev, targetUserId]
        );

        setcurrentUser((prev) => ({
          ...prev,
          following: prev.following.includes(targetUserId)
            ? prev.following
            : [...prev.following, targetUserId],
        }));
      } else {
        console.error("Follow failed:", data.message);
      }
    } catch (error) {
      console.log("Error in follow:", error);
    }
  };

  const unflwFeature = async function (targetUserId) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/unfollow/${targetUserId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `bearer ${token}`
        },
        body: JSON.stringify({ currentUserId: currentUser._id }),
      })
      const data = await res.json()
      if (res.ok) {
        setFollowing((prev) => prev.filter((e) => e !== targetUserId))

        setcurrentUser((prev) => ({
          ...prev,
          following: prev.following.filter((id) => id !== targetUserId)
        }))
      } else {
        console.log("error in unfollowing");

      }
    } catch (error) {
      console.log("error in unflw" + error);
    }
  }





  const allBlogsfetching = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/all`);
      if (!res.ok) {
        console.log("error in fetching allBlogs");
      }
      const data = await res.json();
      const blogs = data.data;
      setAllBlogs(blogs);
    } catch (error) {
      console.log("err" + error);
    } finally {
      setloading(false);
    }
  };
  const handleCategoryToggle = (category) => {
    if (currentUser) {
      const lowerCat = category.toLowerCase();
      let updated;

      if (interestBlogs.includes(lowerCat)) {
        updated = interestBlogs.filter((c) => c !== lowerCat);
      } else {
        updated = [...interestBlogs, lowerCat];
      }
      setInterestBlogs(updated);
    } else {
      setShowLogin(true)
    }
  };

  useEffect(() => {
    if (showLogin) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showLogin]);




  const filterBlogs = interestBlogs.length === 0
    ? allBlogs
    : allBlogs.filter((blog) =>
      interestBlogs.some((cat) =>
        blog.Categories.some((c) => c.toLowerCase() === cat.toLowerCase())
      )
    );
  const followingBlogs = currentUser?.following?.flatMap(user => user.blogs || []);


  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
    });
  }



  useEffect(() => {
    allUsers()
    fetchUser()
    allBlogsfetching()
  }, [])

  const [showAll, setShowAll] = useState(false);

  const filterUser = currentUser
    ? users.filter((e) => e._id !== currentUser._id)
    : users;

  const usersToShow = showAll ? filterUser : filterUser.slice(0, 5);
  const setSelectedBlog = useBlogStore(state => state.setSelectedBlog);


  return (
    <div className="w-full flex gap-6 px-2 md:px-6 py-6 relative">
      <div className="w-full  mt-6">
        {/* Tabs */}
        <div className="flex  gap-6 border-b ">
          <button
            onClick={() => setActiveTab("foryou")}
            className={`pb-2 text-lg font-medium border-orange-400 cursor-pointer transition ${activeTab === "foryou"
              ? "border-b-2  text-black dark:text-white"
              : "text-gray-500 hover:text-black dark:hover:text-white"
              }`}
          >
            For You
          </button>
          <button
            onClick={() => setActiveTab("following")}
            className={`pb-2 text-lg font-medium border-orange-400 cursor-pointer transition ${activeTab === "following"
              ? "border-b-2  text-black dark:text-white"
              : "text-gray-500 hover:text-black dark:hover:text-zinc-300"
              }`}
          >
            Following
          </button>
        </div>
        {/* Content Area */}
        <div className="mt-4 w-full rounded-xl min-h-[200px]">
          {activeTab === "foryou" && (
            <>
              {/* Show 2 skeletons while loading or before blogs render */}
              {loading && (
                <div className="flex flex-col gap-5">
                  <BlogSkeleton />
                </div>
              )}

              {!loading && filterBlogs.length > 0 ? (
                <div className="flex flex-col gap-5 !bg-transparent m-0 w-full">
                  <AnimatePresence>
                    {filterBlogs.map((blog) => (
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
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                !loading && <p>No blogs available</p>
              )}
            </>
          )}
          {activeTab === "following" && (
            <>
              {loading ? (
                <div className="flex flex-col gap-5">
                  <BlogSkeleton />
                  <BlogSkeleton />
                </div>
              ) : followingBlogs && followingBlogs.length > 0 ? (
                <div className="flex flex-col gap-5">
                  <AnimatePresence>
                    {followingBlogs.map((blog) => (
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
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  No blogs from followed users yet.
                </p>
              )}
            </>
          )}
        </div>

      </div>

      <aside className="w-[30%] min-w-[40vh] hidden lg:block sticky top-0">
        <div className="shadow dark:bg-gray-800 rounded-xl p-4 mb-4">
          <h2 className="text-lg font-semibold mb-3">Who to follow</h2>
          <div className="flex flex-col gap-3">
            {!loading ? (
              usersToShow.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center justify-between p-2 cursor-pointer rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <div
                    onClick={() => router.push(`/user/profile/${user._id}`)}
                    className="flex items-center gap-2 w-full"
                  >
                    <Image
                      src={user?.profile || "/defaultprofile.png"}
                      alt={`${user?.name || "User"} profile`}
                      width={100}
                      height={100}
                      className="w-8 h-8 object-cover rounded-full"
                    />
                    <div className="flex flex-col">
                      <p className="font-medium">{user.username}</p>
                      <p className="text-sm text-zinc-500">
                        {user.bio?.length > 25 ? user.bio.slice(0, 25) + "..." : user.bio}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      // Normalize following array
                      const followingIds = following.map(f => String(f._id || f));
                      const isFollowing = followingIds.includes(String(user._id));

                      if (isFollowing) {
                        // Unfollow logic
                        setFollowing(prev =>
                          prev.filter(id => String(id._id || id) !== String(user._id))
                        );
                        unflwFeature(user._id).catch(err => {
                          console.error(err);
                          setFollowing(prev => [...prev, user._id]);
                        });
                      } else {
                        // Follow logic
                        setFollowing(prev => [...prev, user._id]);
                        flwFeature(user._id).catch(err => {
                          console.error(err);
                          setFollowing(prev =>
                            prev.filter(id => String(id._id || id) !== String(user._id))
                          );
                        });
                      }
                    }}
                    className={`flex items-center cursor-pointer gap-1 px-2 py-1 rounded-lg text-sm transition 
              ${following.some(f => String(f._id || f) === String(user._id))
                        ? "bg-gray-300 text-black hover:bg-gray-400"
                        : "bg-blue-700 text-white"}`}
                  >
                    <UserPlus className="w-4 h-4" />
                    {following.some(f => String(f._id || f) === String(user._id))
                      ? "Following"
                      : "Follow"}
                  </button>

                </div>
              ))
            ) : (
              Array.from({ length: 5 }).map((_, i) => <UserCardSkeleton key={i} />)
            )}
          </div>

          {users.length > 5 && (
            <button
              onClick={() => router.push('/suggestions')}
              className="mt-3 cursor-pointer w-full py-2 bg-orange-600 text-white rounded-lg "
            >
              Find More
            </button>
          )}
        </div>

        {/* Choose Your Interest */}
        <div className="shadow dark:bg-gray-800 rounded-xl p-4 ">
          <h2 className="text-lg font-semibold mb-3">Choose Your Interests</h2>
          <div className="flex flex-wrap gap-2 relative">
            {categoriesList.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryToggle(cat)}
                className={`px-3 py-1 rounded-full cursor-pointer border ${interestBlogs.includes(cat.toLowerCase())
                  ? "bg-orange-600 text-white border-orange-600"
                  : " dark:bg-gray-700 dark:text-white text-gray-700 border-gray-300"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}

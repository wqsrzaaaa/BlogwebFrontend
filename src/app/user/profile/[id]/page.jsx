"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Navbar from "@/(Components)/Navbar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useBlogStore } from "@/store/Store";

export default function IndivisualProfile() {
  const router = useRouter();

  const params = useParams();
  const userId = params.id;
  const [user, setUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [currentUser, setcurrentUser] = useState(null)
  const [activeTab, setActiveTab] = useState("followers");
  const token = Cookies.get("token")
  const [open, setOpen] = useState(false);

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
    });
  }


  const fetchCurrentUser = async () => {
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

  const fetchUser = async function () {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/${userId}`)
      const data = await res.json()
      setUser(data.user)
    } catch (error) {
      console.log(error);

    }
  }

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
          following: prev.following ? [...prev.following, { _id: targetUserId }] : [{ _id: targetUserId }]
        }));

      } else {
        console.error("Follow failed:", data.message);
      }
    } catch (error) {
      console.log("Error in follow:", error);
    }
  };

  const list =
    activeTab === "followers"
      ? user?.follower || []
      : user?.following || [];


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
          following: prev.following.filter(user => user._id !== targetUserId)

        }))
      } else {
        console.log("error in unfollowing");

      }
    } catch (error) {
      console.log("error in unflw" + error);
    }
  }

  useEffect(() => {
    fetchUser()
    fetchCurrentUser()
  }, [])

  useEffect(() => {
    if (currentUser && user) {
      const followingCheck = currentUser?.following?.some(
        (e) => e._id === user._id
      );
      setIsFollowing(followingCheck);
    }
  }, [currentUser, user]);

  const setSelectedBlog = useBlogStore(state => state.setSelectedBlog);


  return (
    <>
      <Navbar />
      <div className="max-w-6xl mt-20 mx-auto px-6 flex md:flex-row flex-col-reverse gap-12">
        {/* Left: Main Content */}
        <div className="w-full">
          <h1 className="text-4xl font-bold mb-6">{user?.username}</h1>

          {/* Tabs */}
          <div className="flex gap-6 border-b text-gray-600 dark:text-gray-300 font-medium">
            <button className="pb-2 border-b-2 border-orange-600">Blogs</button>
          </div>

          {/* Blog List */}
          <div className="mt-8 space-y-10">
            {user?.blogs.length > 0 ? (
              user?.blogs.map((blog) => (
                <div
                  key={blog._id}
                  onClick={() => (setSelectedBlog(blog), router.push(`/story/${blog._id}`))}
                  className="rounded-2xl hover:scale-101 cursor-pointer h-fit p-2 md:border-b-1 transition flex flex-col sm:flex-row-reverse items-center gap-4"
                >
                  <img
                    src={
                      blog.image ||
                      "https://tse2.mm.bing.net/th/id/OIP.90sDWdblfZFiciIEpsGFwwHaEY?rs=1&pid=ImgDetMain&o=7&rm=3"
                    }
                    alt={blog.title || "Blog cover"}
                    className="w-full sm:w-43 h-50 sm:h-32 object-cover rounded-xl"
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
                            className="w-8 h-8 rounded-full"
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
                              className="w-6 h-6 rounded-full border border-white"
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
                    <p className="text-zinc-400 text-sm mt-2">{formatDate(blog.date)}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 mt-20 text-lg">No blogs yet.</p>
            )}
          </div>
        </div>

        {/* Right: Sidebar */}
        <div className=" top-24 h-fit w-fit min-w-35 md:min-w-75 md:border-l md:pl-6">
          <div className="flex flex-col items-start">
            <img
              src={user?.profile || '/defaultprofile.png'}
              alt={user?.username}
              className="w-30 h-30 rounded-full object-cover mb-4"
            />
            <h2 className="text-lg font-semibold">{user?.username}</h2>
            <div className="flex items-center text-sm text-gray-900 dark:text-gray-300 font-sans gap-5">
              <Dialog open={open} onOpenChange={setOpen}>
                {/* Followers Button */}
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("followers")}
                    className="hover:underline p-0  cursor-pointer !border-none !bg-transparent hover:!bg-transparent hover:border-none shadow-none dark:text-gray-300 text-zinc-600"
                  >
                    <span className="font-bold text-gray-900 dark:text-gray-300">
                      {user?.follower?.length || 0}
                    </span>{" "}
                    followers
                  </Button>
                </DialogTrigger>

                {/* Following Button */}
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("following")}
                    className="hover:underline cursor-pointer !border-none dark:text-gray-300 !bg-transparent hover:!bg-transparent hover:border-none shadow-none text-zinc-600"
                  >
                    <span className="font-bold text-gray-900 dark:text-gray-300">
                      {user?.following?.length || 0}
                    </span>{" "}
                    following
                  </Button>
                </DialogTrigger>

                {/* Dialog Content */}
                <DialogContent className="sm:max-w-[400px] dark:bg-gray-800 ">
                  <DialogHeader>
                    <DialogTitle className="text-lg text-orange-600 font-semibold">
                      {activeTab === "followers" ? "My Followers" : "My Following"}
                    </DialogTitle>
                  </DialogHeader>

                  <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
                    {list.length > 0 ? (
                      list.map((user, index) => (
                        <div
                          key={index}
                          onClick={() => router.push(`/user/profile/${user._id}`)}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer"
                        >
                          <img
                            src={user.profile || "/defaultprofile.png"}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{user.username}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-300">@{user.username}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 dark:text-gray-300 text-sm">
                        No {activeTab === "followers" ? "followers" : "following"} yet
                      </p>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300 mt-5">{user?.bio}</p>

            <Button
              onClick={() => !isFollowing ? flwFeature(user?._id) : unflwFeature(user?._id)}
              className={`mt-4 cursor-pointer w-full ${isFollowing ? "bg-gray-300  hover:bg-gray-400 cursor-pointer text-black" : "bg-orange-600 hover:bg-orange-600  text-white"} hover:opacity-90`}
            >
              {isFollowing ? "Following" : "Follow"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

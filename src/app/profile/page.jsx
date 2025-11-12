"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Cookies from "js-cookie";
import Navbar from "@/(Components)/Navbar";
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { EditProfiledialouge } from "./_editProfile/EditProfile";
import LogoutDialogue from "./_logout/LogoutDialogue";



export default function IndivisualProfile() {
  const router = useRouter();
  const [profileData, setProfileData] = useState(null);
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("followers");
  const token = Cookies.get('token')
  useEffect(() => {
    if (!token) {
      router.push("/signin");
    }
  }, [])


  const fetchUser = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/current-user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      if (res.status === 401) {
        router.push("/signin");
        return;
      }
      if (!res.ok) {
        console.log("error in current user backend route");
      }

      const data = await res.json()
      setProfileData(data.user)
    } catch (error) {
      console.log("error in fetching User" + error);

    }
  }


  useEffect(() => {
    fetchUser()
  }, [])

  if (!profileData) {
    return null;
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
    });
  }

  const list =
    activeTab === "followers"
      ? profileData.follower || []
      : profileData.following || [];

      console.log(profileData);
      
  return (
    <>
      <Navbar />
      <div className="w-full min-h-screen  my-20 px-7 gap-12 flex relative flex-col-reverse md:flex-row justify-between">
        <div className="w-full ">
          <h1 className="text-4xl uppercase font-bold mb-6">{profileData.username}</h1>

          <div className="flex gap-6 border-b text-gray-600 dark:text-white font-medium">
            <button className="pb-2 border-b-2 border-orange-600">Blogs</button>
          </div>

          <div className="mt-8 space-y-10 ">
            {profileData.blogs.length > 0 ? (
              profileData.blogs.map((blog) => (
                <Dialog key={blog._id}>
                  <DialogTrigger asChild>
                   <div
                        onClick={() => router.push(`/myblog/${blog._id}`)} 
                        key={blog._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="rounded-2xl hover:scale-101 md:dark:border-b-1 border-zinc-400 dark:shadow-none dark:hover:scale-100 cursor-pointer h-fit p-2 shadow-md hover:shadow-lg transition
               flex flex-col sm:flex-row-reverse items-center sm:items-start gap-4"
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
                                  className="w-8 h-8 rounded-full object-cover"
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
                            <p className="text-zinc-400 md:hidden block text-sm mt-2">{formatDate(blog.date)}</p>
                        </div>
                      </div>
                  </DialogTrigger>
                </Dialog>

              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-300 mt-20 text-lg">No blogs yet.</p>
            )}
          </div>

        </div>

        {/* Right: Sidebar */}
        <div className="sm:sticky top-0 md:w-[45%] w-full  md:border-l md:pl-6">
          <div className="flex flex-col items-start">
            <img
              src={
                profileData.profile ||
                "https://tse1.mm.bing.net/th/id/OIP.cEvbluCvNFD_k4wC3k-_UwHaHa"
              }
              alt={profileData.username}
              className="w-30 h-30 rounded-full object-cover mb-4"
            />
            <h2 className="text-lg font-semibold">{profileData.username}</h2>
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
                      {profileData.follower?.length || 0}
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
                      {profileData.following?.length || 0}
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
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition cursor-pointer"
                        >
                          <img
                            src={user.profile || "/defaultprofile.png"}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-gray-300">{user.username}</p>
                            <p className="text-sm text-gray-500">@{user.username}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">
                        No {activeTab === "followers" ? "followers" : "following"} yet
                      </p>
                    )}
                  </div>
                </DialogContent>
              </Dialog>


            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300 mt-5">
              {profileData.bio || "No bio yet."}
            </p>
            <EditProfiledialouge profileData={profileData} />
            <LogoutDialogue />
          </div>
        </div>
      </div>

    </>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import { UserPlus } from "lucide-react";
import Cookies from "js-cookie";
import Navbar from "@/(Components)/Navbar";
import { useRouter } from "next/navigation";

const page = () => {

  const [currentUser, setcurrentUser] = useState(null)
  const [users, setusers] = useState([])
  const token = Cookies.get("token")
  const [activeTab, setActiveTab] = useState('suggestions')
  const router = useRouter()
  const [loading, setloading] = useState(true)
  const allUsers = async () => {
    try {
      const res = await fetch("http://localhost:3000/alluser");
      if (!res.ok) {
        console.log("Error fetching all users");
        return;
      }
      const data = await res.json();
      setusers(data.users)
    } catch (err) {
      console.error("Fetch failed:", err);
    }
  };
  const fetchUser = async () => {
    try {
      setloading(true)
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
    } finally {
      setloading(false)
    }
  }
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    if (currentUser?.following) {
      setFollowing(currentUser.following.map(user => user._id));
    }
  }, [currentUser]);



  const flwFeature = async (targetUserId) => {
    try {
      if (!token) {
        router.push('/signin')
      }
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
    } finally {
      setloading(false)
    }
  };

  const unflwFeature = async function (targetUserId) {
    try {
      setloading(true)
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
    } finally {
      setloading(false)
    }
  }



  useEffect(() => {
    fetchUser()
    allUsers()
  }, [])

  const userFollowingIds = currentUser?.following?.map(user => user._id) || [];
  const suggestions = users.filter((e) => e._id !== currentUser?._id && !userFollowingIds.includes(e._id))
  const followingTab = users.filter((user) => userFollowingIds.includes(user._id));
  return (
    <>
      <Navbar />
      <div className="max-w-3xl  mx-auto mt-20 p-4">
        {/* Tabs */}
        <div className="flex  mb-4">
          <button
            onClick={() => setActiveTab("suggestions")}
            className={`flex-1 py-2 text-center font-medium ${activeTab === "suggestions"
              ? "border-b-2 border-orange-500 text-orange-500"
              : "text-gray-300 hover:text-gray-700 dark:hover:text-gray-200"
              }`}
          >
            Suggestions
          </button>
          <button
            onClick={() => setActiveTab("following")}
            className={`flex-1 py-2 text-center font-medium ${activeTab === "following"
              ? "border-b-2 border-orange-500 text-orange-500"
              : "text-gray-300 hover:text-gray-700 dark:hover:text-gray-200  "
              }`}
          >
            Following
          </button>
        </div>

        {/* List */}
        <div className="space-y-4  overflow-y-hidden relative mb-20">
          {activeTab === "suggestions" &&
            (suggestions.length > 0 ? (
              suggestions.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center dark:bg-gray-600 justify-between p-3 cursor-pointer  rounded-xl  transition"
                >
                  <div
                    onClick={() => router.push(`/user/profile/${user._id}`)}
                    className="flex items-center  w-full gap-3">
                    <img
                      src={user.profile || "/defaultprofile.png"}
                      alt={user.username}
                      className="w-12 h-12 rounded-full  object-cover"
                    />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{user.username}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-300">{user.bio || "No bio"}</p>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      following.includes(user._id)
                        ? unflwFeature(user._id)
                        : flwFeature(user._id)
                    }
                    className={`flex items-center  cursor-pointer gap-1 px-2 py-1 rounded-lg text-sm transition 
                       ${following.includes(user._id)
                        ? "bg-gray-300 text-black hover:bg-gray-400"
                        : "bg-blue-700 text-white "}`}
                  >
                    <UserPlus className="w-4 h-4" />
                    {following.includes(user._id) ? "Following" : "Follow"}
                  </button>
                </div>
              )

              )
            ) : (
              loading ? (
                Array(5).fill().map((_, i) =>
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl animate-pulse border border-gray-200">
                    <div className="flex items-center w-full gap-3">
                      {/* Profile Image Skeleton */}
                      <div className="w-12 h-12 bg-gray-300 rounded-full"></div>

                      {/* Username and Bio Skeleton */}
                      <div className="flex flex-col gap-2 w-2/3">
                        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                      </div>
                    </div>

                    {/* Follow Button Skeleton */}
                    <div className="w-20 h-8 bg-gray-300 rounded-lg"></div>
                  </div>
                )
              ) : (
                <p className="text-center text-gray-500">No suggestions available</p>)
            ))
          }

          {activeTab === "following" &&
            (followingTab.length > 0 ? (
              followingTab.map((user) => (
               <div
                  key={user._id}
                  className="flex items-center dark:bg-gray-600 justify-between p-3 cursor-pointer  rounded-xl  transition"
                >
                  <div
                    onClick={() => router.push(`/user/profile/${user._id}`)}
                    className="flex items-center  w-full gap-3">
                    <img
                      src={user.profile || "/defaultprofile.png"}
                      alt={user.username}
                      className="w-12 h-12 rounded-full  object-cover"
                    />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{user.username}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-300">{user.bio || "No bio"}</p>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      following.includes(user._id)
                        ? unflwFeature(user._id)
                        : flwFeature(user._id)
                    }
                    className={`flex items-center  cursor-pointer gap-1 px-2 py-1 rounded-lg text-sm transition 
                       ${following.includes(user._id)
                        ? "bg-gray-300 text-black hover:bg-gray-400"
                        : "bg-blue-700 text-white "}`}
                  >
                    <UserPlus className="w-4 h-4" />
                    {following.includes(user._id) ? "Following" : "Follow"}
                  </button>
                </div>
              ))
            ) : (
                loading ? (
                Array(5).fill().map((_, i) =>
              <div key={i} className="flex items-center justify-between p-3 rounded-xl animate-pulse border border-gray-200">
                <div className="flex items-center w-full gap-3">
                  {/* Profile Image Skeleton */}
                  <div className="w-12 h-12 bg-gray-300 rounded-full"></div>

                  {/* Username and Bio Skeleton */}
                  <div className="flex flex-col gap-2 w-2/3">
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>

                {/* Follow Button Skeleton */}
                <div className="w-20 h-8 bg-gray-300 rounded-lg"></div>
              </div>
            )
            ) : (
              <p className="text-center text-gray-500">You are not following anyone</p>
            )
            ))}
        </div>
      </div>
    </>
  );
};

export default page;

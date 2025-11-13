"use client";

import Cookies from "js-cookie";
import { Newspaper, PenSquare, Search, Sun, Moon, SunDim, MoonIcon, Home, User, UserPlus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableRow,
} from "@/components/ui/table"
import { useRouter } from "next/navigation";
import { useBlogStore } from "@/store/Store";


export default function Navbar({ showLogin }) {
  if (showLogin) return null;
  const [currentUser, setcurrentUser] = useState(null)
  const [suggestion, setsuggestion] = useState(null)
  const [suggData, setsuggData] = useState('')
  const token = Cookies.get("token")
  const router = useRouter()
  const [users, setusers] = useState([])
  const [loading, setloading] = useState(true)
  const [showSugg, setshowSugg] = useState(false)
  const [following, setFollowing] = useState([]);
  const setSelectedBlog = useBlogStore(state => state.setSelectedBlog);
  const [open, setOpen] = useState(false);


  const allUsers = async () => {
    try {
      setloading(true)
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
      setFollowing(data.user.following)
    } catch (error) {
      console.log(error);
    }
  }
  const fetchBlogTitle = async function () {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/all`)
    const data = await res.json()
    setsuggestion(data.data);
  }


  const flwFeature = async (targetUserId) => {
    if (!currentUser) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/follow/${targetUserId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
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
          following: prev.following ?
            prev.following.includes(targetUserId)
              ? prev.following
              : [...prev.following, targetUserId]
            : [targetUserId],
        }));
      } else {
        console.error("Follow failed:", data.message || data);
      }
    } catch (error) {
      console.error("Error in follow:", error);
    }
  };

  const unflwFeature = async (targetUserId) => {
    if (!currentUser) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/unfollow/${targetUserId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // <-- must include token
          },
          body: JSON.stringify({ currentUserId: currentUser._id }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setFollowing((prev) => prev.filter((id) => id !== targetUserId));

        setcurrentUser((prev) => ({
          ...prev,
          following: prev.following
            ? prev.following.filter((id) => id !== targetUserId)
            : [],
        }));
      } else {
        console.error("Unfollow failed:", data.message || data);
      }
    } catch (error) {
      console.error("Error in unfollow:", error);
    }
  };

  useEffect(() => {
    fetchUser()
    fetchBlogTitle()
    allUsers()
  }, [])

  const { setTheme } = useTheme()

  const [showAll, setShowAll] = useState(false);

  const filterUser = currentUser
    ? users.filter((e) => e._id !== currentUser._id)
    : users;

  const usersToShow = showAll ? filterUser : filterUser.slice(0, 5);

  const searchBarData = suggestion?.filter((e) => e.title.toLowerCase().includes(suggData.toLowerCase()))

  const followingIds = following.map(f => String(f._id || f));
  const ids = usersToShow.map(u => String(u._id));

  const isAnyFollowing = ids.some(id => followingIds.includes(id));


  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);



  return (
    <nav className="w-full fixed top-0 z-50 bg-white dark:bg-gray-800 shadow-md px-2 md:px-6 py-3 flex items-center justify-between">
      {/* Left Section - Icons */}
      <Link href={'/'} className="text-2xl cursor-pointer font-extrabold text-orange-500">BloggedIn</Link>

      <div className="relative w-[50%] hidden lg:block ">
        <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={suggData}
          onFocus={() => setshowSugg(true)}
          onBlur={() => setTimeout(() => setshowSugg(false), 200)}
          onChange={(e) => setsuggData(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {

              e.preventDefault()
              if (suggData.length > 0) {
                router.push(`/search?q=${encodeURIComponent(suggData)}`)
                return
              }
              setshowSugg(false)
            }
          }}
          placeholder="Search your favorite"
          className={`pl-9 w-full pr-3 py-1.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400`}
        />

        {showSugg && (
          <Table className='fixed bg-zinc-100 dark:bg-gray-800 dark:hover:bg-gray-800  z-99 top-14 rounded-t-2xl  px-3 w-[48%] min-h-12'>
            <TableCaption className={'bg-gray-100 dark:bg-gray-800  m-0 p-3 rounded-b-2xl'}>A list of your recent Blog.</TableCaption>
            <TableBody>
              <TableRow className='flex flex-col min-h-12 max-h-74 !bg-transparent  overflow-y-scroll ' >
                {searchBarData?.map((e, i) =>
                  <TableCell
                    onClick={() => {
                      if (currentUser) {
                        setSelectedBlog(e);
                        router.push(`/story/${e._id}`)
                      } else {
                        router.push(`/signin`)
                      }
                    }}
                    key={i} className="font-medium w-full h-12 dark:hover:bg-gray-700 hover:bg-gray-300 hover:rounded-xl flex items-center cursor-pointer">{e.title}</TableCell>
                )}
              </TableRow>
            </TableBody>
          </Table>
        )}
      </div>

      {/* Right Section - Search + Profile */}
      <div className="lg:flex items-center gap-4 hidden">
        <div className="relative">
          <div className="flex items-center gap-6">
            <DropdownMenu>
              <DropdownMenuTrigger asChild >
                <Button variant="outline" size="icon">
                  <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="sm:max-w-[400px] z-[9999]">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  <SunDim size={16} /> Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  <MoonIcon /> Dark
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link
              href="/news"
              className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white flex items-center gap-1"
            >
              <Newspaper className="w-5 h-5" />
              <span className="hidden sm:inline">News</span>
            </Link>

            <Link
              href="/write"
              className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white flex items-center gap-1"
            >
              <PenSquare className="w-5 h-5" />
              <span className="hidden sm:inline">Write</span>
            </Link>

          </div>
        </div>

        <>
          {loading ? (
            // while fetching current user → show skeleton
            <div className="w-8 h-8 rounded-full bg-gray-300 animate-pulse" />
          ) : currentUser ? (
            // if user exists → show their profile
            <Link
              href="/profile"
              className="text-gray-700 hover:text-black border-none bg-transparent !shadow-none hover:bg-transparent cursor-pointer focus:!ring-0 focus:!border-0"
            >
              <Image
                width={35}
                height={35}
                src={currentUser.profile || "/defaultprofile.png"}
                alt="profile"
                className="w-8 h-8 rounded-full object-center object-cover"
              />
            </Link>
          ) : !loading && !currentUser ? (
            <Link
              href="/signin"
              className="text-gray-700 bg-orange-400 p-2 px-4 rounded-2xl"
            >
              Login
            </Link>
          ) : null}
        </>





      </div>

      <div className="flex items-center gap-4 lg:hidden relative">
        {currentUser ? (
          <>
            <button
              onClick={() => setOpen(true)}
              className="text-gray-700 hover:text-black border-none bg-transparent cursor-pointer focus:outline-none"
            >
              <Image
                width={35}
                height={35}
                src={currentUser.profile ? currentUser.profile : "/defaultprofile.png"}
                alt="profile"
                className="w-8 h-8 rounded-full object-center object-cover"
              />
            </button>


            <AnimatePresence  >
              {open && (
                <>
                  {/* Dim overlay */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => setOpen(false)}
                    className="fixed  inset-0 bg-black z-40"
                  />

                  <motion.div
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="fixed overflow-y-scroll top-0 pt-6 py-6 right-0 min-w-[45vh] w-[70%] sm:w-[40%] h-screen dark:bg-gray-900 bg-white shadow-xl z-50 flex flex-col justify-between space-y-10 px-5"
                  >
                    {/* Close Button */}
                    <button
                      onClick={() => setOpen(false)}
                      className="absolute top-5 right-5 dark:text-gray-400 text-gray-600 text-3xl font-bold"
                    >
                      ×
                    </button>

                    {/* Nav Links */}
                    <div className="flex flex-col items-start text-2xl font-semibold space-y-4 m-0">

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild >
                          <Button variant="outline" size="icon">
                            <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                            <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                            <span className="sr-only">Toggle theme</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="sm:max-w-[400px] z-[9999]">
                          <DropdownMenuItem onClick={() => setTheme("light")}>
                            <SunDim size={16} /> Light
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setTheme("dark")}>
                            <MoonIcon /> Dark
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <div className="relative w-[95%] lg:hidden text-sm block ">
                        <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={suggData}
                          onFocus={() => setshowSugg(true)}
                          onBlur={() => setTimeout(() => setshowSugg(false), 200)}
                          onChange={(e) => setsuggData(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault()
                              if (suggData.length > 0) {
                                router.push(`/search?q=${encodeURIComponent(suggData)}`)
                                return
                              }
                              setshowSugg(false)
                            }
                          }}
                          placeholder="Search your favorite"
                          className={`pl-9 w-full pr-3 py-1.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400`}
                        />

                        {showSugg && (
                          <Table className='fixed bg-zinc-100 dark:bg-gray-800 dark:hover:bg-gray-800 w-[75%] z-99 top-30 rounded-t-2xl  px-3  min-h-12'>
                            <TableCaption className={'bg-gray-100 dark:bg-gray-800  m-0 p-3 rounded-b-2xl'}>A list of your recent Blog.</TableCaption>
                            <TableBody>
                              <TableRow className='flex flex-col min-h-12 max-h-74 !bg-transparent  overflow-y-scroll ' >
                                {searchBarData?.map((e, i) =>
                                  <TableCell
                                    onClick={() => {
                                      if (currentUser) {
                                        setSelectedBlog(e);
                                        router.push(`/story/${e._id}`)
                                      } else {
                                        router.push(`/signin`)
                                      }
                                    }}
                                    key={i} className="font-medium w-full h-12 hover:bg-gray-300 hover:rounded-xl flex items-center cursor-pointer">
                                    {e.title.length > 35 ? e.title.slice(0, 35) + "..." : e.title}
                                  </TableCell>
                                )}
                              </TableRow>
                            </TableBody>
                          </Table>
                        )}
                      </div>

                      <Link
                        href="/"
                        onClick={() => setOpen(false)}
                        className="flex items-center text-lg md:text-md gap-2 hover:text-orange-500 transition-colors"
                      >
                        <Home className="text-sm md:text-md" />
                        Home
                      </Link>

                      <Link
                        href="/write"
                        onClick={() => setOpen(false)}
                        className="flex items-center text-lg md:text-md gap-2 hover:text-orange-500 transition-colors"
                      >
                        <PenSquare className="text-sm md:text-md" />
                        Write
                      </Link>

                      <Link
                        href="/news"
                        onClick={() => setOpen(false)}
                        className="flex items-center  text-lg md:text-md gap-2 hover:text-orange-500 transition-colors"
                      >
                        <Newspaper className="text-sm md:text-md" />
                        News
                      </Link>
                      {/* Profile Section */}
                      <div className="flex  items-center h-15   gap-4  mt-2">
                        <Image
                          width={40}
                          height={40}
                          src={currentUser.profile ? currentUser.profile : "/defaultprofile.png"}
                          alt="profile"
                          priority 
                          className="w-13 h-13 rounded-full  object-cover"
                        />
                        <div className="flex flex-col justify-center">
                          <Link
                            href="/profile"
                            onClick={() => setOpen(false)}
                            className="flex  gap-2 text-lg font-medium hover:text-orange-500 transition-colors"
                          >
                            View Profile
                          </Link>
                          <p className="text-gray-500 text-base">{currentUser.username}</p>
                        </div>
                      </div>

                    </div>

                    <div className="  rounded-xl pb-10  w-full">
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


                  </motion.div>
                </>
              )}
            </AnimatePresence>

          </>
        ) : (
          <>
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-gray-300 animate-pulse" />
            ) : currentUser ? (
              <Link
                href="/profile"
                className="text-gray-700 hover:text-black border-none bg-transparent !shadow-none hover:bg-transparent cursor-pointer focus:!ring-0 focus:!border-0"
              >
                <Image
                  width={35}
                  height={35}
                  src={currentUser.profile || "/defaultprofile.png"}
                  alt="profile"
                  className="w-8 h-8 rounded-full object-center object-cover"
                />
              </Link>
            ) : !loading && !currentUser ? (
              <Link
                href="/signin"
                className="text-gray-700 bg-orange-400 p-2 px-4 rounded-2xl"
              >
                Login
              </Link>
            ) : null}
          </>

        )}
      </div>
    </nav>
  );
}


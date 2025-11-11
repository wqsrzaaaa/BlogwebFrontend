"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Navbar from "@/(Components)/Navbar";
import Cookies from "js-cookie";
import { Facebook, Twitter, Linkedin, Pencil, Trash2 } from "lucide-react";
import BlogSkeleton from "@/components/BlogSkeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function MyBlogPage() {
  const { id } = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  const userId = Cookies.get("user");

  useEffect(() => {
    if (!userId) {
      router.push("/signin");
    }
  }, [userId, router]);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/blog/${id}`);
        const data = await res.json();
        if (res.ok) {
          setBlog(data);
        } else {
          console.error("Failed to fetch blog:", data.message);
          router.push("/signin");
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
        router.push("/signin");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchBlog();
  }, [id, router]);

  const handleDelete = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/myblog/delete/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.push("/profile");
      } else {
        const data = await res.json();
        alert(data.message || "Failed to delete blog");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };
  if (loading) return <BlogSkeleton />;
  if (!blog) return <p className="text-center mt-20 text-gray-500">Blog not found</p>;
  const isOwner = blog?.author?._id === userId;
  return (
    <>
      <Navbar />
      <div className="min-h-screen py-10 px-4 my-15 md:px-10">
        {/* Banner */}
        <div className="relative w-full h-[50vh] md:h-[60vh] rounded-xl overflow-hidden shadow-lg">
          <img
            src={blog?.image}
            alt={blog?.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-end p-6">
            <h1 className="text-white text-3xl md:text-5xl font-bold">{blog?.title}</h1>
          </div>
        </div>

        <div className="max-w-4xl mx-auto mt-10 dark:bg-gray-800 rounded-xl shadow p-6 md:p-10">
          {/* Author info */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <Image
                src={blog?.author?.profile || "/defaultprofile.png"}
                alt={blog?.author?.username || "Author"}
                width={60}
                height={60}
                className="rounded-full w-13 h-13 object-cover"
              />
              <div>
                <h3 className="font-semibold text-lg">{blog?.author?.username}</h3>
                <p className="text-gray-500 text-sm">
                  {new Date(blog?.date).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-gray-600">
              <Facebook className="hover:text-blue-600 cursor-pointer" />
              <Twitter className="hover:text-sky-500 cursor-pointer" />
              <Linkedin className="hover:text-blue-700 cursor-pointer" />
            </div>
          </div>

          {/* Blog? content */}
          <div className="prose max-w-none text-gray-800 dark:text-gray-300">
            <p dangerouslySetInnerHTML={{ __html: blog?.description }} />
          </div>

          {/* Edit / Delete buttons */}
          {isOwner && (
            <div className="flex gap-4 mt-10 text-sm">
              <button
                onClick={() => router.push(`/editblog/${blog?._id}`)}
                className="flex items-center gap-2 bg-gray-300 cursor-pointer  text-black px-4 py-2 rounded-lg transition"
              >
                <Pencil size={14} /> Edit
              </button>

              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="destructive"
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white cursor-pointer px-4 py-2 rounded-lg transition"
                   >
                    <Trash2 size={14} /> Drop
                  </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[425px] dark:bg-gray-800">
                  <DialogHeader>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to drop this blog? This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>

                  <DialogFooter className="flex justify-end gap-2">
                    <DialogClose asChild>
                      <Button
                      className='cursor-pointer'
                       variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button
                      onClick={handleDelete}
                      variant="destructive"
                      disabled={loading}
                      className='cursor-pointer'
                    >
                      {loading ? "Deleting..." : "Yes"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>


            </div>
          )}
        </div>
      </div>
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Cookies from "js-cookie";
import { Loader2, Upload, Tag, ChevronDown } from "lucide-react";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";
import Image from "next/image";

const categoriesList = [
  "Technology",
  "Design",
  "Lifestyle",
  "Health",
  "Travel",
  "Food",
  "Education",
  "Business",
  "Story",
];

export default function EditBlog() {
  const router = useRouter();
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [title, setTitle] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [content, setContent] = useState("");
  const [cover, setCover] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [open, setOpen] = useState(false);

  const token = Cookies.get("token");
  const userId = Cookies.get("user");

  useEffect(() => {
    if (!userId) router.push("/signin");
  }, [userId]);

  // Fetch blog details
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/blog/${id}`);
        const data = await res.json();

        if (res.ok) {
          setBlog(data);
          setTitle(data.title || "");
          setSelectedCategories(data.Categories || []);
          setContent(data.description || "");
          setPreview(data.image || "");
        } else {
          console.log("Failed to fetch blog:", data);
        }
      } catch (err) {
        console.error("Error fetching blog:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchBlog();
  }, [id]);

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCover(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/myblog/edit/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`  // ✅ if you have auth
        },
        body: JSON.stringify({
          title: title,
          description: content,
          Categories: selectedCategories,
          image: preview,
        }), // ✅ convert object to JSON string
      });

      const data = await res.json();

      if (res.ok) {
        router.push(`/myblog/${id}`);
      } else {
        alert(data.message || "Failed to update blog.");
      }
    } catch (err) {
      console.error("Error updating blog:", err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin w-8 h-8 text-gray-500" />
      </div>
    );

  return (
    <div className="max-w-4xl flex flex-col gap-4 mx-auto py-10 px-5">
      <h1 className="text-3xl font-semibold mb-6 text-center">Edit my Blog</h1>

      {/* Cover Image */}
      <div className="mb-5">
        {preview && (
          <div className="relative w-full h-90 mb-3">
            <Image
              src={preview}
              alt="banner"
              fill
              className="rounded-lg w-full bg-gray-900 h-75 object-cover"
            />
          </div>
        )}
        <div className="flex items-center gap-3">
          <Input
            type="file"
            accept="image/*"
            onChange={handleCoverChange}
            className="hidden"
            id="cover"
          />
          <Label
            htmlFor="cover"
            className="flex items-center gap-2 cursor-pointer dark:bg-gray-600 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg"
          >
            <Upload className="w-5 h-5" />
            Change Cover
          </Label>
        </div>
      </div>

      {/* Title */}
      <div className="mb-4">
        <Label className={'font-bold text-2xl myfont text-gray-900 dark:text-gray-300'} htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter blog title"
          className="mt-2 border-zinc-400"
        />
      </div>

      {/* Category */}
      <div className="relative mb-6">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="w-full flex items-center cursor-pointer justify-between p-4 pl-12 border border-gray-300 rounded-lg transition-all duration-200 "
        >
          <span className="truncate ">
            {selectedCategories.length > 0
              ? selectedCategories.join(", ")
              : "Select categories"}
          </span>
          <ChevronDown
            className={`ml-2 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>

        {/* Icon */}
        <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

        {open && (
          <div className="absolute mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
            {categoriesList.map((cat) => (
              <label
                key={cat}
                className="flex items-center p-2 hover:bg-gray-100 text-gray-800 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat)}
                  onChange={() => toggleCategory(cat)}
                  className="mr-2"
                />
                {cat}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="mb-6">
        <Label className="mb-2 block">Content</Label>
        <div className="quill-editor rounded-xl dark">
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            placeholder="Write your blog content here..."
            className="rounded-xl min-h-[8rem]" 
          />
        </div>

      </div>

      {/* Submit */}
      <Button
        onClick={handleUpdate}
        disabled={updating}
        className="w-30 bg-orange-600 hover:bg-orange-700 text-white"
      >
        {updating ? <Loader2 className="animate-spin mr-2" /> : "Update Blog"}
      </Button>
    </div>
  );
}

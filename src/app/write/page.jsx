"use client";
import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import Dropzone from "react-dropzone";
import Cropper from "react-easy-crop";
import getCroppedImg from "@/utils/cropImage"; // Make sure folder is exactly 'utils'
import {
  FileText,
  Tag,
  Image,
  Wand2,
  ChevronDown,
  Check,
  X,
  TriangleAlert,
} from "lucide-react";

// React-Quill must be loaded client-side only
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css"; // Make sure the path exists exactly

import Navbar from "@/components/Navbar"; // Folder name MUST be 'components', not 'Components'
import Spinner from "@/components/ui/spinner";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

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


export default function CreateBlog() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [loading, setloading] = useState("initial")
  const [error, seterror] = useState('')
  const router = useRouter()
  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const showCroppedImage = useCallback(async () => {
    try {
      const croppedImg = await getCroppedImg(image, croppedAreaPixels);
      setCroppedImage(croppedImg);
    } catch (e) {
      console.error(e);
    }
  }, [image, croppedAreaPixels]);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [open, setOpen] = useState(false);

  const toggleCategory = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleSubmit = async () => {
    seterror("");
    setloading("idle");

    const author = Cookies.get("user");

    if (!title || !description || !selectedCategories?.length || !croppedImage || !author) {
      seterror("Please fill all fields.");
      setloading("error");
      return;
    }

    const sizeInBytes = Math.round((croppedImage.length * 3) / 4);
    const sizeInMB = sizeInBytes / (1024 * 1024);
    if (sizeInMB > 5) {
      seterror("Image size is too large! Please upload an image under 5MB.");
      setloading("error");
      return;
    }

    seterror("");
    setloading("submitting");

    try {
      const token = Cookies.get("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          Categories: selectedCategories,
          image: croppedImage,
          author,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setloading("created");
        setTimeout(() => router.push("/profile"), 1200);
      } else {
        setloading("error");
        seterror(data.message || "Server Error");
      }
    } catch (err) {
      console.error("Error in creating blog:", err);
      setloading("error");
      seterror("Something went wrong!");
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-8 mt-20 dark:bg-gray-800 rounded-2xl dark:shadow-xl mb-9 transition-colors duration-300">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2 text-center">
          Create Your Blog Post
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg text-center mb-8">
          Share your thoughts, stories, or knowledge with the world.
        </p>

        {/* Blog Title */}
        <div className="mb-6">
          <label htmlFor="title" className="block text-gray-700 dark:text-gray-200 font-semibold mb-2">
            Blog Title
          </label>
          <div className="relative">
            <input
              type="text"
              id="title"
              placeholder="A compelling title for your blog..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-4 pl-12 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
            />
            <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300" />
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-2">
            Blog Content
          </label>
          <ReactQuill
            theme="snow"
            value={description}
            onChange={setDescription}
            placeholder="Write your blog content here..."
            className="[&_.ql-container]:rounded-b-xl dark:text-white [&_.ql-container]:min-h-[200px] [&_.ql-editor]:min-h-[200px]"
          />
        </div>

        {/* Categories */}
        <div className="mb-6">
          <label htmlFor="categories" className="block text-gray-700 dark:text-gray-200 font-semibold mb-2">
            Categories
          </label>

          <div className="relative">
            <button
              type="button"
              onClick={() => setOpen(!open)}
              className="w-full flex items-center cursor-pointer justify-between p-4 pl-12 border border-gray-300 dark:border-gray-600 rounded-lg transition-all duration-200 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
            >
              <span className="truncate">
                {selectedCategories.length > 0 ? selectedCategories.join(", ") : "Select categories"}
              </span>
              <ChevronDown className={`ml-2 transition-transform ${open ? "rotate-180" : ""}`} />
            </button>

            {/* Icon */}
            <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300" />

            {open && (
              <div className="absolute mt-2 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                {categoriesList.map((category) => (
                  <label
                    key={category}
                    className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() => toggleCategory(category)}
                      className="mr-2"
                    />
                    {category}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Cover Image */}
        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-2">
            Cover Image
          </label>
          {!image && (
            <Dropzone
              accept={{ "image/*": [] }}
              onDrop={(acceptedFiles) => setImage(URL.createObjectURL(acceptedFiles[0]))}
            >
              {({ getRootProps, getInputProps }) => (
                <div
                  {...getRootProps()}
                  className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-10 text-center cursor-pointer hover:border-orange-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <input {...getInputProps()} />
                  <div className="text-gray-500 dark:text-gray-300 text-lg">
                    <Image className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                    <p>
                      <span className="font-medium text-orange-600">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-sm">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
              )}
            </Dropzone>
          )}
        </div>

        {/* Cropping UI */}
        {image && !croppedImage && (
          <div className="mb-6 bg-white dark:bg-gray-700 p-4 rounded-xl shadow-inner border border-gray-200 dark:border-gray-600">
            <div className="relative w-full h-80 bg-gray-900 rounded-lg overflow-hidden">
              <Cropper
                image={image}
                crop={crop}
                zoom={zoom}
                aspect={16 / 9}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setImage(null)}
                className="px-6 py-2 border cursor-pointer border-gray-300 dark:border-gray-600 rounded-full text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={showCroppedImage}
                className="px-6 py-2 bg-orange-600 cursor-pointer text-white rounded-full hover:bg-orange-700 transition-colors duration-200"
              >
                Crop & Save
              </button>
            </div>
          </div>
        )}

        {/* Cropped Image Preview */}
        {croppedImage && (
          <div className="mb-6">
            <img
              src={croppedImage}
              alt="Cropped Preview"
              className="w-full rounded-xl shadow-lg border border-gray-200 dark:border-gray-600"
            />
          </div>
        )}

        {error && <div className="flex items-center gap-3 bg-red-100 border border-red-400 text-red-800 px-4 py-3 rounded-md mt-2">
          <TriangleAlert className="w-6 h-6" />
          <span className="text-sm">{error}</span>
        </div>}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-fit px-6 mt-6 py-4 bg-orange-500 cursor-pointer text-white text-lg font-semibold rounded-xl transition-colors duration-200 shadow-lg hover:bg-orange-600 flex items-center justify-center"
        >
          {loading === "initial" && (
            <p>
              Publish Post <Wand2 className="inline ml-2" />
            </p>
          )}

          {loading === "submitting" && <Spinner />}

          {loading === "created" && (
            <p>
              Blog Published <Check className="inline ml-2" />
            </p>
          )}

          {loading === "error" && (
            <p>
              Post Failed <X className="inline ml-2" />
            </p>
          )}
        </button>


      </div>


    </>
  );
}

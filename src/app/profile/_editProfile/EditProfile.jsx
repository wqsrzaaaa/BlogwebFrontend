import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Cookies from "js-cookie";
import Image from "next/image";
import { useState } from "react";

export function EditProfiledialouge({ profileData }) {
  const [username, setUsername] = useState(profileData?.username || "");
  const [bio, setBio] = useState(profileData?.bio || "");
  const [profile, setProfile] = useState(profileData?.profile || "/defaultprofile.png");
  const [preview, setPreview] = useState(profileData?.profile || "/defaultprofile.png");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const user = Cookies.get("user");
  const token = Cookies.get("token");

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    const reader = new FileReader();
    reader.onloadend = () => setProfile(reader.result);
    reader.readAsDataURL(file);
  };

  const UpdateProfile = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/update-profile/${user}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username, bio, profile }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Something went wrong while updating.");
        setLoading(false);
        return;
      }

      window.location.reload();
    } catch (err) {
      console.error("Update error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="text-sm text-green-600 !bg-transparent shadow-none border-none p-0 hover:text-green-600 cursor-pointer"
          variant="outline"
        >
          Edit Profile
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[650px] dark:bg-gray-800">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your profile details and profile picture.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col sm:flex-row gap-6 py-4">
          {/* Left side: Profile Image */}
          <div className="flex flex-col items-center gap-3 sm:w-1/3">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border">
              <Image
                src={preview || "/defaultprofile.png"}
                alt="Profile"
                width={128}
                height={128}
                className="object-cover w-full h-full"
              />
            </div>
            <label className="cursor-pointer text-sm text-orange-600 hover:underline">
              Change Photo
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </div>

          {/* Right side: Text fields */}
          <div className="flex-1 grid gap-4">
            <div className="grid gap-2">
              <Label>Email</Label>
              <Input
                value={profileData?.email || ""}
                readOnly
                className="border-zinc-400"
              />
            </div>

            <div className="grid gap-2">
              <Label>Username</Label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="border-zinc-400"
              />
            </div>

            <div className="grid gap-2">
              <Label>Bio</Label>
              <Textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Write something about yourself"
                className="resize-none border-zinc-400 max-h-30"
              />
            </div>
          </div>
        </div>

        {/* ✅ Error message */}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            onClick={UpdateProfile}
            disabled={loading}
            className="cursor-pointer"
          >
            {loading ? "Saving..." : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
 
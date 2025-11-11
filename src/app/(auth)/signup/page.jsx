"use client";

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link";
import Cookies from "js-cookie";
import Spinner from "@/components/ui/Spinner";


const SignUp = () => {
  const [form, setForm] = useState({ username: "", password: "", email: "" });
  const [error, setError] = useState("");
  const router = useRouter();
  const [loading, setloading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setloading(true)
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Email or username already exists");
      }

      const data = await res.json();
      const { user, token } = data;
      Cookies.set("user", user._id);
      Cookies.set("token", token, { expires: 7 });
      router.push("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setloading(false)
    }
  };
  return (
    <div className="min-h-screen w-full flex items-center  justify-center bg-gradient-to-br from-orange-100 via-orange-200 to-orange-300 md:p-4 relative overflow-hidden">

      <div className="absolute animate md:top-80 scale-75 top-[70%] left-1/2 md:left-60 flex gap-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden w-96">
          <img src="https://tse2.mm.bing.net/th/id/OIP.b1gmgysv6p1lgB1PtXUkYAHaE0?rs=1&pid=ImgDetMain&o=7&rm=3" alt="blog" className="w-full h-38 object-cover" />
          <div className="p-5">
            <h2 className="text-lg font-semibold text-orange-500">Rising Stars of World Football 2025</h2>
            <div className="text-sm text-gray-400 mt-4">
              <p>SportsWeekly</p>
              <p>July 10, 2025</p>
            </div>
            <button className="mt-4 inline-block bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition">
              Read More
            </button>
          </div>
        </div>
      </div>

      <div className="absolute animate2 md:top-10 scale-75 md:-left-110 w-[300%] flex gap-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden w-96">
          <img src="https://th.bing.com/th/id/R.c4f8e84c6e282d6804587d47eb0bdf81?rik=BUTTZJht%2fpZ9MA&pid=ImgRaw&r=0" alt="blog" className="w-full h-38 object-cover" />
          <div className="p-5">
            <h2 className="text-lg font-semibold text-orange-500">The Next Era of Space Exploration</h2>
            <div className="text-sm text-gray-400 mt-4">
              <p>AstroGeek</p>
              <p>July 9, 2025</p>
            </div>
            <button className="mt-4 inline-block bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition">
              Read More
            </button>
          </div>
        </div>
      </div>

      <div className="absolute animate3 md:top-0 scale-75 md:left-190 flex gap-8">
        <div
          className="bg-white rounded-2xl shadow-lg overflow-hidden w-96"
        >
          <img
            src="https://statics.vinpearl.com/asia-travel-thumb_1664456142.jpg"
            alt="blog"
            className="w-full h-38 object-cover"
          />
          <div className="p-5">
            <h2 className="text-lg font-semibold text-orange-500">
              Top 5 Destinations to Travel in Asia
            </h2>
            <div className="text-sm text-gray-400 mt-4">
              <p>Nomadic Cio</p>
              <p>July 8, 2025</p>
            </div>
            <button className="mt-4 inline-block bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition">
              Read More
            </button>
          </div>
        </div>
      </div>

      <div className="absolute animate3 md:top-80 scale-75 md:left-250 flex gap-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden w-96">
          <img src="https://tse4.mm.bing.net/th/id/OIP.JTgUfaO1CsuhZbK9T5OWigHaHa?rs=1&pid=ImgDetMain&o=7&rm=3" alt="blog" className="w-full h-38 object-cover" />
          <div className="p-5">
            <h2 className="text-lg font-semibold text-orange-500">5 Easy Recipes to Try This Weekend</h2>
            <div className="text-sm text-gray-400 mt-4">
              <p>KitchenWhiz</p>
              <p>July 6, 2025</p>
            </div>
            <button className="mt-4 inline-block bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition">
              Read More
            </button>
          </div>
        </div>
      </div>

      {/* SignUp Form */}
      <Card className="w-full md:w-100 h-screen md:h-fit flex justify-center  relative z-[10]">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <CardHeader>
            <CardTitle className="text-orange-500">Wellcome to Bloggedin</CardTitle>
            <CardDescription>
              Enter your details below to signup to your account
            </CardDescription>
            <CardAction>
              <Link href={'/signin'}>Sign In</Link>
            </CardAction>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Your username"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="********"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full mt-5 cursor-pointer">
              {
                loading ? (
                  <Spinner />
                ) : (
                  <span>Sign up</span>
                )
              }
            </Button>
          </CardFooter>
        </form>

      </Card>

    </div>
  );
};

export default SignUp;

"use client";

import React, { useState } from "react";
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

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [loading, setloading] = useState(false)
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setloading(true)
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.message || "Login failed");
        return;
      }

      const { user, token } = await res.json();

      if (!user || !token) {
        setError("Invalid login response");
        return;
      }

      Cookies.set("user", user._id);
      Cookies.set("token", token);

      router.push("/");
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setloading(false)
    }
  };



  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-orange-100 via-orange-200 to-orange-300 md:p-4 relative overflow-hidden">

      <div className="absolute animate left-50 top-120 sm:top-80 scale-75 sm:left-60 flex gap-8">
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

      <div className="absolute animate2 sm:top-10 scale-75 top-10 -left-80 sm:-left-110 w-[300%] flex gap-8">
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

      <div className="absolute animate3 top-0 scale-75 left-45 sm:left-190 flex gap-8">
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

      <div className="absolute animate3 top-130 sm:top-80 scale-75 left-250 flex gap-8">
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

      {/* Add your other floating cards similarly, replacing <img> with <Image> */}

      {/* Login Form */}
      <Card className="w-full md:w-100 md:h-fit h-screen md:rounded-2xl rounded-none flex  justify-center relative z-99 ">
        <CardHeader>
          <CardTitle className="text-orange-500">Wellcome to Bloggedin</CardTitle>
          <CardDescription>
            Enter your details below to login to your account
          </CardDescription>
          <CardAction>
            <Link className="text-sm text-zinc-700 dark:text-zinc-300" href={'/signup'}>Sign Up</Link>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  value={form.email}    // always a string
                  onChange={handleChange}
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="********"
                  value={form.password} 
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
            <Button type="submit" className="w-full  mt-5 cursor-pointer">
              {
                loading ? (
                  <Spinner />
                ) : (
                  <span>Login</span>
                )
              }
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;

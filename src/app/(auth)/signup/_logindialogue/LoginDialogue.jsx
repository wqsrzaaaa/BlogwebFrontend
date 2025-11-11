"use client"

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
import Spinner from "@/components/ui/Spinner"
import Cookies from "js-cookie"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function CardDemo() {

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
    e.preventDefault(); // prevent page reload

    try {
      setloading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: form.email, password: form.password }),
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

      window.location.reload(); 
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setloading(false);
    }
  };

  return (
    <div className="w-full h-screen fixed inset-0 z-999 top-0 left-0 flex items-center justify-center bg-black/40">
      <Card onClick={(e) => e.stopPropagation()} className="w-full z-999 max-w-sm">
        <CardHeader>
          <CardTitle className={'text-gray-800 dark:text-white'}>Login to your account</CardTitle>
          <CardDescription>
            Enter your details below to excess all features
          </CardDescription>
          <CardAction>

          </CardAction>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label className={"text-gray-800 dark:text-white"} htmlFor="email">Email</Label>
                <Input
                  value={form.email}
                  onChange={handleChange}
                  className={"border-gray-500"}
                  id="email"
                  type="email"
                  name="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label className={"text-gray-800 dark:text-white"} htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className={"border-gray-500"}
                  placeholder="******"
                  required
                />
              </div>
            </div>

            <CardFooter className="w-full flex-col gap-2 mt-5 p-0">
              <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-600 dark:text-white cursor-pointer">
                {loading ? <Spinner /> : <span>Login</span>}
              </Button>
              <Button
                onClick={() => router.push('/signup')}
                className="text-sm text-gray-700  cursor-pointer"
                variant="link"
              >
                Sign Up
              </Button>
            </CardFooter>
          </form>

        </CardContent>
      </Card>
    </div>
  )
}

"use client";
import Navbar from "@/(Components)/Navbar";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY;
        const res = await fetch(
          `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`
        );
        const data = await res.json();
        setArticles(data.articles || []);
      } catch (err) {
        console.error("Error fetching news:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

 if (loading) {
  return (
    <div className="p-6 mt-20 space-y-6">
      <h1 className="text-2xl px-4 font-bold">Today's News</h1>
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl shadow-md p-4 flex gap-4 items-start animate-pulse"
        >
          <div className="w-40 h-28 bg-gray-300 rounded-md"></div>
          <div className="flex-1 space-y-3">
            <div className="h-5 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded w-full"></div>
            <div className="h-4 bg-gray-300 rounded w-2/3"></div>
            <div className="h-4 bg-gray-300 rounded w-1/4 mt-2"></div>
          </div>
        </div>
      ))}
    </div>
  );
}


  return (
    <>
      <Navbar />
    <div className="p-6 mt-20 space-y-6">
      <h1 className="text-2xl md:px-4 font-bold">Today's News</h1>

      {articles.length === 0 ? (
        <p>No news available.</p>
      ) : (
        articles.map((a, i) => (
          <div
            key={i}
            className="rounded-xl  dark:shadow-none  dark:border-b-1 border-zinc-400 md:p-4 flex gap-4 items-start"
          >
            {a.urlToImage && (
              <img
                src={a.urlToImage}
                alt={a.title}
                className="w-40 h-28 object-cover rounded-md"
              />
            )}
            <div>
              <h2 className="font-semibold text-lg">{a.title}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">{a.description}</p>
              <a
                href={a.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 text-sm mt-2 inline-block"
              >
                Read more →
              </a>
            </div>
          </div>
        ))
      )}
    </div>
    </>
  );
};

export default Page;

import { useRouter } from "next/router";
import React from "react";

export default function Card({ title, body, createdAt }) {
  const router = useRouter();

  return (
    <div
      className="hover:scale-110 duration-200 ease-out cursor-pointer flex flex-col justify-between rounded-md shadow-lg hover:shadow-xl shadow-blue-400 hover:shadow-blue-300 bg-gradient-to-br from-cyan-500 to-blue-500 text-left p-5"
      onClick={() => router.push(`/${title}`)}
    >
      <div>
        <h1 className="text-2xl font-title">{title}</h1>
        <p className="font-body text-white mt-2">{body.substring(0, 100)}</p>
      </div>
      <p className="font-body text-white mt-8">{createdAt.split("T")[0]}</p>
    </div>
  );
}

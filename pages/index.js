import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Card from "../components/Card";
import { supabase } from "../utils/supabase";

export default function Home() {
  const [title, setTitle] = useState("");
  const [allPosts, setAllPosts] = useState([]);
  const router = useRouter();
  const goToPage = () => {
    router.push(`/${title}`);
  };

  const getAllPosts = async () => {
    let { data: posts, error } = await supabase.from("posts").select("*");
    setAllPosts(posts);
  };

  useEffect(() => {
    getAllPosts();
  }, []);
  return (
    <div>
      <Head>
        <title>Venter</title>
        <meta name="description" content="Random App to Vent it out" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="text-center mb-10 px-5 xl:px-40">
        <div className="flex flex-col sm:flex-row px-2 lg:px-10 mt-10 items-center">
          <h1 className="text-3xl lg:text-4xl font-title tracking-widest">
            Venter
          </h1>
          <input
            className="rounded-lg h-8 sm:h-12 my-5 sm:my-0 bg-gray-100 w-full mx-2 sm:mx-5 lg:mx-20 pl-2 lg:pl-5 placeholder:text-sm placeholder:font-bold font-bold"
            type="text"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            placeholder="Type a title 📓"
            onKeyPress={(e) => {
              if (e.key === "Enter") goToPage();
            }}
          />
          <button
            className="rounded-lg bg-gradient-to-r h-8 sm:h-12 mt-2 sm:mt-0 from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 px-5 lg:px-12 text-white font-bold"
            onClick={goToPage}
          >
            Go
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10 mt-10">
          {allPosts.map((post) => (
            <Card
              key={post.id}
              title={post.title}
              createdAt={post.created_at}
              body={post.postbody}
              id={post.id}
            />
          ))}
        </div>
      </main>

      <footer className="mb-8 mt-20 text-center w-full">
        <p className="text-gray-600 font-body">
          Made by{" "}
          <a href="http://github.com/programVeins">
            <span className="text-cyan-500 cursor-pointer">Sabesh</span>
          </a>{" "}
        </p>
      </footer>
    </div>
  );
}

import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";

export default function Post() {
  const router = useRouter();
  const title = router.query.post;
  const [thisPost, setThisPost] = useState({});
  const [postAlreadyExisting, setPostAlreadyExisting] = useState(true);
  const [newPostBody, setNewPostBody] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [editingTitle, setEditingTitle] = useState(false);

  const [editingExistingPost, setEditingExistingPost] = useState(false);

  const [showingAlert, setShowingAlert] = useState(false);

  const getPosts = async () => {
    let { data: posts, error } = await supabase
      .from("posts")
      .select("*")
      .eq("title", title.toLowerCase());
    if (posts.length > 0) {
      setThisPost(posts[0]);
      setPostAlreadyExisting(true);
    } else {
      setPostAlreadyExisting(false);
    }
  };

  const createPost = async () => {
    let { data: newPost, error } = await supabase.from("posts").insert({
      title: title.toLowerCase(),
      postbody: newPostBody,
      created_at: new Date(),
    });
    setPostAlreadyExisting(true);
  };

  const updatePost = async () => {
    let { data: updatedPost, error } = await supabase
      .from("posts")
      .update({
        postbody: newPostBody,
        created_at: new Date(),
      })
      .eq("title", title.toLowerCase());
    setEditingExistingPost(false);
    setThisPost(updatedPost[0]);
  };

  const deletePost = async () => {
    let { data: deletedPost, error } = await supabase
      .from("posts")
      .delete()
      .eq("title", title.toLowerCase());
    setPostAlreadyExisting(false);
  };

  const editExistingPost = () => {
    setEditingExistingPost(true);
    setNewPostBody(thisPost.postbody);
  };

  useEffect(() => {
    if (title) {
      getPosts();
      setNewTitle(title);
    }
  }, [title, postAlreadyExisting]);

  return (
    <div>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="md:px-20 xl:px-40">
        <div className="px-5 md:px-10 xl:px-40 mt-10">
          <svg
            onClick={() => router.push("/")}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            className="bi bi-arrow-left cursor-pointer mb-10 hover:fill-blue-500"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
            />
          </svg>
          {postAlreadyExisting && !editingExistingPost ? (
            <React.Fragment>
              <div className="flex justify-between">
                <h1 className="text-4xl font-title">
                  {thisPost.title?.toUpperCase()}
                </h1>
                {thisPost.title === "why" ||
                thisPost.title === "how it works" ? null : (
                  <div className="flex flex-col sm:flex-row">
                    <button
                      className="rounded-lg mr-5 bg-gradient-to-r from-orange-300 to-orange-400 hover:from-orange-400 hover:to-orange-500 px-2 py-1 sm:px-5 md:px-12 text-white font-bold text-xs sm:text-lg w-full sm:w-auto sm:my-auto my-1"
                      onClick={() => {
                        editExistingPost();
                      }}
                    >
                      Edit Post
                    </button>
                    <button
                      className="rounded-lg bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 px-2 py-1 sm:px-5 md:px-12 text-white font-bold text-xs sm:text-lg w-full sm:w-auto sm:my-auto my-1"
                      onClick={() => {
                        setShowingAlert(true);
                      }}
                    >
                      Delete Post
                    </button>
                  </div>
                )}
              </div>
              <p className="text-gray-600 font-body">
                {thisPost.created_at?.split("T")[0]}
              </p>
              <p className="text-gray-600 text-xl mt-10 font-body">
                {thisPost.postbody}
              </p>
            </React.Fragment>
          ) : (
            <div className="px-2 md:px-10 xl:px-40 mt-10">
              <div className="flex items-end">
                {editingTitle ? (
                  <input
                    className="rounded-lg h-12 bg-gray-100 border-1 border-gray-50 pl-5 text-4xl font-title"
                    type="text"
                    onChange={(e) => setNewTitle(e.target.value)}
                    value={newTitle}
                    onBlur={() => {
                      router.push(`/${newTitle}`);
                      setEditingTitle(false);
                    }}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        router.push(`/${newTitle}`);
                        setEditingTitle(false);
                      }
                    }}
                  />
                ) : (
                  <React.Fragment>
                    <h1 className="text-4xl font-title">
                      {title?.toUpperCase()}
                    </h1>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-pen-fill mb-2 ml-2 cursor-pointer"
                      viewBox="0 0 16 16"
                      onClick={() => setEditingTitle(true)}
                    >
                      <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001z" />
                    </svg>
                  </React.Fragment>
                )}
              </div>
              <textarea
                required
                value={newPostBody}
                onChange={(e) => setNewPostBody(e.target.value)}
                className="h-96 resize-none bg-gray-100 w-full mt-10 rounded-md p-5 focus:outline-none"
              ></textarea>
              <div className="flex justify-end mt-5">
                <button
                  onClick={() => {
                    if (editingExistingPost) {
                      updatePost();
                    } else {
                      createPost();
                    }
                  }}
                  className="rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 px-12 py-2 text-white font-bold"
                >
                  Post
                </button>
              </div>
            </div>
          )}
        </div>

        {showingAlert ? (
          <div className="fixed bottom-0 sm:right-0 w-full sm:w-auto text-center p-2 mb-10 mr-10">
            <div className="bg-gray-200 text-black text-center p-4 rounded-lg">
              <p className="text-lg font-body mb-5">
                This will delete the post! Are you sure?
              </p>
              <div className="flex justify-between">
                <button
                  onClick={() => {
                    setShowingAlert(false);
                  }}
                  className="rounded-lg bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 px-3 py-2 text-white font-bold text-xs sm:text-lg w-2/5 sm:my-auto my-1"
                >
                  No
                </button>
                <button
                  onClick={() => {
                    deletePost();
                    setShowingAlert(false);
                  }}
                  className="rounded-lg bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 px-3 py-2 text-white font-bold text-xs sm:text-lg w-2/5 sm:my-auto my-1"
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </main>
      <footer className="relative my-8 md:my-0 md:absolute md:bottom-5 text-center w-full">
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

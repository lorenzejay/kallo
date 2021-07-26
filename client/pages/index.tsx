import Head from "next/head";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import Layout from "../components/layout";
import { DarkModeContext } from "../context/darkModeContext";
import { useContext } from "react";

export default function Home() {
  const { isDarkMode } = useContext(DarkModeContext);
  return (
    <div>
      <Head>
        <title>Kallo</title>
        <link rel="icon" href="/home-1.png" />
      </Head>
      <Layout>
        <>
          <main
            className={`flex flex-col lg:flex-row justify-center items-center lg:justify-between text-white pt-20`}
            style={{ background: isDarkMode ? "darkBody" : "lightBody" }}
          >
            <section
              className={`flex flex-col items-center justify-center lg:justify-start lg:items-start ${
                isDarkMode ? "text-white" : "text-gray-800"
              }`}
            >
              <h1 className="text-2xl text-center lg:text-left font-bold lg:font-medium md:text-5xl xl:w-3/4 xl:leading-normal 2xl:text-7xl">
                Kallo helps teams move work forward.
              </h1>
              <p className="text-lg leading-relaxed mt-2 xl:w-3/4 xl:text-xl  xl:leading-loose text-center lg:text-left">
                Collaborate, manage projects, and reach new productivity peaks.
                From high rises to the home office, the way your team works is
                unique—accomplish it all with Kallo.
              </p>
              <button className="bg-blue-500 text-white-150  w-full md:max-w-md lg:w-48 px-4 py-2 rounded-md my-5">
                Sign Up- it's free!
              </button>
            </section>
            <img
              src="/kanbanimg.png"
              className="w-full md:max-w-md xl:max-w-lg 2xl:max-w-3xl rounded-md lg:ml-5"
            />
          </main>

          <div className="flex flex-col justify-center items-center mt-36 pb-24  xl:mt-48 text-center lg:text-left">
            <p className="font-medium text-2xl ">
              It’s more than work. It’s a way of working together.
            </p>
            <p className="text-center lg:w-3/4 mx-auto my-5 text-lg">
              Start with a Kallo board, lists, and cards. Customize and expand
              with more features as your teamwork grows. Manage projects,
              organize tasks, and build team spirit—all in one place.
            </p>
            <Link href="/signup">
              <button className="border border-white px-4 py-2 rounded-md bg-none hover:text-white bg-gray-150 text-black hover:bg-blue-500 hover:border-transparent hover:text-white-150 flex items-center transition-all duration-500">
                <span className="mr-1 ">Start Doing</span>
                <FaArrowRight size={16} />
              </button>
            </Link>
            <img
              src="/home-2.png"
              className="mx-auto rounded-md my-10 shadow-xl xl:max-w-7xl lg:w-1/2 bg-white"
            />
            <span className="text-xl xl:text-xl">
              Join over 1,000,000 teams worldwide that are using Kallo to get
              more done.
            </span>
          </div>
        </>
      </Layout>
    </div>
  );
}

import Layout from "../components/layout";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Footer from "../components/Footer";
const Feature = () => {
  const containerRef = useRef(null);
  const containerRef2 = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
  });
  const { scrollYProgress: scrollYProgress2 } = useScroll({
    target: containerRef2,
    offset: ["start end", "end"],
  });
  useEffect(() => {
    scrollYProgress2.on("change", (v) => console.log("v", v));
  }, []);

  const scaleText = useTransform(scrollYProgress, [0, 0.05, 0.1], [1, 1, 0.7]);
  const opacityText = useTransform(scrollYProgress, [0, 0.05, 0.1], [1, 1, 0]);
  const scaleImg = useTransform(
    scrollYProgress,
    [0, 0.15, 0.22, 0.3, 0.35, 0.5, 0.85],
    [1, 1, 1.2, 1.2, 2, 2, 1]
  );
  const opacityImg = useTransform(scrollYProgress, [0.8, 0.9], [1, 0]);

  const yImg = useTransform(scrollYProgress, [0.22, 0.3], [0, -300]);
  const xImg = useTransform(
    scrollYProgress,
    [0.3, 0.35, 0.36, 0.45, 0.5, 0.85],
    [0, 600, 600, -600, -600, 0]
  );
  const [windowWidth, setWindowWidth] = useState<number | undefined>(undefined);
  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    // Call handler right away so state gets updated with initial window size
    handleResize();
    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const section2Item1Y = useTransform(
    scrollYProgress2,
    [0, 0.2, 0.25],
    [200, 200, 0]
  );
  const section2Item1Opacity = useTransform(
    scrollYProgress2,
    [0, 0.2, 0.25],
    [0, 0, 1]
  );
  const section2Item2Y = useTransform(
    scrollYProgress2,
    [0, 0.74, 0.8],
    [200, 200, 0]
  );
  const section2Item2Opacity = useTransform(
    scrollYProgress2,
    [0, 0.74, 0.8],
    [0, 0, 1]
  );

  return (
    <Layout>
      <div className="features-noscrollbar">
        <div className="w-full mx-auto lg:h-[325vh]" ref={containerRef}>
          <motion.div className="relative lg:sticky pt-0 mt-0 lg:top-3/4 lg:-translate-y-[40%] 2xl:-translate-y-[50%] 3xl:-translate-y-[50%] space-y-8">
            <motion.div
              style={
                windowWidth && !isNaN(windowWidth) && windowWidth >= 1024
                  ? { scale: scaleText, opacity: opacityText }
                  : { opacity: 1 }
              }
              className="max-w-[800px]  mx-auto lg:text-center space-y-8 "
            >
              <div className="font-bold tracking-tighter  md:text-5xl hidden md:block 3xl:text-7xl">
                Kallo
              </div>
              <p className="text-xl text-black z-10 3xl:text-2xl">
                {" "}
                Collaborate, manage projects, and reach new productivity peaks.
                From high rises to the home office, the way your team works is
                unique—accomplish it all with Kallo.
              </p>
            </motion.div>
            <motion.div
              style={
                windowWidth && !isNaN(windowWidth) && windowWidth >= 1024
                  ? { scale: scaleImg, y: yImg, x: xImg, opacity: opacityImg }
                  : {}
              }
              className="shadow-2xl rounded-md w-full max-w-7xl 3xl:max-w-[2500px] mx-auto"
            >
              <Image
                src={"/kallo_kanban_board.png"}
                width={3808}
                height={2202}
                className="shadow-2xl rounded-md w-full"
                alt="kanban board example"
              />
            </motion.div>

            <div className="lg:-translate-y-[200%] 3xl:translate-y-32 lg:translate-x-1/2 lg:w-1/2">
              <h2 className="font-bold text-5xl lg:text-7xl uppercase tracking-tighter ">
                Features
              </h2>
            </div>
          </motion.div>
        </div>
        <div className="lg:-mt-80 lg:h-[150vh]" ref={containerRef2}>
          <div className="lg:sticky lg:top-[10%] space-y-12 lg:space-y-24">
            <motion.div
              style={
                windowWidth && !isNaN(windowWidth) && windowWidth >= 1024
                  ? { y: section2Item1Y, opacity: section2Item1Opacity }
                  : {}
              }
              className="mx-auto flex flex-col-reverse lg:flex-row items-start lg:justify-center space-y-12 lg:space-y-0 lg:space-x-12"
            >
              <motion.div className="max-w-xl 3xl:max-w-2xl bg-white-150 shadow-2xl rounded-md">
                <Image
                  // className="max-w-[100px]"
                  src={"/features/columns.png"}
                  width={904}
                  height={808}
                />
              </motion.div>
              <div className="flex flex-col space-y-2">
                <h2 className="text-4xl 3xl:text-7xl font-semibold tracking-tighter">
                  Kanban Board
                </h2>
                <p className="max-w-xl 3xl:text-xl">
                  Using columns and cards, teams can see the entire workflow at
                  a glance, making it easy to understand the current state of
                  tasks and identify bottlenecks or areas that require
                  attention.
                </p>
                {/* <ul> */}
                {/* <li>Breakdown tasks based on your objective.</li> */}
                {/* </ul> */}
              </div>
            </motion.div>
            <motion.div
              style={
                windowWidth && !isNaN(windowWidth) && windowWidth >= 1024
                  ? { y: section2Item2Y, opacity: section2Item2Opacity }
                  : {}
              }
              className="mx-auto flex flex-col-reverse lg:flex-row-reverse items-start lg:justify-center space-y-12 lg:space-y-0 lg:space-x-12"
            >
              <motion.div className="max-w-lg 3xl:max-w-2xl bg-white-150 shadow-2xl rounded-md lg:ml-12">
                <Image
                  // className="max-w-[100px]"
                  src={"/features/task.png"}
                  className="ml-12"
                  width={904}
                  height={808}
                />
              </motion.div>
              <div className="flex flex-col space-y-2 ">
                <h2 className="text-4xl font-semibold tracking-tighter 3xl:text-7xl">
                  Tasks
                </h2>
                <p className="3xl:text-xl">
                  Breakdown tasks based on your objective.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
        <div className="mt-12">
          <Footer />
        </div>
      </div>
    </Layout>
  );
};

export default Feature;

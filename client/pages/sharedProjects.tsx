import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Layout from "../components/layout";
import { configWithToken } from "../functions";
import { RootState } from "../redux/store";
import { Projects } from "../types/projectTypes";

const SharedProjects = () => {
  const [projects, setProjects] = useState<Projects[]>([]);

  const userLogin = useSelector((state: RootState) => state.userLogin);
  const { userInfo } = userLogin;

  const getSharedProjects = async () => {
    if (userInfo?.token) {
      const config = configWithToken(userInfo.token);
      const { data } = await axios.get("/api/projects/shared-projects", config);
      setProjects(data);
      return data;
    }
  };

  useEffect(() => {
    if (userInfo) {
      getSharedProjects();
    }
  }, [userInfo]);

  return (
    <Layout>
      <>
        <main>shared projects here:</main>
        <div className="flex flex-col lg:grid grid-cols-3 gap-5">
          {projects !== undefined &&
            projects.map((project) => (
              <Link
                href={`/projects/${project.project_id}`}
                key={project.project_id}
              >
                <div className="card-color shadow-xl border rounded-md h-auto cursor-pointer w-72 relative p-2 pb-10 mt-3 hover:transform hover:shadow-lg transition-all duration-500 ease-in-out">
                  <img
                    src={project.header_img || "sample-card-img.jpg"}
                    className="rounded-md mb-2 w-full h-44 object-cover"
                    alt={project.title}
                  />
                  <h3 className=" border-black text-white font-semibold w-full ">
                    {project.title}
                  </h3>
                  <div className=" my-3"></div>

                  <button className="absolute right-2 bottom-3 bg-green-600 px-3 text-white">
                    -----
                  </button>
                </div>
              </Link>
            ))}
        </div>
      </>
    </Layout>
  );
};

export default SharedProjects;

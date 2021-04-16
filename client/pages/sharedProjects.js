import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Layout from "../components/layout";
import { configWithToken } from "../functions";

const SharedProjects = () => {
  const [projects, setProjects] = useState("");

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(async () => {
    if (userInfo) {
      const config = configWithToken(userInfo.token);
      const { data } = await axios.get("/api/projects/shared-projects", config);
      setProjects(data);
    }
  }, [userInfo]);

  return (
    <Layout>
      <main>shared projects here:</main>
      <div className="flex flex-col lg:grid grid-cols-3 gap-5">
        {projects &&
          projects.map((project) => (
            <Link href={`/projects/${project.project_id}`} key={project.project_id}>
              <div className="card-color shadow-xl border rounded-md h-auto cursor-pointer w-72 relative p-2 pb-10 mt-3 hover:transform hover:shadow-lg transition-all duration-500 ease-in-out">
                <img
                  src={project.header_img || "sample-card-img.jpg"}
                  className="rounded-md mb-2 w-full h-44 object-cover"
                  alt={project.title}
                />
                <h3 className=" border-black text-white font-semibold w-full ">{project.title}</h3>
                <div className=" my-3">
                  {/* <div className="rounded bg-gray-300 p-1 text-gray-900 flex items-center justify-center w-8 h-8 text-lg">
                    {project.project_owner.substring(0, 1)}
                  </div> */}
                  {/* {project.sharedWith.map((person) => {
                    <div>{person}</div>;
                  })} */}
                </div>

                {/* <div className="p-5 text-white card-color">
                <p className="font-medium">Client Name:</p>
                <p className="text-gray-500 mb-3">{project.clientName}</p>
                <p>{project.email}</p>
                <p className="font-medium">Phone Number:</p>
                <p className="text-gray-400">{project.phoneNumber}</p>
            </div> */}
                <button className="absolute right-2 bottom-3 bg-green-600 px-3 text-white">
                  -----
                </button>
              </div>
            </Link>
          ))}
      </div>
    </Layout>
  );
};

export default SharedProjects;

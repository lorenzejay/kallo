import axios from "axios";
import { useEffect } from "react";
import ProjectCard from "../components/projectCard";
import { useQuery } from "react-query";
import Layout from "../components/layout";
import { configWithToken } from "../functions";
import { useAuth } from "../hooks/useAuth";
import { ProjectDeets } from "../types/projectTypes";
import Loader from "../components/loader";
import { useRouter } from "next/router";

const SharedProjects = () => {
  const router = useRouter();
  const { userToken } = useAuth();
  useEffect(() => {
    if (!userToken) router.push("/signin");
  }, [userToken]);
  const fetchSharedProjects = async () => {
    try {
      if (!userToken || userToken === null) return;
      const config = configWithToken(userToken);
      const { data } = await axios.get(
        "/api/sharing/get-shared-projects",
        config
      );
      return data;
    } catch (error) {
      // console.log(error);
      return error;
    }
  };

  const { data, isLoading } = useQuery<ProjectDeets[]>(
    "shared-projects",
    fetchSharedProjects
  );
  // console.log(data);

  // const getSharedProjects = async () => {
  //   if (userInfo?.token) {
  //     const config = configWithToken(userInfo.token);
  //     const { data } = await axios.get("/api/projects/shared-projects", config);
  //     setProjects(data);
  //     return data;
  //   }
  // };

  // useEffect(() => {
  //   if (userInfo) {
  //     getSharedProjects();
  //   }
  // }, [userInfo]);

  return (
    <Layout>
      <>
        <h1>Shared projects here:</h1>
        {isLoading && <Loader />}
        <main className="flex flex-col min-h-screen lg:grid grid-cols-3 gap-5">
          {data &&
            data.map((project, i) => (
              <ProjectCard
                projectId={project.project_id}
                headerImg={project.header_img}
                title={project.title}
                key={i}
              />
            ))}
        </main>
      </>
    </Layout>
  );
};

export default SharedProjects;

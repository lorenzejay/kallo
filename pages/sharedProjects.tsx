import ProjectCard from "../components/projectCard";
import { useQuery } from "@tanstack/react-query";
import Layout from "../components/layout";
import Loader from "../components/loader";
import supabase from "../utils/supabaseClient";

import ProtectedWrapper from "../components/Protected";
import { useUser } from "@supabase/auth-helpers-react";
import { ProjectDeets } from "../types/projectTypes";

const SharedProjects = () => {
  const user = useUser();

  const fetchSharedProjects = async (): Promise<ProjectDeets[]> => {
    const { error, data } = await supabase
      .from("shared_users")
      .select(
        ` 
        projects (
          *
        )`
      )
      .match({ shared_user: user?.id });
    if (error) throw new Error(error.message);
    console.log("data", data);

    return data as any[];
  };

  const { data, isLoading } = useQuery(
    ["shared-projects"],
    fetchSharedProjects,
    { enabled: !!user?.id }
  );

  return (
    <ProtectedWrapper>
      <Layout>
        <>
          <h1>Shared projects here:</h1>
          {isLoading && <Loader />}
          <main className="flex flex-col min-h-screen lg:grid grid-cols-3 gap-5">
            {data &&
              // @ts-ignore
              data.map(({ projects }, i) => {
                return (
                  <ProjectCard
                    projectId={projects.project_id}
                    headerImg={projects.header_img}
                    title={projects.title}
                    key={i}
                    isPrivate={projects.is_private}
                  />
                );
              })}
          </main>
        </>
      </Layout>
    </ProtectedWrapper>
  );
};

export default SharedProjects;

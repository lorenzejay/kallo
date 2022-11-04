import ProjectCard from "../components/projectCard";
import { useQuery } from "@tanstack/react-query";
import Layout from "../components/layout";
import Loader from "../components/loader";
import supabase from "../utils/supabaseClient";
import useUser from "../hooks/useUser";
import ProtectedWrapper from "../components/Protected";

const SharedProjects = () => {
  const { data: user } = useUser();

  const fetchSharedProjects = async () => {
    const { error, data } = await supabase
      .from("shared_users")
      .select(
        ` 
        projects (
          *
        )`
      )
      .match({ shared_user: user.user_id });
    if (error) throw new Error(error.message);
    return data;
  };

  const { data, isLoading } = useQuery(
    ["shared-projects"],
    fetchSharedProjects,
    { enabled: !!user?.user_id }
  );

  return (
    <ProtectedWrapper>
      <Layout>
        <>
          <h1>Shared projects here:</h1>
          {isLoading && <Loader />}
          <main className="flex flex-col min-h-screen lg:grid grid-cols-3 gap-5">
            {data &&
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

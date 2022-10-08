import { useEffect, useState } from "react";
import Layout from "../../components/layout";
import Modal from "../../components/modal";
import { BsUnlock, BsLock, BsFillImageFill } from "react-icons/bs";

import UnsplashImageSearch from "../../components/unsplashImageSearch";
import PrivacyOptions from "../../components/privacyOptions";
import ProjectCard from "../../components/projectCard";
import Head from "next/head";

import {
  ProjectsNew,
} from "../../types/projectTypes";
import { useAuth } from "../../hooks/useAuth";
import supabase from "../../utils/supabaseClient";

const Projects = () => {
  const auth = useAuth();
  const { user } = auth;
  const [projects, setProjects] = useState<any[]>([])

  const [openModal, setOpenModal] = useState(false);
  const [projectTitle, setProjectTitle] = useState("");
  const [projectHeader, setProjectHeader] = useState(
    "https://source.unsplash.com/random/1600x900"
  );
  //set is private
  const [isPrivateProject, setIsPrivateProject] = useState(false);
  const [openPrivacyOptions, setOpenPrivacyOptions] = useState(false);

  const [revealImageSearch, setRevealImageSearch] = useState(false);


  const fetchProjects = async () => {
    const { data, error } = await supabase.from("projects").select();
    if(error) throw error
 
    if(data) {
      setProjects(data);
    };
  };
  useEffect(() => {
    fetchProjects()
  }, [])
  const createProject = async () => {
    try {
      const trimmedTitle = projectTitle.trim()
      const { data, error } = await supabase.from('projects').insert([{
        title: trimmedTitle,
        header_img: projectHeader,
        is_private: isPrivateProject,
        project_owner: user?.id
      }]).limit(1).single() //retrieves row back
      if(error) throw error
      setProjects([...projects, data])
    } catch (error) {
      throw Error
    }
  };

  const handleAddProject = () => {
    if (projectTitle !== "") {
      createProject()
        .then(() => {
          setProjectTitle("");
          setProjectHeader("");
          setIsPrivateProject(false);
          setOpenModal(false);
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      window.alert("You must include a project title.");
    }

    // setProjects([...projects, {}])
  };

  return (
    <>
      <Head>
        <title>Projects | Kallo</title>
      </Head>
      <Layout>
        <>
          {/* {loading && <Loader />} */}
          {/* {isLoading && <Loader />} */}
          <section
            className={`relative flex flex-col justify-start transition-all duration-300 ease-in-out lg:min-h-screen pt-0 mt-0 pb-20 z-20 `}
          >
            <div className="flex justify-between">
              <div>
                <h1 className="text-4xl font-bold uppercase ">Projects</h1>
                {projects && (
                  <p className="mb-5 text-white">Items: {projects.length || 0}</p>
                )}
              </div>

              <Modal
                modalName="ADD +"
                bgColor={"bg-blue-500 text-white-150 "}
                openModal={openModal}
                setOpenModal={setOpenModal}
                contentHeight="h-auto"
                contentWidth="w-full mx-5 md:w-1/2 2xl:w-1/4"
              >
                <>
                  <img
                    src={projectHeader || "sample-card-img.jpg"}
                    className="rounded-md w-full h-64 object-cover"
                  />
                  <input
                    placeholder="Add project title"
                    className="my-3 px-3 py-1 w-full rounded-sm text-black"
                    onChange={(e) => setProjectTitle(e.target.value)}
                  />
                  <div className="w-full flex justify-between items-center text-base">
                    <div className="w-auto lg:w-1/2 lg:mr-3">
                      <button
                        className="bg-gray-300 px-8 py-1 rounded-sm my-2 flex items-center justify-center lg:w-full relative hover:shadow-2xl"
                        onClick={() => setRevealImageSearch(!revealImageSearch)}
                      >
                        <BsFillImageFill size={12} className="mr-2" />
                        Cover
                      </button>
                      {revealImageSearch && (
                        <UnsplashImageSearch
                          setProjectHeader={setProjectHeader}
                          setRevealImageSearch={setRevealImageSearch}
                          revealImageSearch={revealImageSearch}
                          className="top-72"
                          updateHeader={false}
                        />
                      )}
                    </div>
                    <div className="w-auto relative lg:w-1/2 lg:ml-3">
                      <button
                        className={`${
                          isPrivateProject ? "bg-red-300" : "bg-green-300"
                        } px-8 py-1 rounded-sm my-2 flex items-center justify-center relative hover:shadow-2xl lg:w-full `}
                        onClick={() =>
                          setOpenPrivacyOptions(!openPrivacyOptions)
                        }
                      >
                        {isPrivateProject ? (
                          <>
                            <BsLock size={12} className="mr-2" />
                            Private
                          </>
                        ) : (
                          <>
                            <BsUnlock size={12} className="mr-2" />
                            Public
                          </>
                        )}
                      </button>
                      {openPrivacyOptions && (
                        <PrivacyOptions
                          setIsPrivateProject={setIsPrivateProject}
                          is_private={isPrivateProject}
                          setOpenPrivacyOptions={setOpenPrivacyOptions}
                          className=" top-5 right-0 z-50 mb-10 lg:right-10 shadow-2xl"
                        />
                      )}
                    </div>
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <button
                      className="px-2 py-1 rounded-sm hover:bg-red-400 transition-all duration-500 ease-in-out mr-3"
                      onClick={() => setOpenModal(false)}
                    >
                      cancel
                    </button>
                    <button
                      className="px-2 py-1 rounded-sm bg-blue-500 text-white-175 hover:shadow-2xl transition-all duration-500 ease-in-out disabled:opacity-50"
                      onClick={handleAddProject}
                      disabled={projectTitle === "" ? true : false}
                    >
                      + create
                    </button>
                  </div>
                </>
              </Modal>
            </div>

            {projects && projects.length > 0 ? (
              <div className="flex flex-col items-center md:grid md:grid-cols-2 lg:items-start lg:grid-cols-3 2xl:grid-cols-4 gap-5">
                {projects &&
                  projects.map((project: ProjectsNew, i: number) => {
                    return (
                      <ProjectCard
                        key={i}
                        projectId={project.project_id}
                        title={project.title}
                        headerImg={project.header_img}
                      />
                    );
                  })}
              </div>
            ) : (
              <>{<h2>You do not have any projects.</h2>}</>
            )}
          </section>
        </>
      </Layout>
    </>
  );
};

export default Projects;

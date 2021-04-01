import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../../components/layout";
import Modal from "../../components/modal";
// import { AiFillFileImage } from "react-icons/ai";
import { BsUnlock, BsLock, BsFillImageFill } from "react-icons/bs";
import Link from "next/link";
import { useRouter } from "next/router";
import { AiOutlineClose } from "react-icons/ai";
import { addProject, getLoggedInUserProjects } from "../../redux/Actions/projectActions";
import UnsplashImageSearch from "../../components/unsplashImageSearch";

const Projects = () => {
  const router = useRouter();

  const [openModal, setOpenModal] = useState(false);
  const [projectTitle, setProjectTitle] = useState("");
  const [projectHeader, setProjectHeader] = useState("");

  //set is private
  const [isPrivateProject, setIsPrivateProject] = useState(false);
  const [openPrivacyOptions, setOpenPrivacyOptions] = useState(false);

  const [revealImageSearch, setRevealImageSearch] = useState(false);
  // const [unsplashImg, setUnsplashImg] = useState("");

  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  //project redux state
  const projectAdd = useSelector((state) => state.projectAdd);
  const { created } = projectAdd;
  const projectGetUsers = useSelector((state) => state.projectGetUsers);
  const { loading, error, projects } = projectGetUsers;

  useEffect(() => {
    if (!userInfo) {
      router.push("/signin");
    }
  }, [userInfo]);

  const handleAddProject = async () => {
    //project image, title to server
    try {
      dispatch(addProject(projectTitle, projectHeader, isPrivateProject));
      setProjectTitle("");
      setProjectHeader("");
      setIsPrivateProject(false);
      setOpenModal(false);
    } catch (error) {
      console.log(error.message);
    }
    // setProjects([...projects, {}])
  };
  useEffect(() => {
    dispatch(getLoggedInUserProjects());
  }, [created]);

  return (
    <Layout>
      {loading && <h2>loading....</h2>}
      <section className="relative flex flex-col justify-center text-white">
        <div className="flex justify-between">
          <div>
            <h1 className="text-4xl font-bold uppercase ">Projects</h1>
            {projects && <p className="mb-5">Items: {projects.length || 0}</p>}
          </div>

          <Modal
            modalName="ADD +"
            bgColor={"bg-blue-400"}
            openModal={openModal}
            setOpenModal={setOpenModal}
          >
            <img src={projectHeader || "sample-card-img.jpg"} className="rounded-md" />
            <input
              placeholder="Add project title"
              className="my-3 px-3 py-1 w-full rounded-sm text-black"
              onChange={(e) => setProjectTitle(e.target.value)}
            />
            <div className="flex justify-between items-center text-base">
              <div>
                <button
                  className="bg-gray-300 px-12 py-1 rounded-sm my-2 flex items-center relative"
                  onClick={() => setRevealImageSearch(!revealImageSearch)}
                >
                  <BsFillImageFill size={12} className="mr-2" />
                  Cover
                </button>
                {revealImageSearch && (
                  <UnsplashImageSearch
                    setProjectHeader={setProjectHeader}
                    projectHeader={projectHeader}
                    setRevealImageSearch={setRevealImageSearch}
                    revealImageSearch={revealImageSearch}
                  />
                )}
              </div>
              <div className="">
                <button
                  className={`${
                    isPrivateProject ? "bg-red-300" : "bg-green-300"
                  } px-12 py-1 rounded-sm my-2 flex items-center relative`}
                  onClick={() => setOpenPrivacyOptions(!openPrivacyOptions)}
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
                  <div
                    className="  text-white absolute w-72 rounded-md p-3 z-10"
                    style={{ background: "#2f3437" }}
                  >
                    <button
                      className="absolute right-1 top-0"
                      onClick={() => setOpenPrivacyOptions(false)}
                    >
                      <AiOutlineClose size={30} />
                    </button>
                    <p className="text-2xl">Visibility</p>
                    <p className="text-base">Choose who is able to see this board.</p>
                    <button
                      className={`${
                        isPrivateProject ? "" : "bg-green-300"
                      } hover:bg-green-300 transition-all duration-500 rounded-md my-2 p-1`}
                      onClick={() => setIsPrivateProject(false)}
                    >
                      <p>Public</p>
                      <p>Anyone can see this board. Only board members can edit</p>
                    </button>
                    <button
                      className={`${
                        isPrivateProject ? "bg-red-300" : ""
                      } hover:bg-red-300 transition-all duration-500 rounded-md my-2 p-1`}
                      onClick={() => setIsPrivateProject(true)}
                    >
                      <p>Private</p>
                      <p>Only board members can see and edit this board.</p>
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="absolute bottom-3 right-3">
              <button className="px-2 py-1 rounded-sm " onClick={() => setOpenModal(false)}>
                cancel
              </button>
              <button className="px-2 py-1 rounded-sm bg-blue-600" onClick={handleAddProject}>
                + create
              </button>
            </div>
          </Modal>
        </div>

        {Array.isArray(projects) ? (
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
                    <h3 className=" border-black text-white font-semibold w-full ">
                      {project.title}
                    </h3>
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
        ) : (
          <>{projects && <h2>{projects.message}</h2>}</>
        )}
      </section>
    </Layout>
  );
};

export default Projects;

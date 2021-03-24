import React from "react";
import Layout from "../components/layout";
import projects from "../dummyData/projects.json";
const Projects = () => {
  return (
    <Layout>
      <section className="relative ml-72 text-white">
        <h1 className="text-4xl font-bold uppercase ">Projects</h1>
        <p className="mb-5">Items: {projects.length}</p>
        <div className="flex flex-col lg:grid grid-cols-4 gap-3">
          {projects.map((project) => (
            <div
              key={project.projectId}
              className="card-color shadow-xl border rounded h-64 cursor-pointer w-72 relative"
            >
              <h3 className=" border-black text-white font-semibold w-full bg-yellow-400 py-3 px-5">
                {project.projectName}
              </h3>
              <div className="p-5 text-white card-color">
                <p className="font-medium">Client Name:</p>
                <p className="text-gray-500 mb-3">{project.clientName}</p>
                <p>{project.email}</p>
                <p className="font-medium">Phone Number:</p>
                <p className="text-gray-400">{project.phoneNumber}</p>
              </div>
              <button className="absolute right-2 bottom-3 bg-green-600 px-3 text-white">
                -----
              </button>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default Projects;

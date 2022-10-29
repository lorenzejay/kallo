import Link from "next/link";
import { useContext } from "react";
import { DarkModeContext } from "../context/darkModeContext";

type ProjectCardProps = {
  projectId: string;
  title: string;
  headerImg: string;
  isPrivate: boolean;
};

const ProjectCard = ({
  projectId,
  title,
  headerImg,
  isPrivate,
}: ProjectCardProps) => {
  const { isDarkMode } = useContext(DarkModeContext);

  return (
    <Link href={`/projects/${projectId}`} key={projectId}>
      <div
        className={`${
          isDarkMode ? "card-color" : "bg-gray-150"
        } space-y-2 shadow-xl rounded-md h-auto overflow-hidden cursor-pointer w-auto lg:m-0 md:w-72 max-h-[290px] relative p-3 mt-3 hover:transform hover:shadow-2xl transition-all duration-300 ease-in-out`}
      >
        <div className="w-full md:64 md:h-44 overflow-hidden rounded-md">
          <img
            src={headerImg || "sample-card-img.jpg"}
            className="overflow-hidden hover:scale-125 transition-transform ease-in-out duration-300 mb-2 w-full h-full object-cover"
            alt={title}
          />
        </div>
        <h3 className=" border-black  font-semibold w-full ">{title}</h3>
        <div>
          {isPrivate ? (
            <div className="rounded-md bg-red-300 w-20 py-1 text-center">
              private
            </div>
          ) : (
            <div className="rounded-md bg-green-300 w-20 py-1 text-center">
              public
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;

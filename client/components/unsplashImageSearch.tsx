import { FormEvent, useState } from "react";
import { createApi } from "unsplash-js";
import { AiOutlineClose, AiOutlineSearch } from "react-icons/ai";
import { useContext } from "react";
import { DarkModeContext } from "../context/darkModeContext";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../utils/queryClient";
import supabase from "../utils/supabaseClient";

interface UnsplashImageSearchProps {
  setProjectHeader?: (x: string) => void;
  setRevealImageSearch: (x: boolean) => void;
  className: string;
  revealImageSearch: boolean;
  updateHeader?: boolean;
  projectId?: string;
}

const UnsplashImageSearch = ({
  setProjectHeader,
  setRevealImageSearch,
  revealImageSearch,
  className,
  updateHeader,
  projectId,
}: UnsplashImageSearchProps) => {
  const { isDarkMode } = useContext(DarkModeContext);
  // const auth = useAuth();
  // const { userToken } = auth;

  const [keywords, setKeywords] = useState("");
  const [images, setImages] = useState<any[]>([]);
  let unsplash: any;
  if (typeof process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY === "string") {
    unsplash = createApi({
      accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
      // secret: process.env.UNPLASH_SECRET_KEY,
    });
  }

  if (updateHeader) {
  }

  const handleSearchImageFromUnsplash = async (e: FormEvent) => {
    try {
      e.preventDefault();
      const result = await unsplash.search.getPhotos({
        query: keywords,
        orientation: "landscape",
        perPage: 9,
      });

      setImages(result.response.results);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const handleUpdateHeaderImg = async (image: string) => {
    if (!projectId) return;

    const { error } = await supabase
      .from("projects")
      .update({ header_img: image })
      .eq("project_id", projectId);
    if (error) throw new Error(error.message);

    // if (!data)
    //   return window.alert(
    //     "You do not have project privileges to change this file."
    //   );
  };

  const { mutateAsync: updateHeaderImg } = useMutation(handleUpdateHeaderImg, {
    onSuccess: () =>
      queryClient.invalidateQueries([`projectDeets-${projectId}`]),
  });
  return (
    <div
      className={`z-30 shadow-md absolute top-48 w-72 rounded-md p-3 text-white h-auto  ${
        revealImageSearch ? "block" : "hidden"
      } ${isDarkMode ? "card-color" : "bg-white-150"} ${className}`}
    >
      <button
        className="absolute right-2 top-1"
        onClick={() => setRevealImageSearch(false)}
      >
        <AiOutlineClose size={30} />
      </button>
      <h2 className="text-xl w-72">Photo Search</h2>
      <p className="mb-3 text-gray-500">Search for photos from Unsplash</p>
      <form
        className="flex items-center w-auto"
        onSubmit={(e) => handleSearchImageFromUnsplash(e)}
      >
        <input
          className={`bg-gray-150 rounded-md px-4 py-1 w-full mr-3 text-black`}
          type="text"
          placeholder="keywords"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
        />
        <button
          className="bg-blue-500 p-1 rounded-md text-white-175"
          type="submit"
        >
          <AiOutlineSearch size={22} />
        </button>
      </form>
      {images.length > 0 && (
        <section className="grid grid-cols-3 gap-1 mt-3 overflow-x-hidden ">
          {images.map((image, i) => (
            <div className="flex flex-col" key={i}>
              <img
                key={image.id}
                src={image.urls.regular}
                className="w-20 h-20 object-cover cursor-pointer"
                alt={image.altDescription}
                onClick={
                  !updateHeader && setProjectHeader
                    ? () => {
                        setProjectHeader(image.urls.regular);
                        setRevealImageSearch(false);
                      }
                    : () => {
                        updateHeaderImg(image.urls.regular);
                        setRevealImageSearch(false);
                      }
                }
              />
              <p className="text-xs text-gray-400">By: {image.user.username}</p>
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

export default UnsplashImageSearch;

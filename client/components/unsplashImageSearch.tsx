import { useState } from "react";
import {createApi} from "unsplash-js";
import { AiOutlineClose, AiOutlineSearch } from "react-icons/ai";
import { useContext } from "react";
import { DarkModeContext } from "../context/darkModeContext";


interface UnsplashImageSearchProps {
  setProjectHeader: (x:string) => void;
  setRevealImageSearch: (x: boolean) => void;
  className:string;
  revealImageSearch: boolean;
}

const UnsplashImageSearch = ({
  setProjectHeader,
  setRevealImageSearch,
  revealImageSearch,
  className,
}: UnsplashImageSearchProps) => {
  const {isDarkMode} = useContext(DarkModeContext)
  const [keywords, setKeywords] = useState("");
  const [images, setImages] = useState<any[]>([]);
  console.log(process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY)
  let unsplash:any
  if(typeof process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY === 'string'){
     unsplash = createApi({
      accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
      
      // secret: process.env.UNPLASH_SECRET_KEY,
    });
  }

  const handleSearchImageFromUnsplash = async () => {
    try {
      const result = await unsplash.search.getPhotos({
        query: keywords,
        orientation: "landscape",
        perPage:9
      });
       console.log(result);
      
      setImages(result.response.results);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div
      className={`z-30 shadow-md absolute top-48 w-72 rounded-md p-3 text-white h-auto  ${
        revealImageSearch ? "block" : "hidden"
      } ${isDarkMode ? 'card-color' : 'bg-white-150'} ${className}`}
      
    >
      <button className="absolute right-2 top-1" onClick={() => setRevealImageSearch(false)}>
        <AiOutlineClose size={30}  />
      </button>
      <h2 className="text-xl w-72">Photo Search</h2>
      <p className="mb-3 text-gray-500">Search for photos from Unsplash</p>
      <div className="flex items-center w-auto">
        <input
          className="bg-gray-150 rounded-md px-4 py-1 w-full mr-3"
          type="text"
          placeholder="keywords"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
        />
        <button className="bg-blue-500 p-1 rounded-md text-white-175" onClick={handleSearchImageFromUnsplash}>
          <AiOutlineSearch size={22} />
        </button>
      </div>
      {images.length > 0 && (
        <section className="grid grid-cols-3 gap-1 mt-3 overflow-x-hidden ">
          {images.map((image, i) => (
            <div className="flex flex-col" key={i}>
              <img
                key={image.id}
                src={image.urls.regular}
                className="w-20 h-20 object-cover cursor-pointer"
                alt={image.altDescription}
                onClick={() => setProjectHeader(image.urls.regular)}
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

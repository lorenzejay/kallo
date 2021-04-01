import { useState } from "react";
import { createApi } from "unsplash-js";
import { AiOutlineClose, AiOutlineSearch } from "react-icons/ai";
// import {toJ} from 'unsplash-js'

const UnsplashImageSearch = ({
  setProjectHeader,
  projectHeader,
  setRevealImageSearch,
  revealImageSearch,
}) => {
  const [keywords, setKeywords] = useState("");
  const [images, setImages] = useState([]);
  const unsplash = createApi({
    accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
    // secret: process.env.UNPLASH_SECRET_KEY,
  });

  const handleSearchImageFromUnsplash = async () => {
    try {
      const result = await unsplash.search.getPhotos({ query: keywords, orientation: "landscape" });
      setImages(result);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div
      className={`z-10 absolute top-48 w-96 rounded-md p-3 text-white h-auto  ${
        revealImageSearch ? "block" : "hidden"
      }`}
      style={{ background: "#2f3437" }}
    >
      <button className="absolute right-2 top-1" onClick={() => setRevealImageSearch(false)}>
        <AiOutlineClose size={30} className />
      </button>
      <h2 className="text-xl w-72">Photo Search</h2>
      <p className="mb-3 text-gray-300">Search for photos from Unsplash</p>
      <div className="flex items-center ">
        <input
          className="bg-gray-700 rounded-md px-4 py-1 flex-grow"
          type="text"
          placeholder="keywords"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
        />
        <button className="bg-blue-500 rounded-md" onClick={handleSearchImageFromUnsplash}>
          <AiOutlineSearch size={30} />
        </button>
      </div>
      {images.response && (
        <section className="grid grid-cols-4 gap-1 mt-3 overflow-x-hidden ">
          {images.response.results.map((image) => (
            <div className="flex flex-col">
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

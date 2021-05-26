const Loader = ({ isDarkMode }) => {
  return (
    <div
      className={`loader mx-auto flex items-center justify-center ${
        isDarkMode ? "text-white" : "text-black"
      }`}
    ></div>
  );
};

export default Loader;

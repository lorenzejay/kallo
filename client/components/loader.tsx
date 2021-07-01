type LoaderType = {
  isDarkMode?: boolean;
}
const Loader = ({ isDarkMode }: LoaderType) => {
  return (
    <div
      className={`loader mx-auto flex items-center justify-center ${
        isDarkMode ? "text-white" : "text-black"
      }`}
    ></div>
  );
};

export default Loader;

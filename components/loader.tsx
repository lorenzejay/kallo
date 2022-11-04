type LoaderType = {
  isDarkMode?: boolean;
  size?: string;
};
const Loader = ({ isDarkMode, size }: LoaderType) => {
  return (
    <div
      className={`loader mx-auto flex items-center justify-center ${
        isDarkMode ? "text-white" : "text-black"
      } ${size}`}
    ></div>
  );
};

export default Loader;

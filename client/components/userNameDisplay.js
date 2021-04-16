const UsernameDisplay = ({ username, width }) => {
  return (
    <div className={`flex items-center  my-3 ${width}`}>
      <p className="bg-gray-400 rounded-md px-2 py-1 mr-3 w-9 h-9 flex justify-center items-center text-xl font-medium">
        {username.slice(0, 1).toUpperCase()}
      </p>
      <p>{username}</p>
    </div>
  );
};

export default UsernameDisplay;

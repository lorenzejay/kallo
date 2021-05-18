import { useEffect, useRef, useState } from "react";

const useComponentVisible = (initialVisible) => {
  const [isComponentVisible, setIsComponentVisible] = useState(initialVisible);
  const ref = useRef(null);

  const handleClickOutsideModal = (e) => {
    console.log(target);
    if (ref.current === null) return;
    if (!ref.current.contains(e.target)) {
      setIsComponentVisible(false);
    }
  };

  useEffect(() => {
    handleClickOutsideModal();
  });

  return { ref, isComponentVisible, handleClickOutsideModal, setIsComponentVisible };
};

export default useComponentVisible;

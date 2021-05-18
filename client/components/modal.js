import { useRef } from "react";
import { AiOutlineClose } from "react-icons/ai";
import useComponentVisible from "../hooks/useComponentVisible";
const Modal = ({
  modalName,
  children,
  bgColor,
  contentWidth,
  contentHeight,
  openModal,
  setOpenModal,
}) => {
  const ref = useRef();
  const closeModal = (e) => {
    if (ref.current === e.target) {
      setOpenModal(false);
    }
  };
  return (
    <>
      <button onClick={() => setOpenModal(true)} className={`h-7 px-3 py-1 ${bgColor}`}>
        {modalName}
      </button>
      <div
        className={`fixed top-0 left-0 right-0 bottom-0 w-full h-full bg-black z-10 ${
          openModal ? "block" : "hidden"
        } flex `}
        style={{ backgroundColor: "rgba(0,0,0,0.75)" }}
        onClick={closeModal}
      >
        <div className={`modal-content w-full h-full flex items-center justify-center `} ref={ref}>
          <div
            className={`relative w-96 pb-20 m-auto opacity-100 overflow-y-auto p-3 z-10 rounded-md  ${
              contentHeight || "h-3/4"
            }`}
            style={{ backgroundColor: "#3f4447", width: contentWidth }}
          >
            <button
              className="absolute right-1 top-1 outline-none"
              onClick={() => setOpenModal(false)}
            >
              <AiOutlineClose size={26} className="outline-none" />
            </button>
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;

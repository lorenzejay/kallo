import { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
const Modal = ({ modalName, children, bgColor, openModal, setOpenModal }) => {
  return (
    <>
      <button onClick={() => setOpenModal(true)} className={`h-7 px-3 p-1 ${bgColor}`}>
        {modalName}
      </button>
      <div
        className={`fixed top-0 left-0 right-0 bottom-0 w-full h-full bg-black overflow-auto z-10 ${
          openModal ? "block" : "hidden"
        } flex `}
        style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
      >
        <div className="modal-content w-full h-3/4 flex items-center justify-center ">
          <div
            className="relative w-96 h-auto pb-20 m-auto opacity-100 p-3 z-10 rounded-md"
            style={{ backgroundColor: "#3f4447" }}
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

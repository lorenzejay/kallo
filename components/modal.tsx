import { useContext } from "react";
import { ReactElement } from "react";
import { useRef } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { DarkModeContext } from "../context/darkModeContext";
type ModalProps = {
  modalName: string | ReactElement;
  children: React.ReactChild;
  bgColor?: string;
  contentWidth?: string;
  contentHeight?: string;
  openModal: boolean;
  setOpenModal: (x: boolean) => void;
};
const Modal = ({
  modalName,
  children,
  bgColor,
  contentWidth,
  contentHeight,
  openModal,
  setOpenModal,
}: ModalProps) => {
  const { isDarkMode } = useContext(DarkModeContext);
  const ref = useRef<HTMLDivElement>(null);

  const closeModal = (e: any) => {
    if (ref.current === e.target) {
      setOpenModal(false);
    }
  };
  return (
    <>
      <button
        onClick={() => setOpenModal(true)}
        className={`block h-7 px-3 ${bgColor} rounded-sm`}
      >
        {modalName}
      </button>
      <div
        className={`fixed top-0 left-0 right-0 bottom-0 w-full h-full bg-black z-20 ${
          openModal ? "block" : "hidden"
        } flex `}
        style={{ backgroundColor: "rgba(0,0,0,0.75)" }}
        onClick={closeModal}
      >
        <div
          className={`w-full h-full flex items-center justify-center `}
          ref={ref}
        >
          <div
            className={`relative pb-20  m-auto opacity-100 overflow-y-auto p-3 z-20 rounded-md  ${
              contentHeight || "h-3/4"
            } ${contentWidth || "md:w-3/4"} min-w-1/2 ${
              isDarkMode ? "darkBody" : "bg-white-175"
            } `}
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

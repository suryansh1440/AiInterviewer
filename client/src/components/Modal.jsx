import { useRef } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import styles from "../modules/Modal.module.css";
import { clsx } from "clsx";

const Modal = () => {
  const wrapperRef = useRef(null);


  const wrapperRotationRight = () => {
    wrapperRef.current.style.transform = "rotateY(180deg)";
  };
  const wrapperRotationLeft = () => {
    wrapperRef.current.style.transform = "rotateY(0deg)";
  };

  return(
    <div className={clsx(styles.modalBox, "bg-base-200 dark:bg-base-300")}>
      <div className={clsx(styles.formWrapper, "bg-base-100 dark:bg-base-200") } ref={wrapperRef}>
        <LoginForm handleRotation={wrapperRotationRight} />
        <SignupForm handleRotation={wrapperRotationLeft} />
      </div>
    </div>
  );
};

export default Modal;

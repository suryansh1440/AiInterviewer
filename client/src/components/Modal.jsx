import { useRef } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import styles from "../modules/Modal.module.css";

const Modal = () => {
  const wrapperRef = useRef(null);


  const wrapperRotationRight = () => {
    wrapperRef.current.style.transform = "rotateY(180deg)";
  };
  const wrapperRotationLeft = () => {
    wrapperRef.current.style.transform = "rotateY(0deg)";
  };

  return(
    <div className={styles.modalBox}>
      <div className={styles.formWrapper} ref={wrapperRef}>
        <LoginForm handleRotation={wrapperRotationRight} />
        <SignupForm handleRotation={wrapperRotationLeft} />
      </div>
    </div>
  );
};

export default Modal;

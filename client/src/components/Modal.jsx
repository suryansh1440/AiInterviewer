import { createPortal } from "react-dom";
import { forwardRef, useRef } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import styles from "../modules/Modal.module.css";
const Modal = forwardRef((props, ref) => {
  const wrapperRef = useRef(null);

  const wrapperRotationRight = () => {
    wrapperRef.current.style.transform = "rotateY(180deg)";
  };
  const wrapperRotationLeft = () => {
    wrapperRef.current.style.transform = "rotateY(0deg)";
  };

  return createPortal(
    <dialog className={styles.modalBox} ref={ref}>
      <div className={styles.formWrapper} ref={wrapperRef}>
        <LoginForm handleRotation={wrapperRotationRight} />
        <SignupForm handleRotation={wrapperRotationLeft} />
      </div>
    </dialog>,
    document.getElementById("modal-window")
  );
});

export default Modal;

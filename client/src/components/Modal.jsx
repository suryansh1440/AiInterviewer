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

  const handleClose = () => {
    if (ref && ref.current) {
      ref.current.close();
    }
  };

  return createPortal(
    <dialog className={styles.modalBox} ref={ref}>
      <div className={styles.formWrapper} ref={wrapperRef}>
        <LoginForm handleRotation={wrapperRotationRight} onClose={handleClose} />
        <SignupForm handleRotation={wrapperRotationLeft} onClose={handleClose} />
      </div>
    </dialog>,
    document.getElementById("modal-window")
  );
});

export default Modal;

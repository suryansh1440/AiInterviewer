import styles from "../modules/SignupForm.module.css";
import { useModalStore } from "../store/useModalStore";
import { clsx } from "clsx";

export default function SignupForm({ handleRotation, onClose }) {
  const { setCloseModal } = useModalStore();

  const handleSignup = (e) => {
    e.preventDefault();
    // signup logic here
    setCloseModal();
  };

  return (
    <form className={clsx(styles.container, "bg-base-100 dark:bg-base-200")} onSubmit={handleSignup}>
      <h2 className="col-span-2 row-start-2 row-end-3 justify-self-center text-3xl mb-4 self-start text-base-content">
        Create New Account
      </h2>
      <div className="signup-body col-span-2 row-start-3 row-end-4 grid gap-4">
        <input
          type="text"
          placeholder="Full Name"
          className="input input-bordered w-full"
        />
        <input
          type="email"
          placeholder="Email"
          className="input input-bordered w-full"
        />
        <input
          type="password"
          placeholder="Password"
          className="input input-bordered w-full"
        />
        <button type="submit" className="btn btn-primary">
          Sign Up
        </button>
      </div>
      <p className="col-span-2 row-start-4 row-end-5 flex flex-col items-center self-end text-base-content">
        Account already exists?{" "}
        <button
          type="button"
          onClick={handleRotation}
          className="text-sm underline text-primary"
        >
          Login here
        </button>
      </p>
      <button type="button" onClick={setCloseModal} className="col-start-2 col-end-3 row-start-1 row-end-2 justify-self-end text-base text-base-content">
        &#10005;
      </button>
    </form>
  );
}

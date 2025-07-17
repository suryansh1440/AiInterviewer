import styles from "../modules/LoginForm.module.css";
import clsx from "clsx";
import { useModalStore } from "../store/useModalStore";

export default function LoginForm({ handleRotation }) {
  const { setCloseModal } = useModalStore();
  const handleLogin = (e) => {
    e.preventDefault();
    // login logic 
    setCloseModal();
  };

  return (
    <form className={clsx(styles.container, "bg-base-100 dark:bg-base-200")} onSubmit={handleLogin}>
      <h2 className="col-span-2 row-start-2 row-end-3 justify-self-center text-3xl mb-4 self-start text-primary">
        Welcome to{" "}
        <span
          className={clsx(
            styles.highlight,
            "bg-primary text-primary-content px-2",
            "dark:bg-primary dark:text-primary-content"
          )}
        >
          AI Interview
        </span>
      </h2>
      <div className="login-body col-span-2 row-start-3 row-end-4 grid gap-4">
        <input
          type="text"
          placeholder="Username"
          className="input input-bordered w-full"
        />
        <input
          type="password"
          placeholder="Password"
          className="input input-bordered w-full"
        />
        <label className="flex items-center text-base-content">
          <input
            type="checkbox"
            className="checkbox checkbox-primary mr-2"
          />
          Remember Me
        </label>
        <button type="submit" className="btn btn-primary w-full">
          Login
        </button>
      </div>
      <p className="col-span-2 row-start-4 row-end-5 flex flex-col items-center self-end text-base-content ">
        Don't have an account?{" "}
        <button
          type="button"
          onClick={handleRotation}
          className="text-sm underline text-primary"
        >
          Create Account
        </button>
      </p>
      <button type="button" onClick={setCloseModal} className="col-start-2 col-end-3 row-start-1 row-end-2 justify-self-end text-base text-base-content">
        &#10005;
      </button>
    </form>
  );
}

import styles from "../modules/LoginForm.module.css";
import clsx from "clsx";
import { useModalStore } from "../store/useModalStore";
import { useAuthStore } from "../store/useAuthStore";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function LoginForm({ handleRotation }) {
  const { setCloseModal } = useModalStore();
  const { login, isLoggingIn } = useAuthStore();
  const [data, setData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!data.email || !data.password) {
      return;
    }
    await login(data);
    setCloseModal();
  };

  return (
    <form className={clsx(styles.container, "bg-base-100 text-base-content")} onSubmit={handleLogin}>
      <h2 className="col-span-2 row-start-2 row-end-3 justify-self-center text-3xl mb-4 self-start">
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
          type="email"
          placeholder="Email"
          className="input input-bordered w-full"
          value={data.email}
          onChange={e => setData({ ...data, email: e.target.value })}
          autoComplete="email"
        />
        <div className="relative w-full">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="input input-bordered w-full pr-10"
            value={data.password}
            onChange={e => setData({ ...data, password: e.target.value })}
            autoComplete="current-password"
          />
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-base-content/60 hover:text-primary"
            tabIndex={-1}
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        <label className="flex items-center">
          <input
            type="checkbox"
            className="checkbox mr-2"
          />
          Remember Me
        </label>
        <button type="submit" className="btn btn-primary w-full" disabled={isLoggingIn}>
          {isLoggingIn ? "Logging in..." : "Login"}
        </button>
      </div>
      <p className="col-span-2 row-start-4 row-end-5 flex flex-col items-center self-end text-base-content">
        Don't have an account?{" "}
        <button
          type="button"
          onClick={handleRotation}
          className="btn btn-link text-sm p-0 min-h-0 h-auto"
        >
          Create Account
        </button>
      </p>
      <button type="button" onClick={setCloseModal} className="col-start-2 col-end-3 row-start-1 row-end-2 justify-self-end text-base">
        &#10005;
      </button>
    </form>
  );
}

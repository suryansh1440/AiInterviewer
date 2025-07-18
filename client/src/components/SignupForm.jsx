import styles from "../modules/SignupForm.module.css";
import { useModalStore } from "../store/useModalStore";
import { clsx } from "clsx";
import { useAuthStore } from "../store/useAuthStore";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function SignupForm({ handleRotation, onClose }) {
  const { setCloseModal } = useModalStore();
  const { signup, isSigningUp } = useAuthStore();
  const [data, setData] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!data.name || !data.email || !data.password) {
      return;
    }
    await signup(data);
    setCloseModal();
  };

  return (
    <form className={clsx(styles.container, "bg-base-100 text-base-content")} onSubmit={handleSignup}>
      <h2 className="col-span-2 row-start-2 row-end-3 justify-self-center text-3xl mb-4 self-start">
        <span
          className={
            "bg-primary text-primary-content px-2 rounded dark:bg-primary dark:text-primary-content"
          }
        >
        Create New Account
        </span>
      </h2>
      <div className="signup-body col-span-2 row-start-3 row-end-4 grid gap-4">
        <input
          type="text"
          placeholder="Full Name"
          className="input input-bordered w-full"
          value={data.name}
          onChange={e => setData({ ...data, name: e.target.value })}
          autoComplete="name"
        />
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
            autoComplete="new-password"
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
        <button type="submit" className="btn btn-primary w-full" disabled={isSigningUp}>
          {isSigningUp ? "Signing up..." : "Sign Up"}
        </button>
      </div>
      <p className="col-span-2 row-start-4 row-end-5 flex flex-col items-center self-end text-base-content">
        Account already exists?{" "}
        <button
          type="button"
          onClick={handleRotation}
          className="btn btn-link text-sm p-0 min-h-0 h-auto"
        >
          Login
        </button>
      </p>
      <button type="button" onClick={setCloseModal} className="col-start-2 col-end-3 row-start-1 row-end-2 justify-self-end text-base">
        &#10005;
      </button>
    </form>
  );
}

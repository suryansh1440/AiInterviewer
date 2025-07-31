import styles from "../modules/SignupForm.module.css";
import { useModalStore } from "../store/useModalStore";
import { clsx } from "clsx";
import { useAuthStore } from "../store/useAuthStore";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { GoogleLogin } from '@react-oauth/google';
import toast from "react-hot-toast";

export default function SignupForm({ handleRotation, onClose }) {
  const { setCloseModal } = useModalStore();
  const { signup, isSigningUp, googleLogin } = useAuthStore();
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
        <div className="flex items-center my-2">
          <div className="flex-grow border-t border-base-200"></div>
          <span className="mx-2 text-base-content/60">or</span>
          <div className="flex-grow border-t border-base-200"></div>
        </div>
        <div className="flex gap-2 w-full">
          <div className="w-1/2 flex justify-center">
            <GoogleLogin
              onSuccess={async credentialResponse => {
                if (credentialResponse.credential) {
                  await googleLogin(credentialResponse.credential);
                  setCloseModal();
                }
              }}
              onError={() => {
                toast.error('Google signup failed');
              }}
              width="100%"
            />
          </div>
          <button
            type="button"
            className="btn btn-neutral w-1/2 flex items-center justify-center gap-2"
            onClick={() => window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/auth/github`}
          >
            <svg height="20" width="20" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.65 7.65 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>
            Sign up with GitHub
          </button>
        </div>
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

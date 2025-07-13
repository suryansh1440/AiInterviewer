import styles from "../modules/LoginForm.module.css";
import clsx from "clsx";
export default function LoginForm({ handleRotation }) {
  return (
    <form method="dialog" className={styles.container}>
      <h2 className="col-span-2 row-start-2 row-end-3 justify-self-center text-3xl mb-4 self-start !text-black">
        Welcome to{" "}
        <span className={clsx(styles.highlight, "text-white relative px-2")}>
          AI Interview
        </span>
      </h2>
      <div className="login-body col-span-2 row-start-3 row-end-4 grid gap-4">
        <input
          type="text"
          placeholder="Username"
          className="border border-gray-300 p-2 px-4 rounded  placeholder-gray-400"
        />
        <input
          type="password"
          placeholder="Password"
          className="border border-gray-300 p-2 px-4 rounded placeholder-gray-400"
        />
        <label className="flex items-center text-black">
          <input
            type="checkbox"
            className="appearance-none w-4 h-4 border border-gray-400 bg-white mr-2 peer checked:bg-blue-600 checked:border-transparent
"
          />
          <span class="absolute w-4 h-4 pointer-events-none peer-checked:block">
            <svg
              class="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              stroke-width="3"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </span>
          Remember Me
        </label>
        <button className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Login
        </button>
      </div>
      <p className="col-span-2 row-start-4 row-end-5 flex flex-col items-center self-end text-gray-500 ">
        Don't have an account?{" "}
        <button
          type="button"
          onClick={handleRotation}
          className="text-sm underline text-blue-500"
        >
          Create Account
        </button>
      </p>
      <button className="col-start-2 col-end-3 row-start-1 row-end-2 justify-self-end text-base text-black">
        &#10005;
      </button>
    </form>
  );
}

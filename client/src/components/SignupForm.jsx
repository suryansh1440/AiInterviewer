import styles from "../modules/SignupForm.module.css";

export default function SignupForm({ handleRotation, onClose }) {
  const handleSignup = (e) => {
    e.preventDefault();
    // signup logic here
  };
  return (
    <form className={styles.container}>
      <h2 className="col-span-2 row-start-2 row-end-3 justify-self-center text-3xl mb-4 self-start text-black">
        Create New Account
      </h2>
      <div className="signup-body col-span-2 row-start-3 row-end-4 grid gap-4">
        <input
          type="text"
          placeholder="Full Name"
          className="border border-gray-300 p-2 px-4  placeholder-gray-400 rounded"
        />
        <input
          type="email"
          placeholder="Email"
          className="border border-gray-300 p-2 px-4  placeholder-gray-400 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          className="border border-gray-300 p-2 px-4  placeholder-gray-400 rounded"
        />
        <button onClick={handleSignup} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Sign Up
        </button>
      </div>
      <p className="col-span-2 row-start-4 row-end-5 flex flex-col items-center self-end text-gray-500">
        Account already exists?{" "}
        <button
          type="button"
          onClick={handleRotation}
          className="text-sm underline text-blue-500"
        >
          Login
        </button>
      </p>
      <button type="button" onClick={onClose} className="col-start-2 col-end-3 row-start-1 row-end-2 justify-self-end text-base text-black">
        &#10005;
      </button>
    </form>
  );
}

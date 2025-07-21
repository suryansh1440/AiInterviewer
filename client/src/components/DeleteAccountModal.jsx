import { useState, useEffect } from "react";
import { X, Lock } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";

export default function DeleteAccountModal({ open, onClose }) {
  const { deleteAccount, isDeletingAccount, user } = useAuthStore();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && open) {
      onClose();
    }
    // eslint-disable-next-line
  }, [user]);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user?.authProvider === 'local') {
      if (!password){
        toast.error("Enter the password")
        return;
      }
      await deleteAccount({password:password});
    } else {
      await deleteAccount({});
    }
    navigate("/");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300" onClick={onClose} />
      {/* Modal */}
      <div className="relative bg-base-100 rounded-3xl shadow-2xl p-10 w-full max-w-md flex flex-col items-center border border-error/20 z-10 animate-fade-in">
        <button
          className="absolute top-4 right-4 text-2xl text-base-content/60 hover:text-error bg-base-200 rounded-full p-2 shadow-md transition"
          onClick={onClose}
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-3xl font-bold mb-4 text-error text-center tracking-tight">Delete Account</h2>
        <div className="mb-6 text-base-content/80 text-center">
          <p className="mb-2 font-semibold">Are you sure you want to delete your account?</p>
          <p className="mb-2">This action is <span className="text-error font-bold">irreversible</span>. All your data, interviews, and progress will be permanently deleted.</p>
          {user?.authProvider === 'local' ? (
            <p className="mb-2">To confirm, please enter your password below.</p>
          ) : (
            <p className="mb-2">Click delete to confirm. No password required for Google/GitHub users.</p>
          )}
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full max-w-sm">
          {user?.authProvider === 'local' && (
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="input input-bordered w-full pr-12 text-lg"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/60 hover:text-error"
                tabIndex={-1}
                onClick={() => setShowPassword(v => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <Lock className="w-6 h-6" />
              </button>
            </div>
          )}
          <button type="submit" className="btn btn-error w-full text-lg py-3 mt-2 shadow-lg" disabled={isDeletingAccount}>
            {isDeletingAccount ? "Deleting..." : "Delete Account"}
          </button>
        </form>
      </div>
    </div>
  );
} 
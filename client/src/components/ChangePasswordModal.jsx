import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Eye, EyeOff, X } from "lucide-react";
import toast from "react-hot-toast";

export default function ChangePasswordModal({ open, onClose }) {
  const { changePassword, isChangePassword } = useAuthStore();
  const [data, setData] = useState({ oldPassword: "", newPassword: "", rePassword: "" });
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showRe, setShowRe] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!data.oldPassword || !data.newPassword || !data.rePassword) return;
    if (data.newPassword !== data.rePassword) {
      toast.error("New passwords do not match");
      return;
    }
    await changePassword({ oldPassword: data.oldPassword, newPassword: data.newPassword });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300" onClick={onClose} />
      {/* Modal */}
      <div className="relative bg-base-100 rounded-3xl shadow-2xl p-10 w-full max-w-lg flex flex-col items-center border border-primary/20 z-10 animate-fade-in">
        <button
          className="absolute top-4 right-4 text-2xl text-base-content/60 hover:text-error bg-base-200 rounded-full p-2 shadow-md transition"
          onClick={onClose}
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-3xl font-bold mb-8 text-primary text-center tracking-tight">Change Password</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full max-w-md">
          <div className="relative">
            <input
              type={showOld ? "text" : "password"}
              placeholder="Old Password"
              className="input input-bordered w-full pr-12 text-lg"
              value={data.oldPassword}
              onChange={e => setData({ ...data, oldPassword: e.target.value })}
              autoComplete="current-password"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/60 hover:text-primary"
              tabIndex={-1}
              onClick={() => setShowOld(v => !v)}
              aria-label={showOld ? "Hide password" : "Show password"}
            >
              {showOld ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
            </button>
          </div>
          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              placeholder="New Password"
              className="input input-bordered w-full pr-12 text-lg"
              value={data.newPassword}
              onChange={e => setData({ ...data, newPassword: e.target.value })}
              autoComplete="new-password"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/60 hover:text-primary"
              tabIndex={-1}
              onClick={() => setShowNew(v => !v)}
              aria-label={showNew ? "Hide password" : "Show password"}
            >
              {showNew ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
            </button>
          </div>
          <div className="relative">
            <input
              type={showRe ? "text" : "password"}
              placeholder="Re-enter New Password"
              className="input input-bordered w-full pr-12 text-lg"
              value={data.rePassword}
              onChange={e => setData({ ...data, rePassword: e.target.value })}
              autoComplete="new-password"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/60 hover:text-primary"
              tabIndex={-1}
              onClick={() => setShowRe(v => !v)}
              aria-label={showRe ? "Hide password" : "Show password"}
            >
              {showRe ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
            </button>
          </div>
          <button type="submit" className="btn btn-primary w-full text-lg py-3 mt-2 shadow-lg" disabled={isChangePassword}>
            {isChangePassword ? "Changing..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
} 
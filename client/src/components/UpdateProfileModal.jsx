import { useState, useRef } from "react";
import { X, User, Phone, Image as ImageIcon } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

export default function UpdateProfileModal({ open, onClose }) {
  const { user, updateProfile, isUpdatingProfile } = useAuthStore();
  const [data, setData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    profilePic: user?.profilePic || "",
  });
  const [preview, setPreview] = useState(user?.profilePic || "");
  const [file, setFile] = useState(null);
  const fileInputRef = useRef();

  if (!open) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => setPreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    setData((d) => ({ ...d, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let profilePicToSend = data.profilePic;
    if (file) {
      profilePicToSend = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (ev) => resolve(ev.target.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }
    await updateProfile({
      name: data.name,
      phone: data.phone,
      profilePic: profilePicToSend,
    });
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
        <h2 className="text-3xl font-bold mb-8 text-primary text-center tracking-tight">Update Profile</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full max-w-md">
          <div className="flex flex-col items-center gap-2">
            <div className="relative w-28 h-28 mb-2">
              <img
                src={preview || "/avatar.png"}
                alt="Profile Preview"
                className="w-28 h-28 rounded-full object-cover border-4 border-primary shadow"
              />
              <button
                type="button"
                className="absolute bottom-1 right-1 bg-primary text-primary-content rounded-full p-2 shadow hover:bg-primary-focus"
                onClick={() => fileInputRef.current.click()}
                aria-label="Upload profile picture"
              >
                <ImageIcon className="w-5 h-5" />
              </button>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </div>
          </div>
          {/* Email (read-only) */}
          <div className="relative">
            <input
              type="email"
              value={user?.email || ""}
              className="input input-bordered w-full text-lg pl-10 bg-base-200 cursor-not-allowed"
              disabled
              readOnly
              autoComplete="email"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/60">@</span>
          </div>
          <div className="relative">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              className="input input-bordered w-full text-lg pl-10"
              value={data.name}
              onChange={handleChange}
              autoComplete="name"
            />
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/60" />
          </div>
          <div className="relative">
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              className="input input-bordered w-full text-lg pl-10"
              value={data.phone}
              onChange={handleChange}
              autoComplete="tel"
            />
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/60" />
          </div>
          <button type="submit" className="btn btn-primary w-full text-lg py-3 mt-2 shadow-lg" disabled={isUpdatingProfile}>
            {isUpdatingProfile ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
} 
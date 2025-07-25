import { useState, useRef } from "react";
import { X, User, Phone, Image as ImageIcon, FileText } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";

export default function UpdateProfileModal({ open, onClose }) {
  const { user, updateProfile, isUpdatingProfile } = useAuthStore();
  const [data, setData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    profilePic: user?.profilePic || "",
    resume: user?.resume || "",
    leetcodeUsername: user?.leetcodeUsername || "",
  });
  const [preview, setPreview] = useState(user?.profilePic || "");
  const [file, setFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const fileInputRef = useRef();
  const resumeInputRef = useRef();

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

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== "application/pdf") {
        toast.error("Please upload a PDF file only.");
        return;
      }
      setResumeFile(file);
      setData((d) => ({ ...d, resume: file.name }));
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
    let resumeToSend = data.resume;
    if (resumeFile) {
      resumeToSend = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (ev) => resolve(ev.target.result);
        reader.onerror = reject;
        reader.readAsDataURL(resumeFile);
      });
    }
    // Extract LeetCode username if a URL is entered
    let leetcodeUsername = data.leetcodeUsername.trim();
    // Accept both username and profile URL
    const urlMatch = leetcodeUsername.match(/leetcode\.com\/(u|profile)\/(\w[\w\-_]*)/i) || leetcodeUsername.match(/leetcode\.com\/(\w[\w\-_]*)/i);
    if (urlMatch) {
      leetcodeUsername = urlMatch[2] || urlMatch[1];
    }
    await updateProfile({
      name: data.name,
      phone: data.phone,
      profilePic: profilePicToSend,
      resume: resumeToSend,
      leetcodeUsername,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300" onClick={onClose} />
      {/* Modal */}
      <div className="relative bg-base-100 rounded-2xl shadow-xl p-6 w-full max-w-md flex flex-col items-center border border-primary/20 z-10 animate-fade-in">
        <button
          className="absolute top-4 right-4 text-2xl text-base-content/60 hover:text-error bg-base-200 rounded-full p-2 shadow-md transition"
          onClick={onClose}
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold mb-4 text-primary text-center tracking-tight">Update Profile</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md">
          <div className="flex flex-col items-center gap-2">
            <div className="relative w-20 h-20 mb-2">
              <img
                src={preview || "/avatar.png"}
                alt="Profile Preview"
                className="w-20 h-20 rounded-full object-cover border-2 border-primary shadow"
              />
              <button
                type="button"
                className="absolute bottom-1 right-1 bg-primary text-primary-content rounded-full p-2 shadow hover:bg-primary-focus"
                onClick={() => fileInputRef.current.click()}
                aria-label="Upload profile picture"
              >
                <ImageIcon className="w-4 h-4" />
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
          {/* LeetCode username */}
          <div className="relative">
            <input
              type="text"
              name="leetcodeUsername"
              placeholder="LeetCode Username (optional)"
              className="input input-bordered w-full text-lg pl-10"
              value={data.leetcodeUsername}
              onChange={handleChange}
              autoComplete="off"
            />
            <img src="https://leetcode.com/static/images/LeetCode_logo_rvs.png" alt="LeetCode" className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 object-contain opacity-80" />
          </div>
          {/* Resume upload */}
          <div className="relative flex flex-col gap-2 bg-base-200 rounded-xl p-4 border border-base-300 shadow mb-2">
            <label className="font-semibold text-base-content mb-1 flex items-center gap-2">
              <FileText className="w-5 h-5" /> Resume
            </label>
            {data.resume && (
              <div className="mb-1 text-sm text-base-content/70 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                {data.resume.startsWith('http') ? (
                  <a href={data.resume} target="_blank" rel="noopener noreferrer" className="underline text-primary">View Current Resume</a>
                ) : (
                  <span>{data.resume}</span>
                )}
              </div>
            )}
            <div
              className="flex flex-col items-center justify-center border-2 border-dashed border-primary/40 rounded-lg p-4 cursor-pointer hover:bg-primary/10 transition"
              onClick={() => resumeInputRef.current.click()}
              style={{ minHeight: 80 }}
            >
              <FileText className="w-8 h-8 text-primary mb-2" />
              <span className="text-base-content/70 text-sm">Drag & drop or click to upload PDF Only</span>
            </div>
            <input
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              ref={resumeInputRef}
              onChange={handleResumeChange}
            />
          </div>
          <button type="submit" className="btn btn-primary w-full text-lg py-3 mt-2 shadow-lg" disabled={isUpdatingProfile}>
            {isUpdatingProfile ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
} 
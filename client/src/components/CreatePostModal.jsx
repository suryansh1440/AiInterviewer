import { useState, useRef } from "react";
import { X, Image as ImageIcon } from "lucide-react";
import { usePostStore } from '../store/usePostStore';

const categories = [
  { id: 'tech', label: 'Tech & Programming' },
  { id: 'upsc', label: 'UPSC & Government' },
  { id: 'business', label: 'Business & Finance' },
  { id: 'engineering', label: 'Engineering' },
  { id: 'medical', label: 'Medical & Healthcare' },
  { id: 'law', label: 'Law & Legal' },
  { id: 'data', label: 'Data Science & AI' },
  { id: 'marketing', label: 'Marketing & Sales' },
];

export default function CreatePostModal({ open, onClose }) {
  const [caption, setCaption] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const fileInputRef = useRef();
  const { createPost, isCreatingPost } = usePostStore();

  if (!open) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = (ev) => setPreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleCategoryClick = (catId) => {
    if (selectedCategories.includes(catId)) return;
    if (selectedCategories.length >= 5) return;
    setSelectedCategories([...selectedCategories, catId]);
  };

  const handleDeselectCategory = (catId) => {
    setSelectedCategories(selectedCategories.filter(id => id !== catId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!caption.trim()) return;
    let imageData = preview || "";
    await createPost({
      caption,
      image: imageData,
      categories: selectedCategories,
    });
    setCaption("");
    setSelectedCategories([]);
    setImage(null);
    setPreview("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-2 sm:px-0">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300" onClick={onClose} />
      {/* Modal */}
      <div
        className="relative bg-base-100/80 backdrop-blur-xl rounded-3xl shadow-2xl p-4 sm:p-8 md:p-12 w-full max-w-md flex flex-col items-center border border-primary/20 z-10 animate-fade-in min-h-[260px] sm:min-h-[320px] md:min-h-[480px]"
        style={{ boxShadow: '0 8px 32px 0 rgba(31,38,135,0.15)' }}
      >
        <button
          className="absolute top-4 right-4 text-2xl text-base-content/60 hover:text-error bg-base-200 rounded-full p-2 shadow-md transition"
          onClick={onClose}
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold mb-4 text-primary text-center tracking-tight drop-shadow-lg">Create Post</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full max-w-md text-base">
          <textarea
            className="textarea textarea-bordered w-full min-h-[100px] text-base font-medium rounded-xl bg-base-200/80 focus:bg-base-100 focus:border-primary focus:ring-2 focus:ring-primary/20 transition placeholder:text-base-content/40"
            placeholder="What's on your mind? Write a caption..."
            value={caption}
            onChange={e => setCaption(e.target.value)}
            maxLength={500}
            required
            style={{ resize: 'none' }}
          />
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-primary-content hover:from-primary-focus hover:to-secondary-focus transition font-semibold shadow-md text-base"
              onClick={() => fileInputRef.current.click()}
              aria-label="Upload image"
            >
              <ImageIcon className="w-5 h-5" />
              <span className="text-sm font-medium">Image</span>
            </button>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageChange}
            />
            {preview && (
              <div className="relative group">
                <img src={preview} alt="Preview" className="w-20 h-20 object-cover rounded-2xl border-2 border-primary shadow-lg" />
                <button
                  type="button"
                  className="absolute -top-2 -right-2 bg-error text-error-content rounded-full p-1 shadow-md hover:bg-error/80 transition"
                  onClick={() => { setImage(null); setPreview(""); }}
                  aria-label="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
          {/* Modern category selection buttons */}
          <div className="flex flex-wrap gap-2 justify-center mt-2">
            {categories.map(cat => (
              selectedCategories.includes(cat.id) ? (
                <button
                  type="button"
                  key={cat.id}
                  className="flex items-center gap-1 px-4 py-2 rounded-full bg-primary text-primary-content font-semibold shadow hover:bg-primary-focus transition relative group text-sm"
                  onClick={() => handleDeselectCategory(cat.id)}
                >
                  <span>{cat.label}</span>
                  <span className="ml-1 bg-primary-content/20 rounded-full p-0.5 group-hover:bg-error group-hover:text-error-content transition">
                    <X className="w-4 h-4" />
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  key={cat.id}
                  className={`px-4 py-2 rounded-full bg-base-200/80 text-primary font-semibold border border-primary/30 shadow hover:bg-primary/10 transition text-sm ${selectedCategories.length >= 5 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => handleCategoryClick(cat.id)}
                  disabled={selectedCategories.length >= 5}
                >
                  {cat.label}
                </button>
              )
            ))}
          </div>
          <div className="flex gap-3 mt-4">
            <button type="button" className="btn btn-outline btn-error flex-1 font-semibold text-base" onClick={onClose} disabled={isCreatingPost}>Cancel</button>
            <button type="submit" className="btn btn-primary flex-1 font-semibold text-base shadow-lg hover:scale-105 transition-transform" disabled={!caption.trim() || isCreatingPost || selectedCategories.length === 0}>
              {isCreatingPost ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 
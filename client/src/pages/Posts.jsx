import React, { useEffect, useState, useRef } from 'react';
import { usePostStore } from '../store/usePostStore';
import { MessageCircle, ThumbsUp, MoreVertical, Trash2 } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const Posts = () => {
  const [openComments, setOpenComments] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null); // Track which post's menu is open
  const [commentInputs, setCommentInputs] = useState({}); // { [postId]: string }
  const { posts, isGettingPosts, getPosts, deletePost, isDeletingPost, subscribeToPost, unsubscribeFromPost ,emptyPostBuffer, postBuffer ,addUpvote, isAddingUpvote, addComment, isAddingComment} = usePostStore();
  const { user } = useAuthStore();
  const postsContainerRef = useRef(null);

  useEffect(() => {
    getPosts();
    subscribeToPost();
    return () => {
      unsubscribeFromPost();
      emptyPostBuffer();
    }
  }, [user, getPosts, subscribeToPost, unsubscribeFromPost,]);


  const handleMenuToggle = (postId) => {
    setMenuOpen(menuOpen === postId ? null : postId);
  };

  const handleDelete = async (postId) => {
    await deletePost(postId);
    setMenuOpen(null);
  };

  const handleLoadLatest = () => {
    if (postBuffer.length > 0) {
      emptyPostBuffer();
      if (postsContainerRef.current) {
        postsContainerRef.current.scrollTop = 0;
      }
    }
  };


  return (
    <div
      ref={postsContainerRef}
      className="w-full max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto flex-1 bg-base-200 rounded-2xl shadow-lg overflow-y-auto scrollbar-hide max-h-[90vh] p-4 md:p-8 pb-24 md:pb-8 relative"
      style={{ minHeight: 'calc(100vh - 64px)', height: '100%' }}
    >
      {postBuffer.length > 0 && (
        <div className="sticky top-[-5vh] left-0 w-full flex justify-center z-40" style={{ pointerEvents: 'none' }}>
          <button
            className="px-8 py-3 rounded-xl font-semibold shadow-lg transition bg-gradient-to-b from-primary/80 via-primary/50 to-primary/20 text-primary-content backdrop-blur-md border border-primary/30 text-lg mt-2"
            style={{
              opacity: 0.85,
              background: 'linear-gradient(to bottom, rgba(59,130,246,0.7) 0%, rgba(59,130,246,0.5) 60%, rgba(59,130,246,0.2) 100%)',
              pointerEvents: 'auto',
            }}
            onClick={handleLoadLatest}
          >
            Load latest posts
          </button>
        </div>
      )}
      {isGettingPosts ? (
        <div className="flex items-center justify-center h-96">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-96 text-base-content/70">
          <span className="text-2xl font-semibold mb-2">No posts yet</span>
          <span>Be the first to create a post!</span>
        </div>
      ) : (
        posts.map((post) => (
          <div
            key={post._id}
            className="mb-10 last:mb-0 bg-base-100/80 backdrop-blur-lg rounded-3xl p-6 md:p-8 shadow-xl border border-base-300 hover:shadow-2xl transition-all duration-200 relative group overflow-hidden"
            style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)' }}
          >
            {/* Glassmorphism gradient overlay */}
            <div className="absolute inset-0 rounded-3xl pointer-events-none group-hover:bg-primary/5 transition-all duration-300" />
            <div className="flex items-center gap-3 mb-3 relative">
              <img src={post.profilePic || "/avatar.png"} alt={post.name} className="w-10 h-10 rounded-full border-2 border-primary object-cover shadow" />
              <div className="flex flex-col">
                <span className="font-semibold text-base-content text-lg leading-tight">{post.name}</span>
                <span className="text-xs text-base-content/60">{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex gap-2 ml-auto flex-wrap">
                {post.categories && post.categories.map((tag, i) => (
                  <span key={i} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold shadow-sm">{tag}</span>
                ))}
              </div>
              {/* Three-dot menu */}
              <div className="relative ml-2">
                <button
                  className="p-2 rounded-full hover:bg-base-200 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  onClick={() => handleMenuToggle(post._id)}
                  aria-label="Post options"
                >
                  <MoreVertical className="w-5 h-5 text-base-content/70" />
                </button>
                {menuOpen === post._id && (
                  <div className="absolute right-0 mt-2 w-36 bg-base-100 border border-base-300 rounded-xl shadow-lg z-20 animate-fade-in flex flex-col py-2">
                    {user && (post.userId === user._id || user.role === 'ADMIN') && (
                      <button
                        className="flex items-center gap-2 px-4 py-2 text-error hover:bg-error/10 font-semibold text-left rounded-xl transition"
                        onClick={() => handleDelete(post._id)}
                        disabled={isDeletingPost}
                      >
                        <Trash2 className="w-4 h-4" />
                        {isDeletingPost ? 'Deleting...' : 'Delete'}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
            {post.image && (
              <img src={post.image} alt="Post visual" className="w-full max-h-72 object-cover rounded-2xl my-4 border border-base-300 shadow-md" />
            )}
            {/* Only show caption */}
            <p className="text-base-content mb-4 text-xl font-medium whitespace-pre-line leading-relaxed tracking-tight" style={{ fontFamily: 'Inter, sans-serif' }}>{post.caption}</p>
            <div className="flex items-center gap-8 text-base text-base-content/70 mt-2">

            {/* upvote section  */}
              <span className="flex items-center gap-2">
                <ThumbsUp
                 className={`w-5 h-5 text-accent ${post.upvotes?.includes(user?._id) ? 'text-primary' : ''}`}
                  onClick={() =>{
                    if(!post.upvotes?.includes(user?._id) && user?._id){
                      addUpvote(post._id);
                    }
                  }}
                   disabled={isAddingUpvote} id={`upvote-${post._id}`} />
                <span className="font-semibold">{post.upvotes?.length || 0}</span> Upvotes
              </span>
              <button
                className={`flex items-center gap-2 hover:text-primary focus:outline-none transition font-semibold ${openComments === post._id ? 'text-primary' : ''}`}
                onClick={() => setOpenComments(openComments === post._id ? null : post._id)}
                aria-label="Show comments"
              >
                <MessageCircle className="w-5 h-5 text-primary" />
                {post.comments?.length || 0} Comments
              </button>
            </div>
            {/* Comments Section */}
            {openComments === post._id && (
              <div className="mt-6 bg-base-200/80 rounded-2xl p-5 border border-primary/20 flex flex-col gap-4 shadow-inner animate-fade-in">
                <div className="font-semibold text-base-content mb-2 flex items-center gap-2 text-lg">
                  <MessageCircle className="w-5 h-5 text-primary" />
                  Comments
                </div>
                <div className="border-t border-base-300 mb-2" />
                {/* Add comment input at the top */}
                {user && (<form
                  className="flex items-center gap-2 mb-2"
                  onSubmit={e => {
                    e.preventDefault();
                    if (!commentInputs[post._id]?.trim()) return;
                    addComment({
                        postId: post._id,
                        text: commentInputs[post._id],
                    });
                    setCommentInputs((prev) => ({ ...prev, [post._id]: '' }));
                  }}
                >
                  <input
                    type="text"
                    className="input input-bordered flex-1 text-base rounded-xl bg-base-100 focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="Add a comment..."
                    value={commentInputs[post._id] || ''}
                    onChange={e => setCommentInputs((prev) => ({ ...prev, [post._id]: e.target.value }))}
                    disabled={isAddingComment}
                    maxLength={200}
                  />
                  <button
                    type="submit"
                    className="btn btn-primary px-4 py-2 rounded-xl font-semibold text-base shadow-md hover:scale-105 transition-transform disabled:opacity-60"
                    disabled={isAddingComment || !commentInputs[post._id]?.trim()}
                  >
                    {isAddingComment ? <span className="loading loading-spinner loading-xs"></span> : 'Post'}
                  </button>
                </form>)}
                {/* Comments List, scrollable */}
                <div className="flex flex-col gap-3 max-h-55 overflow-y-auto pr-1 scrollbar-thin scrollbar-hide scrollbar-thumb-primary/30 scrollbar-track-base-200 rounded-xl">
                  {post.comments && post.comments.length > 0 ? (
                    [...post.comments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((comment, idx) => (
                      <div key={idx} className="flex items-start gap-3 bg-base-100 rounded-xl p-3 shadow-sm">
                        <img src={comment.profilePic || "/avatar.png"} alt={comment.name || "User"} className="w-8 h-8 rounded-full border border-primary object-cover" />
                        <div className="flex flex-col">
                          <span className="font-semibold text-base-content text-sm flex items-center gap-2">
                            {comment.name || "User"}
                            <span className="text-xs text-base-content/40 font-normal">{comment.createdAt ? new Date(comment.createdAt).toLocaleString() : ''}</span>
                          </span>
                          <span className="text-base-content/70 text-base mt-1">{comment.comment}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <span className="text-base-content/60 italic">No comments yet.</span>
                  )}
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Posts;

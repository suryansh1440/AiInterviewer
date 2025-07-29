import React, { useEffect, useState, useRef } from 'react';
import { usePostStore } from '../store/usePostStore';
import { MessageCircle, ThumbsUp, MoreVertical, Trash2, Share2, Bookmark } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const Posts = () => {
  const [openComments, setOpenComments] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});
  const { posts, isGettingPosts, getPosts, deletePost, isDeletingPost, subscribeToPost, unsubscribeFromPost, emptyPostBuffer, postBuffer, addUpvote, isAddingUpvote, addComment, isAddingComment} = usePostStore();
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

  // Enhanced category color mapping with maximum visibility
  const getCategoryColor = (category) => {
    const colors = {
      'Technology': 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-400 shadow-lg shadow-blue-500/30',
      'Programming': 'bg-gradient-to-r from-purple-500 to-purple-600 text-white border-purple-400 shadow-lg shadow-purple-500/30',
      'Interview': 'bg-gradient-to-r from-green-500 to-green-600 text-white border-green-400 shadow-lg shadow-green-500/30',
      'Career': 'bg-gradient-to-r from-orange-500 to-orange-600 text-white border-orange-400 shadow-lg shadow-orange-500/30',
      'Education': 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white border-indigo-400 shadow-lg shadow-indigo-500/30',
      'Tips': 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border-yellow-400 shadow-lg shadow-yellow-500/30',
      'default': 'bg-gradient-to-r from-gray-500 to-gray-600 text-white border-gray-400 shadow-lg shadow-gray-500/30'
    };
    return colors[category] || colors.default;
  };

  return (
    <div
      ref={postsContainerRef}
      className="w-full max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto flex-1 bg-gradient-to-br from-base-200 via-base-100 to-base-200 rounded-2xl shadow-lg overflow-y-auto scrollbar-hide max-h-[90vh] p-4 md:p-8 pb-24 md:pb-8 relative"
      style={{ minHeight: 'calc(100vh - 64px)', height: '100%' }}
    >
      {postBuffer.length > 0 && (
        <div className="sticky top-[-5vh] left-0 w-full flex justify-center z-40" style={{ pointerEvents: 'none' }}>
          <button
            className="px-8 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/50 text-primary-content backdrop-blur-md border border-primary/30 text-lg mt-2 hover:scale-105 hover:shadow-xl"
            style={{
              opacity: 0.95,
              background: 'linear-gradient(to right, rgba(59,130,246,0.9) 0%, rgba(59,130,246,0.7) 50%, rgba(59,130,246,0.5) 100%)',
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
          <div className="flex flex-col items-center gap-4">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <span className="text-base-content/70 font-medium">Loading posts...</span>
          </div>
        </div>
      ) : posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-96 text-base-content/70">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mb-6">
              <MessageCircle className="w-12 h-12 text-primary" />
            </div>
            <span className="text-2xl font-bold mb-2 text-base-content">No posts yet</span>
            <span className="text-base-content/60">Be the first to create a post!</span>
          </div>
        </div>
      ) : (
        <div>
          {posts.map((post, index) => (
            <div
              key={post._id}
              className="mb-8 last:mb-0 bg-gradient-to-br from-base-100/90 via-base-100/80 to-base-100/90 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-2xl border border-base-300/50 hover:border-primary/30 hover:shadow-3xl transition-all duration-300 relative group overflow-hidden"
              style={{ 
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)'
              }}
            >
              {/* Enhanced glassmorphism overlay */}
              <div className="absolute inset-0 rounded-3xl pointer-events-none group-hover:bg-gradient-to-br group-hover:from-primary/5 group-hover:to-secondary/5 transition-all duration-500" />
              
              {/* Header Section */}
              <div className="flex items-start gap-4 mb-6 relative">
                <div className="flex-shrink-0">
                  <img 
                    src={post.profilePic || "/avatar.png"} 
                    alt={post.name} 
                    className="w-12 h-12 rounded-full border-3 border-primary/30 object-cover shadow-lg ring-2 ring-primary/20 hover:ring-primary/40 transition-all duration-300" 
                    onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = "/avatar.png"; }} 
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-lg text-base-content leading-tight">{post.name}</h3>
                      <span className="text-sm text-base-content/60 flex items-center gap-2">
                        <span>{new Date(post.createdAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</span>
                      </span>
                    </div>
                    
                    {/* Enhanced Categories with maximum visibility */}
                    <div className="flex gap-2 flex-wrap justify-end">
                      {post.categories && post.categories.map((category, i) => (
                        <span
                          key={i}
                          className={`px-4 py-2.5 rounded-full text-sm font-bold border-2 transition-all duration-300 ${getCategoryColor(category)} hover:scale-105 hover:shadow-xl tracking-wide uppercase`}
                          style={{
                            textShadow: '0 1px 3px rgba(0,0,0,0.3)',
                            letterSpacing: '0.08em',
                            fontWeight: '700'
                          }}
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Enhanced Menu Button */}
                <div className="relative flex-shrink-0">
                  <button
                    className="p-2 rounded-full hover:bg-base-200/80 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-200 group-hover:bg-primary/10"
                    onClick={() => handleMenuToggle(post._id)}
                    aria-label="Post options"
                  >
                    <MoreVertical className="w-5 h-5 text-base-content/70 group-hover:text-primary transition-colors" />
                  </button>
                  
                  {menuOpen === post._id && (
                    <div className="absolute right-0 mt-2 w-40 bg-base-100/95 backdrop-blur-xl border border-base-300/50 rounded-xl shadow-2xl z-20">
                      <div className="flex flex-col py-2">
                        {user && (post.userId === user._id || user.role === 'ADMIN') && (
                          <button
                            className="flex items-center gap-3 px-4 py-3 text-error hover:bg-error/10 font-semibold text-left rounded-lg transition-all duration-200 hover:scale-105"
                            onClick={() => handleDelete(post._id)}
                            disabled={isDeletingPost}
                          >
                            <Trash2 className="w-4 h-4" />
                            {isDeletingPost ? 'Deleting...' : 'Delete'}
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Enhanced Image */}
              {post.image && (
                <div className="mb-6 overflow-hidden rounded-2xl shadow-xl">
                  <img 
                    src={post.image} 
                    alt="Post visual" 
                    className="w-full max-h-80 object-cover hover:scale-105 transition-transform duration-500" 
                    onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = "/avatar.png"; }} 
                  />
                </div>
              )}

              {/* Enhanced Caption */}
              <div className="mb-6">
                <p className="text-base-content text-lg font-medium leading-relaxed tracking-tight whitespace-pre-line" 
                   style={{ fontFamily: 'Inter, sans-serif' }}>
                  {post.caption}
                </p>
              </div>

              {/* Enhanced Action Bar */}
              <div className="flex items-center justify-between pt-4 border-t border-base-300/50">
                <div className="flex items-center gap-6">
                  {/* Enhanced Upvote Button */}
                  <button
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all duration-200 hover:scale-105 ${
                      post.upvotes?.includes(user?._id) 
                        ? 'text-primary bg-primary/10 border border-primary/30' 
                        : 'text-base-content/70 hover:text-primary hover:bg-primary/5'
                    }`}
                    onClick={() => {
                      if(!post.upvotes?.includes(user?._id) && user?._id){
                        addUpvote(post._id);
                      }
                    }}
                    disabled={isAddingUpvote}
                  >
                    <ThumbsUp className={`w-5 h-5 ${post.upvotes?.includes(user?._id) ? 'text-primary' : ''}`} />
                    <span className="font-bold">{post.upvotes?.length || 0}</span>
                    <span className="text-sm">Upvotes</span>
                  </button>

                  {/* Enhanced Comments Button */}
                  <button
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all duration-200 hover:scale-105 ${
                      openComments === post._id 
                        ? 'text-primary bg-primary/10 border border-primary/30' 
                        : 'text-base-content/70 hover:text-primary hover:bg-primary/5'
                    }`}
                    onClick={() => setOpenComments(openComments === post._id ? null : post._id)}
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span className="font-bold">{post.comments?.length || 0}</span>
                    <span className="text-sm">Comments</span>
                  </button>
                </div>

                {/* Additional Actions */}
                <div className="flex items-center gap-2">
                  <button
                    className="p-2 rounded-xl hover:bg-base-200/80 transition-all duration-200 hover:scale-105"
                  >
                    <Share2 className="w-5 h-5 text-base-content/70" />
                  </button>
                  <button
                    className="p-2 rounded-xl hover:bg-base-200/80 transition-all duration-200 hover:scale-105"
                  >
                    <Bookmark className="w-5 h-5 text-base-content/70" />
                  </button>
                </div>
              </div>

              {/* Enhanced Comments Section */}
              {openComments === post._id && (
                <div className="mt-6 bg-gradient-to-br from-base-200/80 via-base-100/60 to-base-200/80 rounded-2xl p-6 border border-primary/20 shadow-inner">
                  <div className="font-bold text-base-content mb-4 flex items-center gap-2 text-lg">
                    <MessageCircle className="w-5 h-5 text-primary" />
                    Comments
                  </div>
                  
                  {/* Enhanced Add Comment Form */}
                  {user && (
                    <form
                      className="flex items-center gap-3 mb-6"
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
                        className="input input-bordered flex-1 text-base rounded-xl bg-base-100/80 focus:border-primary focus:ring-2 focus:ring-primary/20 backdrop-blur-sm"
                        placeholder="Add a comment..."
                        value={commentInputs[post._id] || ''}
                        onChange={e => setCommentInputs((prev) => ({ ...prev, [post._id]: e.target.value }))}
                        disabled={isAddingComment}
                        maxLength={200}
                      />
                      <button
                        type="submit"
                        className="btn btn-primary px-6 py-2 rounded-xl font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-200"
                        disabled={isAddingComment || !commentInputs[post._id]?.trim()}
                      >
                        {isAddingComment ? <span className="loading loading-spinner loading-xs"></span> : 'Post'}
                      </button>
                    </form>
                  )}

                  {/* Enhanced Comments List */}
                  <div className="flex flex-col gap-4 max-h-64 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary/30 scrollbar-track-base-200 rounded-xl">
                    {post.comments && post.comments.length > 0 ? (
                      [...post.comments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((comment, idx) => (
                        <div 
                          key={idx} 
                          className="flex items-start gap-3 bg-base-100/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-base-300/30"
                        >
                          <img 
                            src={comment.profilePic || "/avatar.png"} 
                            alt={comment.name || "User"} 
                            className="w-10 h-10 rounded-full border-2 border-primary/30 object-cover shadow-sm" 
                            onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = "/avatar.png"; }} 
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-base-content text-sm">{comment.name || "User"}</span>
                              <span className="text-xs text-base-content/40">
                                {comment.createdAt ? new Date(comment.createdAt).toLocaleString() : ''}
                              </span>
                            </div>
                            <p className="text-base-content/80 text-sm leading-relaxed">{comment.comment}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-base-content/60 italic">
                        No comments yet. Be the first to comment!
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Posts;

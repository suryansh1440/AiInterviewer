import React, { useState } from "react";

// Lucide React icons
import { PlusCircle, MessageCircle, Trophy, LayoutGrid } from 'lucide-react';

// Demo data
const demoPosts = [
  {
    id: 1,
    title: "How to prepare for system design interviews?",
    author: "Alice",
    avatar: "/avatar.png",
    date: "2024-06-01",
    tags: ["System Design", "Interview"],
    upvotes: 23,
    comments: 5,
    excerpt: "What are the best resources and strategies for system design interviews? Share your tips!",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80",
    commentList: [
      { id: 1, author: "Bob", avatar: "/avatar.png", text: "Check out Grokking the System Design Interview!" },
      { id: 2, author: "Carol", avatar: "/avatar.png", text: "Practice with friends and use real-world examples." }
    ]
  },
  {
    id: 2,
    title: "Share your toughest coding interview question!",
    author: "Bob",
    avatar: "/avatar.png",
    date: "2024-06-02",
    tags: ["Coding", "Experience"],
    upvotes: 15,
    comments: 8,
    excerpt: "Let's help each other by sharing the hardest coding questions you've faced.",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&q=80",
    commentList: [
      { id: 1, author: "Alice", avatar: "/avatar.png", text: "I once got asked to implement an LRU cache from scratch!" },
      { id: 2, author: "David", avatar: "/avatar.png", text: "Binary tree serialization/deserialization was tough for me." }
    ]
  },
  {
    id: 3,
    title: "AI Interviewer feedback accuracy?",
    author: "Carol",
    avatar: "/avatar.png",
    date: "2024-06-03",
    tags: ["AI", "Feedback"],
    upvotes: 8,
    comments: 2,
    excerpt: "How accurate do you find the feedback from the AI Interviewer? Any suggestions to improve it?",
    commentList: [
      { id: 1, author: "Eve", avatar: "/avatar.png", text: "I found it pretty accurate for communication skills." }
    ]
  },
  {
    id: 4,
    title: "Behavioral interview tips for introverts",
    author: "David",
    avatar: "/avatar.png",
    date: "2024-06-04",
    tags: ["Behavioral", "Tips"],
    upvotes: 12,
    comments: 3,
    excerpt: "Introverts, how do you handle behavioral interviews? Any advice for staying confident?",
    image: "https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=600&q=80",
    commentList: [
      { id: 1, author: "Grace", avatar: "/avatar.png", text: "Prepare stories in advance and practice out loud." }
    ]
  },
  {
    id: 5,
    title: "Best online resources for resume building",
    author: "Eve",
    avatar: "/avatar.png",
    date: "2024-06-05",
    tags: ["Resume", "Resources"],
    upvotes: 19,
    comments: 6,
    excerpt: "Share your favorite websites or tools for creating a standout resume!",
    commentList: [
      { id: 1, author: "Frank", avatar: "/avatar.png", text: "I love using Canva for resume templates." }
    ]
  },
  {
    id: 6,
    title: "Mock interview partners wanted!",
    author: "Frank",
    avatar: "/avatar.png",
    date: "2024-06-06",
    tags: ["Mock Interview", "Partner"],
    upvotes: 7,
    comments: 4,
    excerpt: "Looking for someone to practice mock interviews with. Anyone interested?",
    image: "https://images.unsplash.com/photo-1515168833906-d2a3b82b302b?auto=format&fit=crop&w=600&q=80",
    commentList: [
      { id: 1, author: "Alice", avatar: "/avatar.png", text: "I'm interested! Let's connect." }
    ]
  },
  {
    id: 7,
    title: "How to handle rejection after interviews?",
    author: "Grace",
    avatar: "/avatar.png",
    date: "2024-06-07",
    tags: ["Experience", "Advice"],
    upvotes: 11,
    comments: 2,
    excerpt: "Rejection is tough. How do you stay motivated and keep improving?",
    commentList: [
      { id: 1, author: "Bob", avatar: "/avatar.png", text: "Talk to friends and keep practicing!" }
    ]
  }
];

const demoCategories = [
  "All",
  "System Design",
  "Coding",
  "AI",
  "Behavioral",
  "Resume",
  "Experience"
];

const trendingUsers = [
  { name: "Alice", avatar: "/avatar.png", posts: 12 },
  { name: "Bob", avatar: "/avatar.png", posts: 9 },
  { name: "Carol", avatar: "/avatar.png", posts: 7 }
];

const leaderboard = [
  { name: "Alice", avatar: "/avatar.png", score: 120 },
  { name: "Bob", avatar: "/avatar.png", score: 98 },
  { name: "Carol", avatar: "/avatar.png", score: 85 },
  { name: "David", avatar: "/avatar.png", score: 77 },
  { name: "Eve", avatar: "/avatar.png", score: 65 }
];

const Community = () => {
  const [openComments, setOpenComments] = useState(null);
  const [rightTab, setRightTab] = useState('post');
  const [postForm, setPostForm] = useState({ topic: '', description: '', image: '', category: '' });
  const [genPrompt, setGenPrompt] = useState('');
  const [genResult, setGenResult] = useState('');
  const handlePostFormChange = e => setPostForm({ ...postForm, [e.target.name]: e.target.value });
  const handleImageChange = e => setPostForm({ ...postForm, image: e.target.files[0]?.name || '' });
  const handlePostSubmit = e => { e.preventDefault(); setPostForm({ topic: '', description: '', image: '', category: '' }); alert('Post created! (demo only)'); };
  const handleGenerate = e => { e.preventDefault(); setGenResult(`AI-generated post about: ${genPrompt}`); };
  return (
    <div className="min-h-[90vh] bg-base-200 py-6 px-6">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Sidebar: Navigation */}
        <aside className="hidden md:flex flex-col md:w-20 bg-base-100 rounded-2xl shadow-lg p-3 h-fit sticky top-24 items-center gap-4 border border-primary/10">
          <button className="flex flex-col items-center gap-1 w-14 h-14 justify-center rounded-xl hover:bg-primary/10 transition-all group" title="Create Post">
            <PlusCircle className="w-7 h-7 text-primary group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-semibold text-primary">Create</span>
          </button>
          <button className="flex flex-col items-center gap-1 w-14 h-14 justify-center rounded-xl hover:bg-primary/10 transition-all group" title="Messages">
            <MessageCircle className="w-7 h-7 text-primary group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-semibold text-primary">Message</span>
          </button>
          <button className="flex flex-col items-center gap-1 w-14 h-14 justify-center rounded-xl hover:bg-primary/10 transition-all group" title="Leaderboard">
            <Trophy className="w-7 h-7 text-primary group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-semibold text-primary">Leader</span>
          </button>
          <button className="flex flex-col items-center gap-1 w-14 h-14 justify-center rounded-xl hover:bg-primary/10 transition-all group" title="Categories">
            <LayoutGrid className="w-7 h-7 text-primary group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-semibold text-primary">Category</span>
          </button>
        </aside>
        {/* Right Sidebar: Categories (moved from left) */}
        <main
          className="flex-1 flex flex-col items-center px-2 md:px-6 lg:px-12 py-2"
        >
          <div
            className="w-full max-w-3xl lg:max-w-4xl xl:max-w-5xl flex-1 bg-base-100 rounded-2xl shadow-lg p-6 overflow-y-auto scrollbar-hide min-h-[70vh] h-full"
            style={{ minHeight: 'calc(100vh - 64px)', height: '100%' }}
          >
            {/* Posts List */}
            {demoPosts.map((post, idx) => (
              <div
                key={idx}
                className="mb-8 last:mb-0 bg-base-200 rounded-xl p-5 shadow border border-base-300 hover:shadow-xl transition-all duration-200"
              >
                <div className="flex items-center gap-3 mb-1">
                  <img src={post.avatar} alt={post.author} className="w-8 h-8 rounded-full border border-primary" />
                  <span className="font-semibold text-base-content">{post.author}</span>
                  <span className="text-xs text-base-content/60 ml-2">{post.date}</span>
                  <div className="flex gap-2 ml-auto">
                    {post.tags.map((tag, i) => (
                      <span key={i} className="px-2 py-1 rounded bg-primary/10 text-primary text-xs font-semibold">{tag}</span>
                    ))}
                  </div>
                </div>
                {post.image && (
                  <img src={post.image} alt="Post visual" className="w-full max-h-56 object-cover rounded-xl mb-2 border border-base-300" onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = "/avatar.png"; }} />
                )}
                <h2 className="text-xl font-bold text-base-content mb-1">{post.title}</h2>
                <p className="text-base-content/70 mb-2">{post.excerpt}</p>
                <div className="flex items-center gap-4 text-sm text-base-content/60">
                  <span className="flex items-center gap-1"><svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14 9l-3 6-3-6" /></svg> {post.upvotes} Upvotes</span>
                  <button
                    className="flex items-center gap-1 hover:text-primary focus:outline-none"
                    onClick={() => setOpenComments(openComments === post.id ? null : post.id)}
                    aria-label="Show comments"
                  >
                    <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V10a2 2 0 012-2h2" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 3h-6a2 2 0 00-2 2v0a2 2 0 002 2h6a2 2 0 002-2v0a2 2 0 00-2-2z" /></svg>
                    {post.comments} Comments
                  </button>
                </div>
                {/* Comments Section */}
                {openComments === post.id && post.commentList && (
                  <div className="mt-3 bg-base-200 rounded-xl p-4 border border-base-300 flex flex-col gap-3">
                    {post.commentList.length === 0 ? (
                      <span className="text-base-content/60 italic">No comments yet.</span>
                    ) : (
                      post.commentList.map(comment => (
                        <div key={comment.id} className="flex items-center gap-3">
                          <img src={comment.avatar} alt={comment.author} className="w-7 h-7 rounded-full border border-primary" onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = "/avatar.png"; }} />
                          <span className="font-semibold text-base-content">{comment.author}</span>
                          <span className="text-base-content/70">{comment.text}</span>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </main>
        <aside className="hidden md:flex flex-col md:w-72 bg-base-100 rounded-2xl shadow p-6 h-fit sticky top-24">
          <h3 className="text-lg font-bold mb-4 text-primary">Categories</h3>
          <div className="flex flex-wrap gap-2 mb-6">
            {demoCategories.map((cat, idx) => (
              <button
                key={idx}
                className="px-3 py-1 rounded-full bg-base-200 text-xs font-semibold text-base-content hover:bg-primary/10 hover:text-primary transition border border-base-300"
              >
                {cat}
              </button>
            ))}
          </div>
          {/* Sticky Notes Section: Upcoming Updates */}
          <div className="flex flex-col gap-3 mt-2">
            <div className="bg-yellow-200 shadow-lg rounded-lg px-4 py-3 text-sm font-semibold text-yellow-900 rotate-[-2deg]" style={{fontFamily: 'cursive'}}>🚀 Upcoming: Real-time chat between users!</div>
            <div className="bg-pink-200 shadow-lg rounded-lg px-4 py-3 text-sm font-semibold text-pink-900 rotate-2" style={{fontFamily: 'cursive'}}>📝 Soon: Post your own interview questions and answers.</div>
            <div className="bg-green-200 shadow-lg rounded-lg px-4 py-3 text-sm font-semibold text-green-900 rotate-[-1deg]" style={{fontFamily: 'cursive'}}>🏆 Leaderboard rewards and badges coming soon!</div>
            <div className="bg-blue-200 shadow-lg rounded-lg px-4 py-3 text-sm font-semibold text-blue-900 rotate-1" style={{fontFamily: 'cursive'}}>🔔 Notifications for replies and upvotes are on the way!</div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Community; 
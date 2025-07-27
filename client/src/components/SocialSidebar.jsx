import React from 'react'
import { MessageCircle, Trophy, PlusCircle, Film } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useModalStore } from '../store/useModalStore';

const SocialSidebar = ({ onCreateClick }) => {
    const {user} = useAuthStore();
    const {setOpenModal} = useModalStore();
    const navigate = useNavigate();
  return (
    <>
      {/* Desktop/Tablet Sidebar */}
      <aside className="hidden md:flex flex-col md:w-20 bg-base-100 rounded-2xl shadow-lg p-3 max-h-[90vh] sticky top-24 items-center gap-4 border border-primary/10">
        <Link to="/social/post" className="flex flex-col items-center gap-1 w-14 h-14 justify-center rounded-xl hover:bg-primary/10 transition-all group" title="post">
          <Film className="w-7 h-7 text-primary group-hover:scale-110 transition-transform" />
          <span className="text-[11px] font-semibold text-primary">Post</span>
        </Link>
        <button className="flex flex-col items-center gap-1 w-14 h-14 justify-center rounded-xl hover:bg-primary/10 transition-all group" title="create" onClick={()=>{
          if(!user){ setOpenModal(); }else{ onCreateClick(); }
        }}>
          <PlusCircle className="w-7 h-7 text-primary group-hover:scale-110 transition-transform" />
          <span className="text-[11px] font-semibold text-primary">Create</span>
        </button>
        <button className="flex flex-col items-center gap-1 w-14 h-14 justify-center rounded-xl hover:bg-primary/10 transition-all group" title="Leaderboard" onClick={()=>{
          navigate('/social/leaderboard');
        }}>
          <Trophy className="w-7 h-7 text-primary group-hover:scale-110 transition-transform" />
          <span className="text-[11px] font-semibold text-primary">Leader</span>
        </button>
      </aside>
      {/* Mobile Bottom Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-20 bg-base-100 border-t border-primary/10 flex md:hidden flex-row justify-around items-center py-2 px-2 shadow-2xl rounded-t-2xl">
        <Link to="/social/post" className="flex flex-col items-center gap-0.5 w-12 h-12 justify-center rounded-xl hover:bg-primary/10 transition-all group" title="post">
          <Film className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-semibold text-primary">Post</span>
        </Link>
        <button className="flex flex-col items-center gap-0.5 w-12 h-12 justify-center rounded-xl hover:bg-primary/10 transition-all group" title="create" onClick={()=>{
          if(!user){ setOpenModal(); }else{ onCreateClick(); }
        }}>
          <PlusCircle className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-semibold text-primary">Create</span>
        </button>
        <button  onClick={()=>{
          navigate('/social/leaderboard');
        }} className="flex flex-col items-center gap-0.5 w-12 h-12 justify-center rounded-xl hover:bg-primary/10 transition-all group" title="Leaderboard">
          <Trophy className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-semibold text-primary">Leader</span>
        </button>
      </nav>
    </>
  )
}

export default SocialSidebar

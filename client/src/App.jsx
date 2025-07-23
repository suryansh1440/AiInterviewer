import React, { useEffect, useRef } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { Outlet, useLocation } from 'react-router-dom'
import { useThemeStore } from './store/useThemeStore'
import Modal from './components/Modal'
import { useModalStore } from './store/useModalStore'
import {Toaster} from "react-hot-toast"
import { useAuthStore } from './store/useAuthStore'
import { Loader } from 'lucide-react'



const App = () => {
  const { theme } = useThemeStore();
  const { isOpenModal } = useModalStore();
  const location = useLocation();
  const {user,checkAuth,isCheckingAuth} = useAuthStore()


  useEffect(()=>{
    checkAuth()
  },[checkAuth])

  if(isCheckingAuth && !user) return (
    <div className='flex items-center justify-center h-screen'>
      <Loader className='size-10 animate-spin' />

    </div>
  )

  return (
    <div data-theme={theme} className="relative overflow-hidden">
      <Navbar />
      <div className='min-h-[90vh]'>
        <Outlet />
      </div>
      {!location.pathname.startsWith('/dashboard') && !location.pathname.startsWith('/interview/id=')  && <Footer />}
      {isOpenModal && (
        <>
          <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300">
          </div>
          <div className="z-50">
            <Modal />
          </div>
        </>
      )}
      <Toaster/>
    </div>
  )
}

export default App

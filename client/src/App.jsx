import React, { useEffect, useRef } from 'react'
import Navbar from './components/Navbar'
import { Outlet, useLocation} from 'react-router-dom'
import { useSettingStore } from './store/useSettingStore'
import Modal from './components/Modal'
import { useModalStore } from './store/useModalStore'
import {Toaster} from "react-hot-toast"
import { useAuthStore } from './store/useAuthStore'
import { Loader } from 'lucide-react'



const App = () => {
  const { theme } = useSettingStore();
  const { isOpenModal } = useModalStore();
  const {user,checkAuth,isCheckingAuth} = useAuthStore()
  const location = useLocation()


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
      {!location.pathname.startsWith('/interview') && <Navbar />}
      <div className='min-h-[90vh]'>
        <Outlet />
      </div>
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

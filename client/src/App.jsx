import React, { useEffect, useRef } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { Outlet, useLocation } from 'react-router-dom'
import { useThemeStore } from './store/useThemeStore'
import Modal from './components/Modal'
import { useModalStore } from './store/useModalStore'


const App = () => {
  const { theme } = useThemeStore();
  const { isOpenModal } = useModalStore();
  const location = useLocation();

  return (
    <div data-theme={theme} className="relative">
      <Navbar />
      <div className='min-h-[90vh]'>
        <Outlet />
      </div>
      {!location.pathname.startsWith('/dashboard') && <Footer />}
      {isOpenModal && (
        <>
          <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300">
          </div>
          <div className="z-50">
            <Modal />
          </div>
        </>
      )}
    </div>
  )
}

export default App

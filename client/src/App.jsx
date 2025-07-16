import React, { useEffect, useRef } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { Outlet } from 'react-router-dom'
import { useThemeStore } from './store/useThemeStore'
import Modal from './components/Modal'
import { useModalStore } from './store/useModalStore'

const App = () => {
  const {theme}= useThemeStore();
  const modalRef = useRef(null);
  const {isOpenLogin} = useModalStore();
  
  const handleModal = () => {
    modalRef.current.showModal();
  };

  
    if(isOpenLogin==true){
      handleModal()
    }

  return (
    <div data-theme={theme}>
      <Navbar/>
      <div className='min-h-[90vh]'>
        <Outlet/>
      </div>
      <Footer/>
      <Modal ref={modalRef} />
    </div>
  )
}

export default App

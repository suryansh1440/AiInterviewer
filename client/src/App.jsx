import React from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { Outlet } from 'react-router-dom'
import { useThemeStore } from './store/useThemeStore'

const App = () => {
  const {theme}= useThemeStore();
  return (
    <div data-theme={theme}>
      <Navbar/>
      <div className='min-h-[90vh]'>
        <Outlet/>
      </div>
      <Footer/>
    </div>
  )
}

export default App

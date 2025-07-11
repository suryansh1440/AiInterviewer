import React from 'react'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Footer from './components/Footer'
import { Outlet } from 'react-router-dom'

const App = () => {
  return (
    <div data-theme="light">
      <Navbar/>
      <div className='min-h-[90vh]'>
        <Outlet/>
      </div>
      <Footer/>
    </div>
  )
}

export default App

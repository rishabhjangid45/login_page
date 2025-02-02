import React from 'react'
import Navbar from '../componants/navbar'
import Header from '../componants/Header'



const Home = () => {
  return (
    <div className='flex flex-col items-center justify-center h-screen bg-cover bg-gradient-to-br from-slate-400 to-zinc-900'>
    <Navbar/>
    <Header/>
    </div>
  )
}

export default Home

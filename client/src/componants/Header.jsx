import React from 'react'
import { useContext } from 'react'
import { AppContext } from '../context/Appcontext'
import { useNavigate } from 'react-router-dom'

const Header = () => {
const {userData} = useContext(AppContext);
const navigate = useNavigate();


  return (
    <div className='text-slate-300 flex flex-col justify-center items-center'>
     <img className='w-32 mb-4' src="\pngimg.com - robot_PNG85.png" alt="" />
     <p className='text-2xl mb-2 font-bold flex gap-2 items-center'>Hey { userData ? userData.name : "Developer!"} <img className='w-6 h-6' src="\waving-hand.png" alt="" /></p>
     <p className='text-3xl mb-1 font-semibold'>Welcome to Our App</p>
     <p className='text-md w-5/6 text-center'>Lets start witha quick product tour and we will have you up and running in no time</p>
     <button onClick={() => navigate('/login')} className='border-1 rounded-full p-2 px-7 mt-3'>Get Started</button>
    </div>
  )
}

export default Header

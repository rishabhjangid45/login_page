import React, { useEffect } from 'react'
import { useRef } from 'react'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/Appcontext'
import axios from 'axios'
import { toast } from 'react-toastify'
const Emailverify = () => {
  axios.defaults.withCredentials = true;
  const inputrefs = useRef([]);
  const navigate = useNavigate();
  const {backendUrl,userData ,isLoggedin ,getUserData} = useContext(AppContext);
  const handleInput = (e, index) => {
    if(e.target.value >0 && index < 5) inputrefs.current[index + 1].focus();
    
  }
  const handleKeydown = (e, index) => {
    if(e.key === 'Backspace' && index > 0 && e.target.value === '') inputrefs.current[index - 1].focus();
  }

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text');
    const pasteArray = paste.split('');
    pasteArray.forEach((char, index) => {
      if(char !== '') inputrefs.current[index].value = char;
    })
  }

  const submitHandler = async (e) => {
   try {
      e.preventDefault();
      const otpArray = inputrefs.current.map(e => e.value);
      const otp = otpArray.join('');

      const {data} = await axios.post(backendUrl + '/api/auth/verify-account', {otp,userData});
      if(data.success) {
        toast.success(data.message);
        getUserData();
        navigate('/');
      }
      else{
        toast.error(data.message);
      }
   } catch (error) {
    toast.error(error.message);
   } 
  }
  useEffect(() => {
    isLoggedin && userData && userData.isaccountVerified && navigate('/');
  },[isLoggedin,userData])
  return (
    <div className='flex flex-col items-center justify-center h-screen bg-gradient-to-br from-slate-400 to-zinc-900'>
      <img onClick={() => navigate('/')}  src="\android-chrome-512x512.png" alt=""  className='cursor-pointer w-5 sm:w-12 absolute left-5 top-5 '/>
      <form onSubmit={submitHandler} action="" className='text-white bg-slate-900 p-8 rounded-lg shoadow-lg w-96 text-sm'>
          <h1 className='text-2xl font-bold text-center pb-2'>Email Verify OTP</h1>
          <p className='text-center text-slate-300'>Enter the OTP sent to your email</p>
          <div className='flex justify-between mt-4' onPaste={handlePaste}>
              {Array(6).fill().map((_, index) => <input className='w-10 h-10 text-center text-xl bg-slate-800 rounded-lg  focus:bg-slate-700 outline-none  text-white' key={index} type="text"  maxLength={1} ref={(e) => (inputrefs.current[index] = e)} onInput={(e) => handleInput(e, index)} onKeyDown={(e) => handleKeydown(e, index)} />)}
          </div>
          <button  className='  text-white w-full text-lg py-1 px-4 rounded-full outline-none  font-semibold border-none bg-gradient-to-br from-indigo-600 to-indigo-400 text-center mt-6'>Submit</button>
      </form>
    </div>
  )
}

export default Emailverify

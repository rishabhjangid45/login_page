import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useRef } from 'react'
import { useContext } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AppContext } from '../context/Appcontext'
const Resetpassword = () => {

 const {backendUrl} = useContext(AppContext);
 axios.defaults.withCredentials = true;

  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const[newpassword, setNewpassword] = useState('');
  const[isEmailSent, setIsEmailSent] = useState(false);
  const[otp , setOtp] = useState(0);
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);
  const inputrefs = useRef([]);
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

    const onSubmitEmail = async (e) => {
      e.preventDefault();
      try {
        const {data} = await axios.post(backendUrl + '/api/auth/send-reset-otp', {email});
        if(data.success) {
          toast.success(data.message);
          setIsEmailSent(true);
        }
        else{
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    }

    const onSubmitOtp = async (e) => {
      e.preventDefault();
      const otpArray = inputrefs.current.map(e => e.value);
      setOtp(otpArray.join(''));
      
      try {
        const {data} = await axios.post( 'http://localhost:4000/api/auth/is-otp-valid', {email , otp});
        console.log(data);
        if(data.success) {
          toast.success(data.message);
          setIsOtpSubmitted(true);
        }
        else{
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
      }

    

    const onSubmitNewPassword = async (e) => {
      e.preventDefault();
      try {
        const {data} = await axios.post( backendUrl +'/api/auth/reset-password', {email , otp, newpassword });
        if(data.success) {
          toast.success(data.message);
          navigate('/login');
        }
        else{
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(data.message);
      }
    }




  return (
    <div className='flex flex-col items-center justify-center h-screen bg-gradient-to-br from-slate-400 to-zinc-900'>
      <img onClick={() => navigate('/')}  src="\android-chrome-512x512.png" alt=""  className='cursor-pointer w-5 sm:w-12 absolute left-5 top-5 '/>

{!isEmailSent && 
      <form onSubmit={onSubmitEmail} action="" className='text-white bg-slate-900 p-8 rounded-lg shoadow-lg w-96 text-sm'>
          <h1 className='text-2xl font-bold text-center pb-2'>Reset Password</h1>
          <p className='text-center text-slate-300'>Enter your email to reset your password</p>
          <div className='bg-slate-800 rounded-full font-semibold flex items-center  mt-4'>
              <img className='w-6 h-6 ml-3' src="\email.png" alt="" />
              <input  onChange={(e) => setEmail(e.target.value)} required type="text" placeholder='Email Id'  className='w-full p-2 outline-none  bg-transparent ml-2' value = {email} />
            </div>
            <button  className='  text-white w-full text-lg py-1 px-4 rounded-full outline-none  font-semibold border-none bg-gradient-to-br from-indigo-600 to-indigo-400 text-center mt-6'>Submit</button>

      </form> }
      

{!isOtpSubmitted && isEmailSent && 
<form onSubmit={onSubmitOtp} action="" className='text-white bg-slate-900 p-8 rounded-lg shoadow-lg w-96 text-sm'>
      <h1 className='text-2xl font-bold text-center pb-2'>Reset Password OTP</h1>
          <p className='text-center text-slate-300'>Enter the OTP sent to your email</p>
          <div className='flex justify-between mt-4' onPaste={handlePaste}>
              {Array(6).fill().map((_, index) => <input className='w-10 h-10 text-center text-xl bg-slate-800 rounded-lg  focus:bg-slate-700 outline-none  text-white' key={index} type="text"  maxLength={1} ref={(e) => (inputrefs.current[index] = e)} onInput={(e) => handleInput(e, index)} onKeyDown={(e) => handleKeydown(e, index)}/>)}
          </div>
          <button  className='  text-white w-full text-lg py-1 px-4 rounded-full outline-none  font-semibold border-none bg-gradient-to-br from-indigo-600 to-indigo-400 text-center mt-6'>Submit</button>
      </form> }
      
{isOtpSubmitted && isEmailSent &&
  <form onSubmit={onSubmitNewPassword} action="" className='text-white bg-slate-900 p-8 rounded-lg shoadow-lg w-96 text-sm'>
          <h1 className='text-2xl font-bold text-center pb-2'>New Password</h1>
          <p className='text-center text-slate-300'>Enter the new Password below</p>
          <div className='bg-slate-800 rounded-full font-semibold flex items-center  mt-4'>
              <img className='w-6 h-6 ml-3' src="\pass.png" alt="" />
              <input  onChange={(e) => setNewpassword(e.target.value)} required type="password" placeholder='New Password'  className='w-full p-2 outline-none  bg-transparent ml-2' value = {newpassword}/>
            </div>
            <button  className='  text-white w-full text-lg py-1 px-4 rounded-full outline-none  font-semibold border-none bg-gradient-to-br from-indigo-600 to-indigo-400 text-center mt-6'>Submit</button>

      </form> }
      

    </div>
  )
}

export default Resetpassword

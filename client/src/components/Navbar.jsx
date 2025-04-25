import React from 'react'
import { useContext } from 'react'
import { AppContext } from '../context/Appcontext'
import axios from 'axios';
import { toast } from 'react-toastify';

import { useNavigate } from 'react-router-dom'

const Navbar = () => {
  const navigate = useNavigate();
  const {userData , backendUrl , setuserData , setIsLoggedin} = useContext(AppContext);
 const sendVerficationOtp = async () => {
  try {
    axios.defaults.withCredentials = true;
    const {data} = await axios.post(backendUrl+'/api/auth/send-verify-otp',userData)
    console.log(data);
    if(data.success) {
      navigate('/email-verify');
      toast.success(data.message);
    } 
    else{
      toast.error(data.message);
    }
    
  } catch (error) {
    console.error(error.response.data);
    toast.error(error.message);
  }
 }
  const logout = async () => {
    try {
      const {data} = await axios.post(backendUrl + '/api/auth/logout');
      if(data.success) {
        setIsLoggedin(false);
        setuserData(false);
        navigate('/');
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <div className='flex  justify-between items-center p-4 sm:p-3 sm:px-12 absolute top-0 w-full'>
      <img src="\android-chrome-512x512.png" alt="" className='w-5 sm:w-12'/>
      {userData ?
      <div className=' text-white bg-zinc-700 text-lg py-2 px-4 rounded-full outline-none flex items-center gap-2  border-none relative group'>
        {userData.name[0].toUpperCase()}
        <div className='absolute hidden group-hover:block w-28 rounded-md text-white top-0 right-0 mt-11  '>
          <ul className='list-none m-0 p-2  text-sm bg-zinc-700  '>
            { !userData.isaccountVerified  && <li onClick={sendVerficationOtp} className='py-1 px-2 cursor-pointer '>Verify Email</li>  }
            
            <li onClick={logout} className='py-1 px-2  cursor-pointer '>Logout</li>
          </ul>
        </div>
       
        
      </div>  
      : <button onClick={() => navigate('/login')} className='bg-zinc-700 hover:bg-zinc-600 text-white text-lg py-1 px-4 rounded-lg outline-none flex items-center gap-2 text-center border-none'>Login <img src="\right-arrow.svg" alt="" className='w-4' /></button>
      }
    </div>
  )
}

export default Navbar

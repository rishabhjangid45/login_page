import React from 'react'
import { useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext} from '../context/Appcontext';
import axios from 'axios';
import { toast} from 'react-toastify';
import { useContext } from 'react';


const Login = () => {
  const navigate = useNavigate();


  const {isLoggedin,setIsLoggedin,setuserData,backendUrl,getUserData} = useContext(AppContext);
  


  const [state , setState] = useState('Sign Up');
  const[name,setname] = useState('');
  const[email,setemail] = useState('');
  const[password,setpassword] = useState('');

  const handleSubmit = async (e) => {
   
    try {
      e.preventDefault();
      axios.defaults.withCredentials =true;
      if(state === 'Sign Up') {
        const {data} = await axios.post(backendUrl + '/api/auth/register', {name,email,password});
        if(data.success) {
          setIsLoggedin(true);
          getUserData();
          navigate('/');
        }
        else{
          toast.error(data.message);
        }
      }
      else{
        const {data} =await axios.post(backendUrl + '/api/auth/login', {email,password});
        
        if(data.success) {
          setIsLoggedin(true);
          getUserData();
          navigate('/');
        }
        else{
          toast.error( data.message );
          <h1>{data.message}</h1>
        }
      }

    } catch ( data ) {
      toast.error( data.message );
    }
      
      
  }

  return (
    <div className='flex flex-col items-center justify-center h-screen bg-gradient-to-br from-slate-400 to-zinc-900'>
          <img onClick={() => navigate('/')} src="\android-chrome-512x512.png" alt=""  className='cursor-pointer w-5 sm:w-12 absolute left-5 top-5 '/>
          <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-200 text-sm'>
            <h2 className='text-3xl font-bold text-center  text-white pb-2'>{state === 'Sign Up' ? 'Create Account' : 'Login'}</h2>
            <p className='text-center font-semibold pb-3 text-[15px]'>{state === 'Sign Up' ? 'Create your acount' : 'Login to your account'}</p>


            <form onSubmit={handleSubmit} >

            {state === 'Sign Up' && (
              <div className='bg-slate-800 rounded-full flex font-semibold items-center mb-4'>
                <img className='w-6 h-6 ml-3' src="\people.png" alt="" />
              <input 
              onChange={e=>setname(e.target.value)} 
              value={name} type="text" placeholder='Full Name'  
              className='w-full p-2 outline-none  bg-transparent ml-2'/>
            </div>
            )}

            <div className='bg-slate-800 rounded-full font-semibold flex items-center mb-4'>
              <img className='w-6 h-6 ml-3' src="\email.png" alt="" />
              <input
              onChange={e=>setemail(e.target.value)} 
              value={email}
              type="text" placeholder='Email Id'  className='w-full p-2 outline-none  bg-transparent ml-2'/>
            </div>

            <div className='bg-slate-800 rounded-full font-semibold flex items-center mb-4'>
              <img className='w-6 h-6 ml-3' src="\pass.png" alt="" />
              <input
              onChange={e=>setpassword(e.target.value)} 
              value={password} 
              type="password" placeholder='password'  className='w-full p-2 outline-none  bg-transparent ml-2'/>
            </div>

            {state === 'Login' && (
              <p onClick={()=> navigate('/reset-password')} className='text-right text-indigo-400 font-semibold hover:text-indigo-300 cursor-pointer'>Forget Password?</p>
            )}
            <button  className='  text-white w-full text-lg py-1 px-4 rounded-full outline-none mt-2 font-semibold border-none bg-gradient-to-br from-indigo-600 to-indigo-400 text-center'>{state}</button>
          </form>
          {state === 'Sign Up' ? (
            <p className='text-center text-sm mt-2'>Already have an account?{' '} 
            <span onClick={()=> setState('Login')} className='text-indigo-400 font-semibold hover:text-indigo-300 cursor-pointer underline'>Login</span>
          </p>
          )
          :
          (
            <p className='text-center text-sm mt-2'>Don't have an account?{' '} 
            <span onClick={()=> setState('Sign Up')} className='text-indigo-400 font-semibold hover:text-indigo-300 cursor-pointer underline'>Sign up</span>
          </p>
          )
            
          }
          
          </div>
          
    </div>
  )
}

export default Login

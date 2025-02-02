import axios from "axios";
import { createContext } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import { useEffect } from "react";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
    axios.defaults.withCredentials = true;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
   
    
    const[isLoggedin,setIsLoggedin] = useState(false);
    const[userData,setuserData] = useState(false);
    const getAuthState = async () => {
        try {
            const {data} = await axios.get(backendUrl + '/api/auth/is-auth');
            if(data.success) {
                setIsLoggedin(true);
                getUserData();
            }
          } catch (error) {
              toast.error(error.message);
          }
    }
    useEffect(() => {
        getAuthState();
    },[])
    
    const getUserData = async () => {
        try {
            const {data} = await axios.get(backendUrl + '/api/user/data');
            data.success ? setuserData(data.user) : toast.error(data.message);
            
          } catch (error) {
              
            toast.error(error.message);

          }
    };
    return(
        <AppContext.Provider value={{
        backendUrl,
        isLoggedin,
        setIsLoggedin,
        userData,
        setuserData,
        getUserData,

        }}>
            {props.children}
        </AppContext.Provider>
    ) 
        
    };
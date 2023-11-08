import React, { useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS file for styling

// import { drfLogout } from '../../drfServer'; 



const Logout = (props)=>{
  useEffect(()=>{

    // Remove data from local storage (e.g., user token)
    const itemsToRemove = ['access_token', 'refresh_token', 'client_id', 'is_admin'];
    // Loop through the array and remove each item
    itemsToRemove.forEach(item => {
      localStorage.removeItem(item);
    });
    props.history.push('/login');

  },[]);
   
    return (
      <div>
        Logging out...
      </div>
    );
  }


export default Logout;

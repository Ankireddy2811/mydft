import axios from "axios";
export const MAINURL = "https://www.iyrajewels.com/";

//  API for login...
export const drfLogin = async (body) => {
  return await axios.post(`${MAINURL}Hospital/login/`, body);
};



//  for reset password...
export const drfForgetPassword = async (body) => {
    return await axios.post(`${MAINURL}Hospital/send-reset-password-email/`, body);
  };


//password changed 2 param.. facing issue....

  export const drfPasswordReset = async (body) => {
    return await axios.post(`${MAINURL}Hospital/reset-password/`, body);
  };




export const drfLogout = async (body) => {
    return await axios.post(`${MAINURL}/Hospital/logout/`, body);
  };



  //add hospital 
  
export const drfRegister = async (body) => {
  return await axios.post(`${MAINURL}Hospital/add/`, body);
};



export const drfGet = async (body) => {
  return await axios.get(`${MAINURL}Hospital/list/`, body);
};
export const drfUpdate = async (body) => {
  return await axios.put(`${MAINURL}Hospital/update/`, body);
};

export const drfDelete = async (id) => {
        const response = await axios.delete(`${MAINURL}Hospital/delete/${id}`);
       
};


export const drfFeedback = async (body) => {
  return await axios.post(`${MAINURL}Feedback/add/`, body);
};




// for auth...


// API for adding bed 



export const drfAddBed = async (body) => {
  return await axios.post(`${MAINURL}Bed/register/`, body);
};

// API for get bed data by client id



export const drfBedData = async (body) => {
  return await axios.post(`${MAINURL}Bed/detail/`, body);
};

// API for update the bed 

export const drfUpdateBed = async (body) => {
  return await axios.put(`${MAINURL}Bed/Updated/`, body);
};
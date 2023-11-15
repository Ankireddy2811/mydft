import axios from "axios";
// export const MAINURL = "https://www.iyrajewels.com/";

export const MAINURL = "http://194.163.40.231:8000/";
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

// Hospital/change-password/

export const drfProfilePasswordChange = async (formData,headerPart) => {
  return await axios.post(`${MAINURL}Hospital/change-password/`,formData,headerPart);
};

  //add hospital 
  
export const drfRegister = async (body) => {
  return await axios.post(`${MAINURL}Hospital/add/`, body);
};




export const drfUpdate = async (body) => {
  return await axios.put(`${MAINURL}Hospital/update/`, body);
};

export const drfDelete = async (id,headerPart) => {
  return await axios.delete(`${MAINURL}Hospital/delete/${id}/`,headerPart);
       
};


export const drfFeedback = async (formData,headerPart) => {
  return await axios.post(`${MAINURL}Feedback/add/`,formData,headerPart);
};

export const drfGetFeedback = async (body) => {
  return await axios.get(`${MAINURL}Feedback/list/`, body);
};




// for auth...

// -----------------------------------Appointment API'S-----------------------------------------------

// API for add the Appointment

export const drfAddAppointment = async (formData,headerPart) => {
  return await axios.post(`${MAINURL}Appointment/book/`, formData,headerPart);
};

// API for get Appointment Details 



export const drfGetAppointmentDetails = async (formData,headersPart) => {
  return await axios.post(`${MAINURL}Patient/details/`, formData,headersPart);
};

// API for get DoctorSuggestions Details 



export const drfGetDoctorSuggestionsDetails = async (formData,headersPart) => {
  return await axios.post(`${MAINURL}Doctor/details/`, formData,headersPart);
};

// API for get All Appointment Details 



export const drfGetAllAppointmentDetails = async (formData,headersPart) => {
  return await axios.post(`${MAINURL}Appointment/All/`, formData,headersPart);
};

// API for update the Appointment

export const drfUpdateAppointment = async (formData,headersPart) => {
  return await axios.put(`${MAINURL}Appointment/updateBy/`, formData,headersPart);
};

// API for delete the Appointment 

export const drfDeleteAppointment = async (formData,headersPart) => {
  return await axios.post(`${MAINURL}Appointment/deleteBy/`, formData,headersPart);
};
// -----------------------------------------------END----------------------------------------------




// -----------------------------------Bed API'S-----------------------------------------------

// API for add the Bed

export const drfAddBed = async (formData,headerPart) => {
  return await axios.post(`${MAINURL}Bed/register/`, formData,headerPart);
};

// API for get bed Details 



export const drfGetBedDetails = async (formData,headersPart) => {
  return await axios.post(`${MAINURL}Bed/detail/`, formData,headersPart);
};


// API for Get the Specific Bed Details

export const drfGetSpecificBedDetails = async (formData,headerPart) => {
  return await axios.post(`${MAINURL}Bed/details-By/`, formData,headerPart);
};


// API for update the bed 

export const drfUpdateBed = async (formData,headersPart) => {
  return await axios.put(`${MAINURL}Bed/Updated/`, formData,headersPart);
};

// API for delete the bed 

export const drfDeleteBed = async (formData,headersPart) => {
  return await axios.post(`${MAINURL}Bed/deleteBy/`, formData,headersPart);
};
// -----------------------------------------------END----------------------------------------------

// =======================================  Department API'S ========================================

// API for add the Department 

export const drfAddDepartment = async (formData,headerPart) => {
  return await axios.post(`${MAINURL}Department/add/`, formData,headerPart);
};


// API for Get the Department Details

export const drfGetDepartmentDetails = async (formData,headerPart) => {
  return await axios.post(`${MAINURL}Department/details/`, formData,headerPart);
};


// API for update the Department Details

export const drfUpdateDepartment = async (formData,headerPart) => {
  return await axios.put(`${MAINURL}Department/Updated/`, formData,headerPart);
};

// API for Delete the Department Details

export const drfDeleteDepartment = async (formData,headerPart) => {
  return await axios.post(`${MAINURL}Department/deleteBy/`, formData,headerPart);
};

// ================================= END ======================================


// =======================================  Doctor API'S ========================================

// API for add the Doctor 

export const drfAddDoctor = async (formData,headerPart) => {
  return await axios.post(`${MAINURL}Doctor/register/`, formData,headerPart);
};


// API for Get the Doctor Details

export const drfGetDoctorDetails = async (formData,headerPart) => {
  return await axios.post(`${MAINURL}Doctor/details/`, formData,headerPart);
};

// API for Get the Specific Doctor Details

export const drfGetSpecificDoctorDetails = async (formData,headerPart) => {
  return await axios.post(`${MAINURL}Doctor/details-By/`, formData,headerPart);
};

// API for update the Doctor Details

export const drfUpdateDoctor = async (formData,headerPart) => {
  return await axios.put(`${MAINURL}Doctor/Updated/`, formData,headerPart);
};

// API for Delete the Doctor Details

export const drfDeleteDoctor = async (formData,headerPart) => {
  return await axios.post(`${MAINURL}Doctor/deleteBy/`, formData,headerPart);
};

// ================================= END ======================================

// =======================================  Hospital API'S ========================================

// API for add the Hospital

export const drfAddHospital = async (formData,headerPart) => {
  return await axios.post(`${MAINURL}Hospital/add/`, formData,headerPart);
};


// API for Get the Hospital Details


export const drfGetHospitalDetails = async (body) => {
  return await axios.get(`${MAINURL}Hospital/list/`, body);
};

// API for Get the Hospital list by id

export const drfGetHospitalListById = async (client_id,headerPart) => {
  return await axios.get(`${MAINURL}Hospital/list/${client_id}`, headerPart);
};


// API for update the Hospital Details

export const drfUpdateHospital = async (client_id,formData,headerPart) => {
  return await axios.put(`${MAINURL}Hospital/update/${client_id}/`, formData,headerPart);
};

// API for Delete the Hospital Details

export const drfDeleteHospital = async (id,headerPart) => {
  return await axios.delete(`${MAINURL}Hospital/delete/${id}/`,headerPart);
       
};


// ================================= END ======================================



// =======================================  Invoice API'S ========================================

// API for add the Invoice 

export const drfAddInvoice = async (formData,headerPart) => {
  return await axios.post(`${MAINURL}Invoice/add/`, formData,headerPart);
};


// API for Get the Invoice Details

export const drfGetInvoiceDetails = async (formData,headerPart) => {
  return await axios.post(`${MAINURL}Invoice/details/`, formData,headerPart);
};

// API for Get the Specific Invoice Details

export const drfGetSpecificInvoiceDetails = async (formData,headerPart) => {
  return await axios.post(`${MAINURL}Invoice/details-By/`, formData,headerPart);
};


// API for update the Invoice Details

export const drfUpdateInvoice = async (formData,headerPart) => {
  return await axios.put(`${MAINURL}Invoice/Updated/`, formData,headerPart);
};

// API for Delete the Doctor Details

export const drfDeleteInvoice = async (formData,headerPart) => {
  return await axios.post(`${MAINURL}Invoice/delete-By/`, formData,headerPart);
};

// ================================= END ======================================


// =======================================  LabTest API'S ========================================

// API for add the LabTest

export const drfAddLabTest = async (formData,headerPart) => {
  return await axios.post(`${MAINURL}LabTest/add/`, formData,headerPart);
};


// API for Get the LabTest Details

export const drfGetLabTestDetails = async (formData,headerPart) => {
  return await axios.post(`${MAINURL}LabTest/details/`, formData,headerPart);
};

// API for Get the LabTest Details

export const drfGetSpecificLabTestDetails = async (formData,headerPart) => {
  return await axios.post(`${MAINURL}LabTest/details-By/`, formData,headerPart);
};


// API for update the LabTest Details

export const drfUpdateLabTest = async (formData,headerPart) => {
  return await axios.put(`${MAINURL}LabTest/Updated/`, formData,headerPart);
};

// API for Delete the LabTest Details

export const drfDeleteLabTest = async (formData,headerPart) => {
  return await axios.post(`${MAINURL}LabTest/delete-By/`, formData,headerPart);
};

// ================================= END ======================================

// =======================================  Medicine API'S ========================================

// API for add the Medicine

export const drfAddMedicine = async (formData,headerPart) => {
  return await axios.post(`${MAINURL}Medicine/register/`, formData,headerPart);
};


// API for Get the Medicine Details

export const drfGetMedicineDetails = async (formData,headerPart) => {
  return await axios.post(`${MAINURL}Medicine/details/`, formData,headerPart);
};

// API for Get the Specific Medicine Details

export const drfGetSpecificMedicineDetails = async (formData,headerPart) => {
  return await axios.post(`${MAINURL}Medicine/details-By/`, formData,headerPart);
};


// API for update the Medicine Details

export const drfUpdateMedicine = async (formData,headerPart) => {
  return await axios.put(`${MAINURL}Medicine/Updated/`, formData,headerPart);
};

// API for Delete the Medicine Details

export const drfDeleteMedicine = async (formData,headerPart) => {
  return await axios.post(`${MAINURL}Medicine/delete-By/`, formData,headerPart);
};

// ================================= END ======================================





// =======================================  Nurses API'S ========================================

// API for add the Nurses

export const drfAddNurses = async (formData,headerPart) => {
  return await axios.post(`${MAINURL}Nurse/add/`, formData,headerPart);
};


// API for Get the Nurses Details

export const drfGetNursesDetails = async (formData,headerPart) => {
  return await axios.post(`${MAINURL}Nurse/details/`, formData,headerPart);
};

// API for Get the Specific Nurse Details

export const drfGetSpecificNurseDetails = async (formData,headerPart) => {
  return await axios.post(`${MAINURL}Nurse/details-By/`, formData,headerPart);
};

// API for update the Nurses Details

export const drfUpdateNurses = async (formData,headerPart) => {
  return await axios.put(`${MAINURL}Nurse/Updated/`, formData,headerPart);
};

// API for Delete the Nurses Details

export const drfDeleteNurses = async (formData,headerPart) => {
  return await axios.post(`${MAINURL}Nurse/delete-By/`, formData,headerPart);
};

// ================================= END ======================================

// =======================================  Patient API'S ========================================

// API for add the Patient

export const drfAddPatient = async (formData,headerPart) => {
  return await axios.post(`${MAINURL}Patient/register/`, formData,headerPart);
};


// API for Get the Patient Details

export const drfGetPatientDetails = async (formData,headerPart) => {
  return await axios.post(`${MAINURL}Patient/details/`, formData,headerPart);
};

// API for Get the Specific Invoice Details

export const drfGetSpecificPatientDetails = async (formData,headerPart) => {
  return await axios.post(`${MAINURL}Patient/details-By/`, formData,headerPart);
};

// API for update the Patient Details

export const drfUpdatePatient = async (formData,headerPart) => {
  return await axios.put(`${MAINURL}Patient/Updated/`, formData,headerPart);
};

// API for Delete the Patient Details

export const drfDeletePatient = async (formData,headerPart) => {
  return await axios.post(`${MAINURL}Patient/deleteBy/`, formData,headerPart);
};

// ================================= END ======================================


// =======================================  Payment API'S ========================================

// API for add the Payment

export const drfAddPayment = async (formData,headerPart) => {
  return await axios.post(`${MAINURL}Payment/add/`, formData,headerPart);
};


// API for Get the Payment Details

export const drfGetPaymentDetails = async (formData,headerPart) => {
  return await axios.post(`${MAINURL}Payment/details/`, formData,headerPart);
};

// API for Get the Specific Payment Details

export const drfGetSpecificPaymentDetails = async (formData,headerPart) => {
  return await axios.post(`${MAINURL}Payment/details-By/`, formData,headerPart);
};

// API for update the Payment Details

export const drfUpdatePayment = async (formData,headerPart) => {
  return await axios.put(`${MAINURL}Payment/Updated/`, formData,headerPart);
};

// API for Delete the Payment Details

export const drfDeletePayment = async (formData,headerPart) => {
  return await axios.post(`${MAINURL}Payment/delete-By/`, formData,headerPart);
};

// ================================= END ======================================

// =======================================  PrescriptionDetail API'S ========================================

// API for add the PrescriptionDetail

export const drfAddPrescriptionDetail = async (formData,headerPart) => {
  return await axios.post(`${MAINURL}PrescriptionDetail/add/`, formData,headerPart);
};


// API for Get the PrescriptionDetail Details

export const drfGetPrescriptionDetail = async (formData,headerPart) => {
  return await axios.post(`${MAINURL}PrescriptionDetail/details/`, formData,headerPart);
};

// API for Get the Specific PrescriptionsDetail Details

export const drfGetSpecificPrescriptionDetails = async (formData,headerPart) => {
  return await axios.post(`${MAINURL}PrescriptionDetail/details-By/`, formData,headerPart);
};


// API for update the PrescriptionDetail

export const drfUpdatePrescriptionDetail = async (formData,headerPart) => {
  return await axios.put(`${MAINURL}PrescriptionDetail/Updated/`, formData,headerPart);
};

// API for Delete the PrescriptionDetail

export const drfDeletePrescriptionDetail = async (formData,headerPart) => {
  return await axios.post(`${MAINURL}PrescriptionDetail/delete-By/`, formData,headerPart);
};

// ================================= END ======================================


// =======================================  Prescriptions API'S ========================================

// API for add the Prescriptions

export const drfAddPrescriptions = async (formData,headerPart) => {
  return await axios.post(`${MAINURL}Prescription/add/`, formData,headerPart);
};


// API for Get the Prescriptions Details

export const drfGetPrescriptions = async (formData,headerPart) => {
  return await axios.post(`${MAINURL}Prescription/details/`, formData,headerPart);
};

// API for Get the Specific Prescriptions Details

export const drfGetSpecificPrescription = async (formData,headerPart) => {
  return await axios.post(`${MAINURL}Prescription/details-By/`, formData,headerPart);
};


// API for update the Prescriptions 

export const drfUpdatePrescriptions  = async (formData,headerPart) => {
  return await axios.put(`${MAINURL}Prescription/Updated/`, formData,headerPart);
};

// API for Delete the Prescriptions

export const drfDeletePrescriptions  = async (formData,headerPart) => {
  return await axios.post(`${MAINURL}Prescription/delete-By/`, formData,headerPart);
};

// ================================= END ======================================
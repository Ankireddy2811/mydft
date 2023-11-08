 import React, { useState,useEffect } from "react";
import Autosuggest from 'react-autosuggest';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS file for styling
import { Row, Col, Card, CardBody, Button, TabContent, TabPane, NavItem, NavLink, Label, Input, Form, Progress, Container } from "reactstrap";
import classnames from 'classnames';
import { Link } from "react-router-dom";
import Breadcrumbs from '../../components/Common/Breadcrumb'
import 'react-datepicker/dist/react-datepicker.css';
import { ClipLoader } from "react-spinners";
import { css } from "@emotion/react";
import {drfAddAppointment,drfGetAppointmentDetails, drfGetDoctorSuggestionsDetails} from "../../drfServer";

const override = css`
  display: block;
  margin: 0 auto;
`;

// Define custom styles for the Autosuggest component
const customStyles = {
  container: {
    position: "relative",
  },
  suggestionsContainer: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    maxHeight: "180px", // Adjust the maximum height as needed
    overflowY: "auto",
    border: "1px solid #ccc",
    backgroundColor: "white",
    zIndex: 1,

  },
  suggestion: {
    paddingTop: "10px",
    paddingBottom: "10px",
    paddingLeft: "0px",
    borderBottom: "1px solid #ccc",
    cursor: "pointer",
    listStyleType: 'none', // Remove bullet points

  },
  suggestionHighlighted: {
    backgroundColor: "#f0f0f0",
  },
};

const AddAppointment = (props)=>{
    const [formData,setFormData] = useState({
      breadcrumbItems: [
        { title: "Forms", link: "#" },
        { title: "Form Wizard", link: "#" },
      ],
      patientSuggestions: [], // Store patient suggestions from the API
      patientData: [],
      doctorSuggestions: [], // Store patient suggestions from the API
      doctorData: [],
      patient: '',
      selectedPatientId: '',
      selectedDoctorId: '',
      doctor: '',
      appointment_date: '',
      start_time: '',
      end_time: '',
      activeTab: 1,
      activeTabProgress: 1,
      progressValue: 25,
      client: "",
      client_id: "",
      access_token: "",
      isLoading: false, // Add isLoading state
    })
     



   useEffect(()=>{
    const fetchData = async()=>{
      const id = JSON.parse(localStorage.getItem('client_id'));
      const access = JSON.parse(localStorage.getItem('access_token'));
      if (id){
      setFormData(prevState=>({...prevState,client_id:id,access_token:access}));
    }
      
      await fetchPatientSuggestions();
      await fetchDoctorSuggestions();
    }
    fetchData();
  },[])
   

   

  const formatDate = (dateString) =>{
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Special handling for date_of_birth to format it correctly
    if (name === 'appointment_date') {
      const formattedDate = formatDate(value);
      setFormData(prevState=>({
        ...prevState,
        appointment_date: formattedDate,
      }));
    } else {
      setFormData(prevState=>({
        ...prevState,
        [name]: value,
      }));
    }
  };

  

  const validateCurrentTab = () => {
    const { activeTabProgress, patient, doctor, appointment_date, start_time, end_time } = formData;

    if (activeTabProgress === 1) {
      return !!patient; // Check if patient field is filled
    } else if (activeTabProgress === 2) {
      return !!doctor; // Check if doctor field is filled
    } else if (activeTabProgress === 3) {
      // Check if all fields in the appointment section are filled
      return !!appointment_date && !!start_time && !!end_time;
    }

    // If none of the conditions match, return true to allow progression.
    return true;
  }

  // Function to fetch patient suggestions from the API
  const fetchPatientSuggestions = async()=> {
    const { client_id,access_token } = formData;
    const headersPart = {
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${access_token}`,
      }
    }

    try {
      const response = await drfGetAppointmentDetails({ client_id }, headersPart);

      if (response.status === 200) {
        const data = response.data;
        const patientSuggestion = data.Data.map((result) => ({
          email: result.email,
          firstName: result.first_name,
          lastName: result.last_name,
          id: result.patient_id,
        }));

        setFormData(prevState=>({...prevState, patientData: patientSuggestion, patientSuggestions: patientSuggestion }));
      } else {
        console.error("Error:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  // Replace fetchDoctorSuggestions with Axios
  const fetchDoctorSuggestions = async()=> {
    const { client_id,access_token } = formData;
    const headersPart = {
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${access_token}`,
      }
    }

    try {
      const response = await drfGetDoctorSuggestionsDetails({ client_id }, headersPart);
      
      
      if (response.status === 200) {
        const data = response.data;
        const doctorSuggestion = data.Data.map((result) => ({
          email: result.email,
          firstName: result.first_name,
          lastName: result.last_name,
          id: result.doctor_id,
        }));

        setFormData(prevState=>({...prevState, doctorData: doctorSuggestion, doctorSuggestions: doctorSuggestion }));
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  // Function to handle changes in the patient input field
  //  handlePatientInputChange = (e, { newValue }) => {
  //   this.setState({ patient: newValue });
  // };
  const handlePatientInputChange = (e, { newValue }) => {
   
    setFormData(prevState=>({...prevState, patient: newValue }));

    // Check if the input is empty
    if (!newValue) {
      // Reset patientSuggestions to the original patientData when input is cleared
      setFormData(prevState=>({...prevState ,patientSuggestions: prevState.patientData }));
    } else {
      // Filter suggestions from the permanent patientData based on the input
      const suggestions = filterPatientData(newValue);
      setFormData(prevState=>({...prevState, patientSuggestions: suggestions }));
    }
  };
  
  const handleDoctorInputChange = (e, { newValue }) => {
    setFormData(prevState=>({ ...prevState,doctor: newValue }));

    // Check if the input is empty
    if (!newValue) {
      // Reset patientSuggestions to the original patientData when input is cleared
      setFormData(prevState=>({...prevState, doctorSuggestions:prevState.doctorData }));
    } else {
      // Filter suggestions from the permanent patientData based on the input
      const suggestions = filterDoctorData(newValue);
      setFormData(prevState=>({...prevState,doctorSuggestions: suggestions }));
    }
  };


  // Define a function to filter patientData based on user input
  const filterPatientData = (inputValue) => {
    const { patientData } = formData;
    const inputValueLower = inputValue.toLowerCase();

    return patientData.filter((suggestion) =>
      suggestion.email.toLowerCase().includes(inputValueLower) ||
      suggestion.firstName.toLowerCase().includes(inputValueLower) ||
      suggestion.lastName.toLowerCase().includes(inputValueLower) ||
      (suggestion.id?.toString() || '').includes(inputValueLower)
    );
  };

  const filterDoctorData = (inputValue) => {
    const { doctorData } = formData;
    const inputValueLower = inputValue.toLowerCase();

    return doctorData.filter((suggestion) =>
      suggestion.email.toLowerCase().includes(inputValueLower) ||
      suggestion.firstName.toLowerCase().includes(inputValueLower) ||
      suggestion.lastName.toLowerCase().includes(inputValueLower) ||
      (suggestion.id?.toString() || '').includes(inputValueLower)
    );
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    const { patient, doctor, appointment_date, start_time, end_time, client,access_token} = formData;
 

    const patientNumber = parseInt(patient, 10);
    const doctorNumber = parseInt(doctor, 10);

    const requestFormData = {
      patient: patientNumber,
      doctor: doctorNumber,
      appointment_date,
      start_time,
      end_time,
      client,
    };

    setFormData(prevState=>({ ...prevState,isLoading: true })); // Start loading

    const headersPart =  {
      headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${access_token}`
    }
  }

    try {
      const response = await drfAddAppointment(requestFormData,headersPart);

      const data = response.data;
      if (response.status === 200){
        props.history.replace("/appointments");
        toast.success(`Appointment booked successfully.`, {
        autoClose: 1000, // Duration in milliseconds (e.g., 3000ms = 3 seconds)
      });
      }
    } catch (error) {
      toast.error("Appointment booking failed"); // Use toast for error notification
    } finally {
      setFormData(prevState=>({ ...prevState,isLoading: false })); // Stop loading
    }
  }


 

  const toggleTab = (tab) =>{
    if (formData.activeTab !== tab) {
      if (tab >= 1 && tab <= 4) {
        setFormData(prevState=>({
          ...prevState,
          activeTab: tab
        }));
      }
    }
  }

  const toggleTabProgress = (tab) =>{
    if (tab > formData.activeTabProgress) { // Only validate when moving forward
      // Check if validation passes before changing the active tab
      if (validateCurrentTab()) {
        if (formData.activeTabProgress !== tab) {
          if (tab >= 1 && tab <= 4) {
            setFormData(prevState=>({
              ...prevState,
              activeTabProgress: tab
            }));

            if (tab === 1) { setFormData({ progressValue: 25 }) }
            if (tab === 2) { setFormData({ progressValue: 50 }) }
            if (tab === 3) { setFormData({ progressValue: 75 }) }
            if (tab === 4) { setFormData({ progressValue: 100 }) }
          }
        }
      }
    } else { // Allow moving back to previous tabs without validation
      if (formData.activeTabProgress !== tab) {
        if (tab >= 1 && tab <= 4) {
          setFormData(prevState=>({
            ...prevState,
            activeTabProgress: tab
          }));

          if (tab === 1) { setFormData({ progressValue: 25 }) }
          if (tab === 2) { setFormData({ progressValue: 50 }) }
          if (tab === 3) { setFormData({ progressValue: 75 }) }
          if (tab === 4) { setFormData({ progressValue: 100 }) }
        }
      }
    }
  }

  const getSuggestionValue = (suggestion) => {
    return `${suggestion.id} ${suggestion.firstName} ${suggestion.lastName}`;
  };

  const renderSuggestion = (suggestion) => (
    <div>
      {suggestion.id} {suggestion.firstName} {suggestion.lastName} ({suggestion.email})
    </div>
  );


 const onSuggestionsFetchRequested = ({ value }) => {
      setFormData(prevState=>({
       ...prevState,
      patientSuggestions: getSuggestions(value),
    }));
  };

  const onSuggestionsClearRequested = () => {
    setFormData(prevState=>({
      ...prevState,
      patientSuggestions: prevState.patientData, // Reset to the original patient data
    }));
  };

  const getSuggestions = (value) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    const { patientSuggestions }= formData;

    return inputLength === 0
      ? []
      : patientSuggestions.filter((suggestion) =>
        suggestion.email.toLowerCase().includes(inputValue) ||
        suggestion.firstName.toLowerCase().includes(inputValue) ||
        suggestion.lastName.toLowerCase().includes(inputValue) ||
        (suggestion.id?.toString() || '').includes(inputValue) // Use optional chaining and provide a default empty string
      );
  };


  const getDoctorSuggestionValue = (suggestion) => {
    return `${suggestion.id} ${suggestion.firstName} ${suggestion.lastName}`;
  };

  const renderDoctorSuggestion = (suggestion) => (
    <div

    >
      {suggestion.id} {suggestion.firstName} {suggestion.lastName} ({suggestion.email})
    </div>
  );


  const onDoctorSuggestionsFetchRequested = ({ value }) => {
    setFormData(prevState=>({
      ...prevState,
      doctorSuggestions: getDoctorSuggestions(value),
    }));
  };

  const onDoctorSuggestionsClearRequested = () => {
    setFormData(prevState=>({
      ...prevState,
      doctorSuggestions: prevState.doctorData, // Reset to the original patient data
    }));
  };

  const getDoctorSuggestions = (value) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    const { doctorSuggestions } = formData;

    return inputLength === 0
      ? []
      : doctorSuggestions.filter((suggestion) =>
        suggestion.email.toLowerCase().includes(inputValue) ||
        suggestion.firstName.toLowerCase().includes(inputValue) ||
        suggestion.lastName.toLowerCase().includes(inputValue) ||
        (suggestion.id?.toString() || '').includes(inputValue) // Use optional chaining and provide a default empty string
      );
  };


 
    const { patient, doctor, appointment_date, start_time, end_time, patientSuggestions, doctorSuggestions } = formData;

    return (
      <React.Fragment>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumbs title="ADD APPOINTMENT" breadcrumbItems={formData.breadcrumbItems} />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <div id="progrss-wizard" className="twitter-bs-wizard">
                      <ul className="twitter-bs-wizard-nav nav-justified nav nav-pills">
                        <NavItem>
                          <NavLink className={classnames({ active: formData.activeTabProgress === 1 })} onClick={() => {toggleTabProgress(1); }}>
                            <span className="step-number">01</span>
                            <span className="step-title">Patient Details</span>
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink className={classnames({ active: formData.activeTabProgress === 2 })} onClick={() => {toggleTabProgress(2); }}>
                            <span className="step-number">02</span>
                            <span className="step-title">Doctor Details</span>
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink className={classnames({ active: formData.activeTabProgress === 3 })} onClick={() => {toggleTabProgress(3); }}>
                            <span className="step-number">03</span>
                            <span className="step-title">Set Appointment</span>
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink className={classnames({ active: formData.activeTabProgress === 4 })} onClick={() => { toggleTabProgress(4); }}>
                            <span className="step-number">04</span>
                            <span className="step-title">Confirm Appointment</span>
                          </NavLink>
                        </NavItem>
                      </ul>

                      <div id="bar" className="mt-4">
                        <Progress color="success" striped animated value={formData.progressValue} />
                      </div>
                      <TabContent activeTab={formData.activeTabProgress} className="twitter-bs-wizard-tab-content">
                        <TabPane tabId={1}>
                          <Form>
                            <Row>
                              <Col lg="12">
                                <div className="mb-3">
                                  <Label className="form-label" htmlFor="basicpill-firstname-input1">Patient ID And Name</Label>
                                  <Autosuggest
                                    suggestions={patientSuggestions}
                                    onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                                    onSuggestionsClearRequested={onSuggestionsClearRequested}
                                    getSuggestionValue={getSuggestionValue}
                                    renderSuggestion={renderSuggestion}
                                    inputProps={{
                                      placeholder: 'Patient ID Name',
                                      value: patient,
                                      onChange:handlePatientInputChange,
                                      name: 'patient',
                                      className: 'form-control', // Apply Bootstrap form-control class here
                                      required: true,
                                    }}
                                    theme={customStyles} // Apply custom styles here

                                  />
                                </div>
                              </Col>
                            </Row>
                          </Form>
                        </TabPane>
                        <TabPane tabId={2}>
                          <div>
                            <Form>
                              <Row>
                                <Col lg="12">
                                  <div className="mb-3">
                                    <Label className="form-label" htmlFor="basicpill-pancard-input5">Doctor ID And Name </Label>
                                    <Autosuggest
                                      suggestions={doctorSuggestions}
                                      onSuggestionsFetchRequested={onDoctorSuggestionsFetchRequested}
                                      onSuggestionsClearRequested={onDoctorSuggestionsClearRequested}
                                      getSuggestionValue={getDoctorSuggestionValue}
                                      renderSuggestion={renderDoctorSuggestion}
                                      inputProps={{
                                        placeholder: 'Doctor ID Name',
                                        value: doctor,
                                        onChange: handleDoctorInputChange,
                                        name: 'doctor',
                                        className: 'form-control', // Apply Bootstrap form-control class here
                                        required: true,
                                      }}
                                      theme={customStyles} // Apply custom styles here

                                    />
                                  </div>
                                </Col>
                              </Row>
                            </Form>
                          </div>
                        </TabPane>
                        <TabPane tabId={3}>
                          <div>
                            <Form>
                              <Row>
                                <Col lg="4">
                                  <div className="mb-3 position-relative">
                                    <Label className="form-label" htmlFor="validationTooltip04">Appointment Date</Label>
                                    <input
                                      type="date"
                                      className="form-control"
                                      placeholderText="Appointment Date"
                                      name="appointment_date"
                                      value={appointment_date} // Use the formatted date
                                      onChange={handleChange}

                                      required
                                    />
                                    <div className="valid-tooltip">
                                      Looks good!
                                    </div>
                                  </div>
                                </Col>

                                <Col lg="4">
                                  <div className="mb-3">
                                    <Label className="form-label" htmlFor="basicpill-namecard-input11">Start Time</Label>
                                    <Input type="time" className="form-control" id="basicpill-namecard-input11" value={start_time} name="start_time" placeholder="Start Time" onChange={handleChange} required />
                                  </div>
                                </Col>
                                <Col lg="4">
                                  <div className="mb-3">
                                    <Label className="form-label" htmlFor="basicpill-namecard-input11">End Time</Label>
                                    <Input type="time" className="form-control" id="basicpill-namecard-input11" value={end_time} name="end_time" placeholder="End Time" onChange={handleChange} required />
                                  </div>
                                </Col>
                              </Row>
                            </Form>
                          </div>
                        </TabPane>
                        <TabPane tabId={4}>
                          <div className="row justify-content-center">
                            <Col lg="6">
                              <div className="text-center">
                                <div className="mb-4">
                                  <i className="mdi mdi-check-circle-outline text-success display-4" onClick={handleSubmit}></i>
                                </div>
                                {formData.isLoading ? (
                                  <ClipLoader color={"#1CBB8C"} loading={formData.isLoading} css={override} size={40} />
                                ) : (
                                  <div>
                                    <Button color="primary" onClick={handleSubmit}>Confirm Details</Button>
                                  </div>
                                )}
                              </div>
                            </Col>
                          </div>
                        </TabPane>
                      </TabContent>
                      <ul className="pager wizard twitter-bs-wizard-pager-link">
                        <li className={formData.activeTabProgress === 1 ? "previous disabled" : "previous"}><Link to="#" onClick={() => {toggleTabProgress(formData.activeTabProgress - 1); }}>Previous</Link></li>
                        <li className={formData.activeTabProgress === 4 ? "next disabled" : "next"}><Link to="#" onClick={() => { toggleTabProgress(formData.activeTabProgress + 1); }}>Next</Link></li>
                      </ul>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </React.Fragment>
    );
  }


export default AddAppointment; 



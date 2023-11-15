import React, { useState, useEffect } from "react";
import Autosuggest from 'react-autosuggest';
import { toast } from 'react-toastify';
// import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { Row, Col, Card, CardBody, Button, TabContent, TabPane, NavItem, NavLink, Label, Input, Form, Progress, Container } from "reactstrap";
import classnames from 'classnames';
import { Link } from "react-router-dom";
import Breadcrumbs from '../../components/Common/Breadcrumb';
// import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ClipLoader } from "react-spinners";
import { css } from "@emotion/react";
import { drfAddAppointment, drfGetAppointmentDetails, drfGetDoctorSuggestionsDetails } from "../../drfServer";

const override = css`
  display: block;
  margin: 0 auto;
`;

const customStyles = {
  container: {
    position: "relative",
  },
  suggestionsContainer: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    maxHeight: "180px",
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
    listStyleType: 'none',
  },
  suggestionHighlighted: {
    backgroundColor: "#f0f0f0",
  },
};

const AddAppointment = (props) => {
  const [breadcrumbItems] = useState([
    { title: "Forms", link: "#" },
    { title: "Form Wizard", link: "#" },
  ]);
  const [patientSuggestions, setPatientSuggestions] = useState([]);
  const [patientData, setPatientData] = useState([]);
  const [doctorSuggestions, setDoctorSuggestions] = useState([]);
  const [doctorData, setDoctorData] = useState([]);
  const [patient, setPatient] = useState('');
  // const [selectedPatientId, setSelectedPatientId] = useState('');
  // const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [doctor, setDoctor] = useState('');
  const [appointment_date, setAppointmentDate] = useState('');
  const [start_time, setStartTime] = useState('');
  const [end_time, setEndTime] = useState('');
  const [activeTab, setActiveTab] = useState(1);
  const [activeTabProgress, setActiveTabProgress] = useState(1);
  const [progressValue, setProgressValue] = useState(25);
  const [client, setClient] = useState("");
  const [client_id, setClientId] = useState("");
  const [access_token, setAccessToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const id = JSON.parse(localStorage.getItem('client_id'));

      if (id) {
        setAccessToken(JSON.parse(localStorage.getItem('access_token')));
        setClientId(id);
        setClient(id);

        console.log("hiii" + access_token);

        await fetchPatientSuggestions();
        await fetchDoctorSuggestions();
      }
    };

    fetchData();
  }, [access_token]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'appointment_date') {
      const formattedDate = formatDate(value);
      setAppointmentDate(formattedDate);
    } 
    else if (name === 'start_time') {
      setStartTime(value);
    } else if (name === 'end_time') {
      setEndTime(value);
    }
  };

  const validateCurrentTab = () => {
    
    if (activeTabProgress === 1) {
      return !!patient;
    } else if (activeTabProgress === 2) {
      return !!doctor;
    } else if (activeTabProgress === 3) {
      return !!appointment_date && !!start_time && !!end_time;
    }

    return true;
  };

  const fetchPatientSuggestions = async () => {
    const headersPart = {
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${access_token}`,
      }
    };

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

        setPatientData(patientSuggestion);
        setPatientSuggestions(patientSuggestion);
      } else {
        console.error("Error:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchDoctorSuggestions = async () => {
    const headersPart = {
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${access_token}`,
      }
    };

    try {
      const response = await drfGetDoctorSuggestionsDetails({ client_id }, headersPart);

      const data = response.data;
      if (response.status === 200) {
        const doctorSuggestion = data.Data.map((result) => ({
          email: result.email,
          firstName: result.first_name,
          lastName: result.last_name,
          id: result.doctor_id,
        }));

        setDoctorData(doctorSuggestion);
        setDoctorSuggestions(doctorSuggestion);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handlePatientInputChange = (e, { newValue }) => {
    setPatient(newValue);

    if (!newValue) {
      setPatientSuggestions(patientData);
    } else {
      const suggestions = filterPatientData(newValue);
      setPatientSuggestions(suggestions);
    }
  };

  const handleDoctorInputChange = (e, { newValue }) => {
    setDoctor(newValue);

    if (!newValue) {
      setDoctorSuggestions(doctorData);
    } else {
      const suggestions = filterDoctorData(newValue);
      setDoctorSuggestions(suggestions);
    }
  };

  const filterPatientData = (inputValue) => {
    const inputValueLower = inputValue.toLowerCase();

    return patientData.filter((suggestion) =>
      suggestion.email.toLowerCase().includes(inputValueLower) ||
      suggestion.firstName.toLowerCase().includes(inputValueLower) ||
      suggestion.lastName.toLowerCase().includes(inputValueLower) ||
      (suggestion.id?.toString() || '').includes(inputValueLower)
    );
  };

  const filterDoctorData = (inputValue) => {
    const inputValueLower = inputValue.toLowerCase();

    return doctorData.filter((suggestion) =>
      suggestion.email.toLowerCase().includes(inputValueLower) ||
      suggestion.firstName.toLowerCase().includes(inputValueLower) ||
      suggestion.lastName.toLowerCase().includes(inputValueLower) ||
      (suggestion.id?.toString() || '').includes(inputValueLower)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // const { patient, doctor, appointment_date, start_time, end_time, client } = formState;
    const acces = access_token;

    const patientNumber = parseInt(patient, 10);
    const doctorNumber = parseInt(doctor, 10);

    const formData = {
      patient: patientNumber,
      doctor: doctorNumber,
      appointment_date,
      start_time,
      end_time,
      client,
    };

    setIsLoading(true);

    const headersPart = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${acces}`
      }
    };

    try {
      const response = await drfAddAppointment(formData, headersPart);

      const data = response.data;
      console.log(data);

      // Handle success logic
      toast.success(`Appointment booked successfully.`, {
        autoClose: 1000,
      });

      // Redirect to the appointments page
      // You might need to replace this with your actual route
      props.history.push("/appointments");
    } catch (error) {
      toast.error("Appointment booking failed");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      if (tab >= 1 && tab <= 4) {
        setActiveTab(tab);
      }
    }
  };

  const toggleTabProgress = (tab) => {
    if (tab > activeTabProgress) {
      if (validateCurrentTab()) {
        if (activeTabProgress !== tab) {
          if (tab >= 1 && tab <= 4) {
            setActiveTabProgress(tab);

            if (tab === 1) { setProgressValue(25) }
            if (tab === 2) { setProgressValue(50) }
            if (tab === 3) { setProgressValue(75) }
            if (tab === 4) { setProgressValue(100) }
          }
        }
      }
    } else {
      if (activeTabProgress !== tab) {
        if (tab >= 1 && tab <= 4) {
          setActiveTabProgress(tab);

          if (tab === 1) { setProgressValue(25) }
          if (tab === 2) { setProgressValue(50) }
          if (tab === 3) { setProgressValue(75) }
          if (tab === 4) { setProgressValue(100) }
        }
      }
    }
  };

  const getSuggestionValue = (suggestion) => {
    return `${suggestion.id} ${suggestion.firstName} ${suggestion.lastName}`;
  };

  const renderSuggestion = (suggestion) => (
    <div>
      {suggestion.id} {suggestion.firstName} {suggestion.lastName} ({suggestion.email})
    </div>
  );

  const onSuggestionsFetchRequested = ({ value }) => {
    setPatientSuggestions(getSuggestions(value));
  };

  const onSuggestionsClearRequested = () => {
    setPatientSuggestions(patientData);
  };

  const getSuggestions = (value) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0
      ? []
      : patientSuggestions.filter((suggestion) =>
        suggestion.email.toLowerCase().includes(inputValue) ||
        suggestion.firstName.toLowerCase().includes(inputValue) ||
        suggestion.lastName.toLowerCase().includes(inputValue) ||
        (suggestion.id?.toString() || '').includes(inputValue)
      );
  };

  const getDoctorSuggestionValue = (suggestion) => {
    return `${suggestion.id} ${suggestion.firstName} ${suggestion.lastName}`;
  };

  const renderDoctorSuggestion = (suggestion) => (
    <div>
      {suggestion.id} {suggestion.firstName} {suggestion.lastName} ({suggestion.email})
    </div>
  );

  const onDoctorSuggestionsFetchRequested = ({ value }) => {
    setDoctorSuggestions(getDoctorSuggestions(value));
  };

  const onDoctorSuggestionsClearRequested = () => {
    setDoctorSuggestions(doctorData);
  };

  const getDoctorSuggestions = (value) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0
      ? []
      : doctorSuggestions.filter((suggestion) =>
        suggestion.email.toLowerCase().includes(inputValue) ||
        suggestion.firstName.toLowerCase().includes(inputValue) ||
        suggestion.lastName.toLowerCase().includes(inputValue) ||
        (suggestion.id?.toString() || '').includes(inputValue)
      );
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="ADD APPOINTMENT" breadcrumbItems={breadcrumbItems} />
          <Row>
            <Col lg="12">
              <Card>
                <CardBody>
                  <div id="progrss-wizard" className="twitter-bs-wizard">
                    <ul className="twitter-bs-wizard-nav nav-justified nav nav-pills">
                      <NavItem>
                        <NavLink className={classnames({ active:activeTabProgress === 1 })} onClick={() => { toggleTabProgress(1); }}>
                          <span className="step-number">01</span>
                          <span className="step-title">Patient Details</span>
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink className={classnames({ active:activeTabProgress === 2 })} onClick={() => {toggleTabProgress(2); }}>
                          <span className="step-number">02</span>
                          <span className="step-title">Doctor Details</span>
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink className={classnames({ active: activeTabProgress === 3 })} onClick={() => { toggleTabProgress(3); }}>
                          <span className="step-number">03</span>
                          <span className="step-title">Set Appointment</span>
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink className={classnames({ active: activeTabProgress === 4 })} onClick={() => {toggleTabProgress(4); }}>
                          <span className="step-number">04</span>
                          <span className="step-title">Confirm Appointment</span>
                        </NavLink>
                      </NavItem>
                    </ul>

                    <div id="bar" className="mt-4">
                      <Progress color="success" striped animated value={progressValue} />
                    </div>
                    <TabContent activeTab={activeTabProgress} className="twitter-bs-wizard-tab-content">
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
                                    onChange: handlePatientInputChange,
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
                              {isLoading ? (
                                <ClipLoader color={"#1CBB8C"} loading={isLoading} css={override} size={40} />
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
                      <li className={activeTabProgress === 1 ? "previous disabled" : "previous"}><Link to="#" onClick={() => { toggleTabProgress(activeTabProgress - 1); }}>Previous</Link></li>
                      <li className={activeTabProgress === 4 ? "next disabled" : "next"}><Link to="#" onClick={() => { toggleTabProgress(activeTabProgress + 1); }}>Next</Link></li>
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



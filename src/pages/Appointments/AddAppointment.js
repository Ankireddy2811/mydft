import React, { Component } from "react";
import Autosuggest from 'react-autosuggest';
import { toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS file for styling
import { Row, Col, Card, CardBody, Button, TabContent, TabPane, NavItem, NavLink, Label, Input, Form, Progress, Container } from "reactstrap";
import classnames from 'classnames';
import { Link } from "react-router-dom";
import Breadcrumbs from '../../components/Common/Breadcrumb';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ClipLoader } from "react-spinners";
import { css } from "@emotion/react";

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
class AddAppointment extends Component {
  constructor(props) {
    super(props);
    this.state = {
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

    };
  }

  async componentDidMount() {
    // Load client_id from local storage
    const id = JSON.parse(localStorage.getItem('client_id'));
    //const access = JSON.parse(localStorage.getItem('access_token'));

    if (id) {
      // Set client_id and client in the state using a single setState call
      await new Promise((resolve) => {
        this.setState({ access_token: JSON.parse(localStorage.getItem('access_token')) });

        this.setState({ client_id: id, client: id }, resolve);
      });

      // After setting the state, fetch data as needed
      console.log("hiii" + this.state.access_token);

      await this.fetchPatientSuggestions();
      await this.fetchDoctorSuggestions();
    }
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  handleChange = (e) => {
    const { name, value } = e.target;

    // Special handling for date_of_birth to format it correctly
    if (name === 'appointment_date') {
      const formattedDate = this.formatDate(value);
      this.setState({
        appointment_date: formattedDate,
      });
    } else {
      this.setState({
        [name]: value,
      });
    }
  };


  validateCurrentTab = () => {
    const { activeTabProgress, patient, doctor, appointment_date, start_time, end_time } = this.state;

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
  async fetchPatientSuggestions() {
    const { client_id } = this.state;

    try {
      const response = await axios.post(`/Patient/details/`, { client_id }, {
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${this.state.access_token}`,
        }
      });

      if (response.status === 200) {
        const data = response.data;
        const patientSuggestion = data.Data.map((result) => ({
          email: result.email,
          firstName: result.first_name,
          lastName: result.last_name,
          id: result.patient_id,
        }));

        this.setState({ patientData: patientSuggestion, patientSuggestions: patientSuggestion });
      } else {
        console.error("Error:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  // Replace fetchDoctorSuggestions with Axios
  async fetchDoctorSuggestions() {
    const { client_id } = this.state;

    try {
      const response = await axios.post(`/Doctor/details/`, { client_id }, {
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${this.state.access_token}`,
        }
      });

      const data = response.data;
      if (response.status === 200) {
        const doctorSuggestion = data.Data.map((result) => ({
          email: result.email,
          firstName: result.first_name,
          lastName: result.last_name,
          id: result.doctor_id,
        }));

        this.setState({ doctorData: doctorSuggestion, doctorSuggestions: doctorSuggestion });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  // Function to handle changes in the patient input field
  //  handlePatientInputChange = (e, { newValue }) => {
  //   this.setState({ patient: newValue });
  // };
  handlePatientInputChange = (e, { newValue }) => {
    this.setState({ patient: newValue });

    // Check if the input is empty
    if (!newValue) {
      // Reset patientSuggestions to the original patientData when input is cleared
      this.setState({ patientSuggestions: this.state.patientData });
    } else {
      // Filter suggestions from the permanent patientData based on the input
      const suggestions = this.filterPatientData(newValue);
      this.setState({ patientSuggestions: suggestions });
    }
  };
  handleDoctorInputChange = (e, { newValue }) => {
    this.setState({ doctor: newValue });

    // Check if the input is empty
    if (!newValue) {
      // Reset patientSuggestions to the original patientData when input is cleared
      this.setState({ doctorSuggestions: this.state.doctorData });
    } else {
      // Filter suggestions from the permanent patientData based on the input
      const suggestions = this.filterDoctorData(newValue);
      this.setState({ doctorSuggestions: suggestions });
    }
  };


  // Define a function to filter patientData based on user input
  filterPatientData = (inputValue) => {
    const { patientData } = this.state;
    const inputValueLower = inputValue.toLowerCase();

    return patientData.filter((suggestion) =>
      suggestion.email.toLowerCase().includes(inputValueLower) ||
      suggestion.firstName.toLowerCase().includes(inputValueLower) ||
      suggestion.lastName.toLowerCase().includes(inputValueLower) ||
      (suggestion.id?.toString() || '').includes(inputValueLower)
    );
  };
  filterDoctorData = (inputValue) => {
    const { doctorData } = this.state;
    const inputValueLower = inputValue.toLowerCase();

    return doctorData.filter((suggestion) =>
      suggestion.email.toLowerCase().includes(inputValueLower) ||
      suggestion.firstName.toLowerCase().includes(inputValueLower) ||
      suggestion.lastName.toLowerCase().includes(inputValueLower) ||
      (suggestion.id?.toString() || '').includes(inputValueLower)
    );
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { patient, doctor, appointment_date, start_time, end_time, client } = this.state;
    const acces = this.state.access_token;

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

    this.setState({ isLoading: true }); // Start loading

    try {
      const response = axios.post(`/Appointment/book/`, formData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${acces}`
        }
      });

      const data = response.data;


      this.props.history.push("/appointments");
      toast.success(`Appointment booked successfully.`, {
        autoClose: 1000, // Duration in milliseconds (e.g., 3000ms = 3 seconds)
      });


    } catch (error) {
      toast.error("Appointment booking failed"); // Use toast for error notification
    } finally {
      this.setState({ isLoading: false }); // Stop loading
    }
  }


  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  toggleTab(tab) {
    if (this.state.activeTab !== tab) {
      if (tab >= 1 && tab <= 4) {
        this.setState({
          activeTab: tab
        });
      }
    }
  }

  toggleTabProgress(tab) {
    if (tab > this.state.activeTabProgress) { // Only validate when moving forward
      // Check if validation passes before changing the active tab
      if (this.validateCurrentTab()) {
        if (this.state.activeTabProgress !== tab) {
          if (tab >= 1 && tab <= 4) {
            this.setState({
              activeTabProgress: tab
            });

            if (tab === 1) { this.setState({ progressValue: 25 }) }
            if (tab === 2) { this.setState({ progressValue: 50 }) }
            if (tab === 3) { this.setState({ progressValue: 75 }) }
            if (tab === 4) { this.setState({ progressValue: 100 }) }
          }
        }
      }
    } else { // Allow moving back to previous tabs without validation
      if (this.state.activeTabProgress !== tab) {
        if (tab >= 1 && tab <= 4) {
          this.setState({
            activeTabProgress: tab
          });

          if (tab === 1) { this.setState({ progressValue: 25 }) }
          if (tab === 2) { this.setState({ progressValue: 50 }) }
          if (tab === 3) { this.setState({ progressValue: 75 }) }
          if (tab === 4) { this.setState({ progressValue: 100 }) }
        }
      }
    }
  }

  getSuggestionValue = (suggestion) => {
    return `${suggestion.id} ${suggestion.firstName} ${suggestion.lastName}`;
  };

  renderSuggestion = (suggestion) => (
    <div>
      {suggestion.id} {suggestion.firstName} {suggestion.lastName} ({suggestion.email})
    </div>
  );


  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      patientSuggestions: this.getSuggestions(value),
    });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      patientSuggestions: this.state.patientData, // Reset to the original patient data
    });
  };
  getSuggestions = (value) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    const { patientSuggestions } = this.state;

    return inputLength === 0
      ? []
      : patientSuggestions.filter((suggestion) =>
        suggestion.email.toLowerCase().includes(inputValue) ||
        suggestion.firstName.toLowerCase().includes(inputValue) ||
        suggestion.lastName.toLowerCase().includes(inputValue) ||
        (suggestion.id?.toString() || '').includes(inputValue) // Use optional chaining and provide a default empty string
      );
  };


  getDoctorSuggestionValue = (suggestion) => {
    return `${suggestion.id} ${suggestion.firstName} ${suggestion.lastName}`;
  };

  renderDoctorSuggestion = (suggestion) => (
    <div

    >
      {suggestion.id} {suggestion.firstName} {suggestion.lastName} ({suggestion.email})
    </div>
  );


  onDoctorSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      doctorSuggestions: this.getDoctorSuggestions(value),
    });
  };

  onDoctorSuggestionsClearRequested = () => {
    this.setState({
      doctorSuggestions: this.state.doctorData, // Reset to the original patient data
    });
  };
  getDoctorSuggestions = (value) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    const { doctorSuggestions } = this.state;

    return inputLength === 0
      ? []
      : doctorSuggestions.filter((suggestion) =>
        suggestion.email.toLowerCase().includes(inputValue) ||
        suggestion.firstName.toLowerCase().includes(inputValue) ||
        suggestion.lastName.toLowerCase().includes(inputValue) ||
        (suggestion.id?.toString() || '').includes(inputValue) // Use optional chaining and provide a default empty string
      );
  };


  render() {
    const { patient, doctor, appointment_date, start_time, end_time, patientSuggestions, doctorSuggestions } = this.state;

    return (
      <React.Fragment>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumbs title="ADD APPOINTMENT" breadcrumbItems={this.state.breadcrumbItems} />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <div id="progrss-wizard" className="twitter-bs-wizard">
                      <ul className="twitter-bs-wizard-nav nav-justified nav nav-pills">
                        <NavItem>
                          <NavLink className={classnames({ active: this.state.activeTabProgress === 1 })} onClick={() => { this.toggleTabProgress(1); }}>
                            <span className="step-number">01</span>
                            <span className="step-title">Patient Details</span>
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink className={classnames({ active: this.state.activeTabProgress === 2 })} onClick={() => { this.toggleTabProgress(2); }}>
                            <span className="step-number">02</span>
                            <span className="step-title">Doctor Details</span>
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink className={classnames({ active: this.state.activeTabProgress === 3 })} onClick={() => { this.toggleTabProgress(3); }}>
                            <span className="step-number">03</span>
                            <span className="step-title">Set Appointment</span>
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink className={classnames({ active: this.state.activeTabProgress === 4 })} onClick={() => { this.toggleTabProgress(4); }}>
                            <span className="step-number">04</span>
                            <span className="step-title">Confirm Appointment</span>
                          </NavLink>
                        </NavItem>
                      </ul>

                      <div id="bar" className="mt-4">
                        <Progress color="success" striped animated value={this.state.progressValue} />
                      </div>
                      <TabContent activeTab={this.state.activeTabProgress} className="twitter-bs-wizard-tab-content">
                        <TabPane tabId={1}>
                          <Form>
                            <Row>
                              <Col lg="12">
                                <div className="mb-3">
                                  <Label className="form-label" htmlFor="basicpill-firstname-input1">Patient ID And Name</Label>
                                  <Autosuggest
                                    suggestions={patientSuggestions}
                                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                                    onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                                    getSuggestionValue={this.getSuggestionValue}
                                    renderSuggestion={this.renderSuggestion}
                                    inputProps={{
                                      placeholder: 'Patient ID Name',
                                      value: patient,
                                      onChange: this.handlePatientInputChange,
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
                                      onSuggestionsFetchRequested={this.onDoctorSuggestionsFetchRequested}
                                      onSuggestionsClearRequested={this.onDoctorSuggestionsClearRequested}
                                      getSuggestionValue={this.getDoctorSuggestionValue}
                                      renderSuggestion={this.renderDoctorSuggestion}
                                      inputProps={{
                                        placeholder: 'Doctor ID Name',
                                        value: doctor,
                                        onChange: this.handleDoctorInputChange,
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
                                      onChange={this.handleChange}

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
                                    <Input type="time" className="form-control" id="basicpill-namecard-input11" value={start_time} name="start_time" placeholder="Start Time" onChange={this.handleChange} required />
                                  </div>
                                </Col>
                                <Col lg="4">
                                  <div className="mb-3">
                                    <Label className="form-label" htmlFor="basicpill-namecard-input11">End Time</Label>
                                    <Input type="time" className="form-control" id="basicpill-namecard-input11" value={end_time} name="end_time" placeholder="End Time" onChange={this.handleChange} required />
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
                                  <i className="mdi mdi-check-circle-outline text-success display-4" onClick={this.handleSubmit}></i>
                                </div>
                                {this.state.isLoading ? (
                                  <ClipLoader color={"#1CBB8C"} loading={this.state.isLoading} css={override} size={40} />
                                ) : (
                                  <div>
                                    <Button color="primary" onClick={this.handleSubmit}>Confirm Details</Button>
                                  </div>
                                )}
                              </div>
                            </Col>
                          </div>
                        </TabPane>
                      </TabContent>
                      <ul className="pager wizard twitter-bs-wizard-pager-link">
                        <li className={this.state.activeTabProgress === 1 ? "previous disabled" : "previous"}><Link to="#" onClick={() => { this.toggleTabProgress(this.state.activeTabProgress - 1); }}>Previous</Link></li>
                        <li className={this.state.activeTabProgress === 4 ? "next disabled" : "next"}><Link to="#" onClick={() => { this.toggleTabProgress(this.state.activeTabProgress + 1); }}>Next</Link></li>
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
}

export default AddAppointment;
import React, { Component } from "react";
import { Row, Col, Card, CardBody, FormGroup, Button, Label, Input, Container, InputGroup, Form } from "reactstrap";
import { toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS file for styling
import { withRouter } from 'react-router-dom';

//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';
class EditAppointment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      breadcrumbItems: [
        { title: "Forms", link: "#" },
        { title: "Form Mask", link: "#" },
      ],
      appointment: this.props.location.state.appointment,
      patient: this.props.location.state.appointment.patient_id,
      doctor: this.props.location.state.appointment.doctor_id,
      appointment_date: this.props.location.state.appointment.appointment_date,
      start_time: this.props.location.state.appointment.start_time,
      end_time: this.props.location.state.appointment.end_time,
      appointment_id: this.props.location.state.appointment.appointment_id,
      client_id: "",
      access_token: "",
    };
  }
  componentDidMount() {
    // Load client_id from local storage and set it in the state
    const access = JSON.parse(localStorage.getItem('access_token'));
    const id = JSON.parse(localStorage.getItem('client_id'));
    if (access) {
      this.setState({ access_token: access });
      // console.log("hello" + this.state.access_token);
      this.setState({ client_id: id });
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
    if (name === 'date_of_birth') {
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




  handleSubmit = async (e) => {
    e.preventDefault();
    const {
      patient,
      doctor,
      appointment_date,
      start_time,
      end_time,
      appointment_id,
      client_id,
      access_token,
    } = this.state;

    const formData = {
      client_id,
      appointment_id,
      patient,
      doctor,
      appointment_date,
      start_time,
      end_time,
    };

    try {
      const response = await axios.put(`/Appointment/updateBy/`, formData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`,
        },
      });

      const data = response.data;

      if (data.message) {
        toast.success(`${data.message}`, {
          autoClose: 1000, // Duration in milliseconds (e.g., 3000ms = 3 seconds)
        }); this.props.history.push('/appointments'); // Assuming "/appointments" is the route for the appointments page
      } else {
        toast.error(data.message || "An error occurred while processing your request.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while processing your request.");
    }
  };

  render() {
    const {
      patient,
      doctor,
      appointment_date,
      start_time,
      end_time,

    } = this.state;
    return (
      <React.Fragment>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumbs title="Edit Appointment" breadcrumbItems={this.state.breadcrumbItems} />
            <Row>
              <Col lg={12}>
                <Card>
                  <CardBody>
                    <Form className="needs-validation" method="post" id="tooltipForm" onSubmit={this.handleSubmit}>
                      <Row>
                        <Col md="4">
                          <div className="mb-3 position-relative">
                            <Label className="form-label" htmlFor="validationTooltip01">Patient ID</Label>
                            <Input type="text" className="form-control" id="validationTooltip01" value={patient} name="patient" placeholder="Patient ID" onChange={this.handleChange} />

                            <div className="valid-tooltip">
                              Looks good!
                            </div>
                          </div>
                        </Col>
                        <Col md="4">
                          <div className="mb-3 position-relative">
                            <Label className="form-label" htmlFor="validationTooltip01">Doctor ID</Label>
                            <Input type="text" value={doctor} className="form-control" id="validationTooltip01" name="doctor" placeholder="Doctor ID" onChange={this.handleChange} />

                            <div className="valid-tooltip">
                              Looks good!
                            </div>
                          </div>
                        </Col>
                        <Col md="4">
                          <div className="mb-3 position-relative">
                            <Label className="form-label" htmlFor="validationTooltip04">Date Of Birth</Label>
                            <input
                              type="date"
                              className="form-control"
                              placeholderText="Date Of Birth"
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



                      </Row>

                      <Row>
                        <Col md="6">
                          <div className="mb-3 position-relative">
                            <Label className="form-label" htmlFor="validationTooltip02">Appointment Start Time</Label>
                            <Input type="time" value={start_time} className="form-control" id="validationTooltip02" name="start_time" placeholder="Appointment Start Time" onChange={this.handleChange} />
                            <div className="valid-tooltip">
                              Looks good!
                            </div>
                          </div>
                        </Col>

                        <Col md="6">
                          <div className="mb-3 position-relative">
                            <Label className="form-label" htmlFor="validationTooltip04">Appointment End Time</Label>
                            <Input type="time" value={end_time} className="form-control" id="validationTooltip04" name="end_time" placeholder="Appointment End time" onChange={this.handleChange} />
                            <div className="valid-tooltip">
                              Looks good!
                            </div>
                          </div>
                        </Col>

                      </Row>


                      <Col md="12" className="text-center">
                        <Button color="primary" type="submit">Submit form</Button>
                      </Col>
                    </Form>
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

export default withRouter(EditAppointment);

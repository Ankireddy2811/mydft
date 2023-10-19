import React, { Component } from "react";
import { Row, Col, Card, CardBody, FormGroup, Button, Label, Input, Container, InputGroup, Form } from "reactstrap";
import { toast } from 'react-toastify'; // Import toast from react-toastify
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS file for styling
import { withRouter } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';

class EditDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      breadcrumbItems: [
        { title: "Forms", link: "#" },
        { title: "Form Mask", link: "#" },
      ],
      first_name: '',
      last_name: '',
      email: '',
      contact_number: '',
      specialty: '',
      qualifications: '',
      address: '',
      gender: '',
      date_of_birth: '',
      doctor_id: '',
      department: '',
      profile_image: null,
      client_id: "",
      access_token: "",


    };
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
        date_of_birth: formattedDate,
      });
    } else {
      this.setState({
        [name]: value,
      });
    }
  };

  handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    // Check if the selected file is not null and it's an instance of File
    if (file && file instanceof File) {
      this.setState({
        profile_image: file, // Use the correct key 'profile_image' here
      });
    } else {
      // Reset the image if it's not valid
      this.setState({
        profile_image: null, // Use the correct key 'profile_image' here
      });
    }
  };

  async componentDidMount() {
    try {
      const { match } = this.props;
      const doctor_id = match.params.doctor_id;
      const id = JSON.parse(localStorage.getItem('client_id'));
      const access = JSON.parse(localStorage.getItem('access_token'));

      if (id) {
        this.setState({ client_id: id, access_token: access });

        const response = await fetch(`/Doctor/details-By/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${access}`,
          },
          body: JSON.stringify({ doctor_id, client_id: id }),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok.");
        }

        const data = await response.json();

        if (data.Data.length > 0) {
          const {
            first_name,
            last_name,
            email,
            contact_number,
            specialty,
            qualifications,
            address,
            gender,
            date_of_birth,
            department
          } = data.Data[0];

          this.setState({
            first_name,
            last_name,
            email,
            contact_number,
            specialty,
            qualifications,
            address,
            gender,
            date_of_birth,
            doctor_id,
            department,
          });
        } else {
          console.log("Doctor not found");
        }
      } else {
        console.log("Client ID not found");
      }
    } catch (error) {
      console.log(error);
    }
  }



  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };





  handleSubmit = async (e) => {
    e.preventDefault();
    const {
      first_name,
      last_name,
      email,
      contact_number,
      specialty,
      qualifications,
      address,
      gender,
      date_of_birth,
      profile_image,

      // Use the correct key 'image' here
      doctor_id,
      department,
      client_id,
      access_token,
    } = this.state;

    const formData = new FormData();
    formData.append('first_name', first_name);
    formData.append('last_name', last_name);
    formData.append('gender', gender);
    formData.append('email', email);
    formData.append('contact_number', contact_number);
    formData.append('date_of_birth', date_of_birth);
    formData.append('specialty', specialty);
    formData.append('qualifications', qualifications);
    formData.append('address', address);
    // formData.append('profile_image', profile_image); 
    formData.append('department', department);
    formData.append('doctor_id', doctor_id);
    formData.append('client_id', client_id);
    if (profile_image) {
      // Append profile_image only if it's selected
      formData.append('profile_image', profile_image);
    }

    // Use the correct key 'image' here

    try {
      const response = await axios.put(`/Doctor/Updated/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Use 'multipart/form-data' for form data
          'Authorization': `Bearer ${access_token}`,
        },
      });

      const data = response.data;

      if (data.message) {
        toast.success(data.message);
        this.props.history.push('/doctors'); // Assuming "/doctors" is the route for the doctors page
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
      first_name,
      last_name,
      email,
      contact_number,
      specialty,
      qualifications,
      address,
      gender,
      date_of_birth,
      department,
    } = this.state;
    return (
      <React.Fragment>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumbs title="Edit Doctor" breadcrumbItems={this.state.breadcrumbItems} />
            <Row>
              <Col lg={12}>
                <Card>
                  <CardBody>
                    <Form className="needs-validation" method="post" id="tooltipForm" onSubmit={this.handleSubmit} enctype="multipart/form-data">
                      <Row>
                        <Col md="4">
                          <div className="mb-3 position-relative">
                            <Label className="form-label" htmlFor="validationTooltip01">First Name</Label>
                            <Input type="text" className="form-control" id="validationTooltip01" value={first_name} name="first_name" placeholder="First Name" onChange={this.handleChange} />

                            <div className="valid-tooltip">
                              Looks good!
                            </div>
                          </div>
                        </Col>
                        <Col md="4">
                          <div className="mb-3 position-relative">
                            <Label className="form-label" htmlFor="validationTooltip01">Last Name</Label>
                            <Input type="text" value={last_name} className="form-control" id="validationTooltip01" name="last_name" placeholder="Last Name" onChange={this.handleChange} />

                            <div className="valid-tooltip">
                              Looks good!
                            </div>
                          </div>
                        </Col>
                        <Col md="4">
                          <div className="mb-3 position-relative">
                            <Label className="form-label" htmlFor="validationTooltip01">Email</Label>
                            <Input type="text" value={email} className="form-control" id="validationTooltip01" name="email" placeholder="Email" onChange={this.handleChange} />

                            <div className="valid-tooltip">
                              Looks good!
                            </div>
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="4">
                          <div className="mb-3 position-relative">
                            <Label className="form-label" htmlFor="validationTooltip04">Profile Image</Label>
                            <Input type="file" className="form-control" id="validationTooltip06" name="profile_image" placeholder="Profile Image" onChange={this.handleProfileImageChange} />
                            <div className="valid-tooltip">
                              Looks good!
                            </div>
                          </div>
                        </Col>
                        <Col md="4">
                          <div className="mb-3 position-relative">
                            <Label className="form-label" htmlFor="validationTooltip02">Phone Number</Label>
                            <Input type="text" value={contact_number} className="form-control" id="validationTooltip02" name="contact_number" placeholder="Phone Number" onChange={this.handleChange} />
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
                              name="date_of_birth"
                              value={date_of_birth} // Use the formatted date
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
                        <Col md="4">
                          <div className="mb-3 position-relative">
                            <Label className="form-label" htmlFor="validationTooltip02">Department</Label>
                            <Input type="text" value={department} className="form-control" id="validationTooltip02" name="department" placeholder="Department" onChange={this.handleChange} />
                            <div className="valid-tooltip">
                              Looks good!
                            </div>
                          </div>
                        </Col>



                        <Col md="4">
                          <div className="mb-3 position-relative">
                            <Label className="form-label" htmlFor="validationTooltip02">Qualifications</Label>
                            <Input type="text" value={qualifications} className="form-control" id="validationTooltip02" name="qualifications" placeholder="Qualifications" onChange={this.handleChange} />
                            <div className="valid-tooltip">
                              Looks good!
                            </div>
                          </div>
                        </Col>
                        <Col md="4">
                          <div className="mb-3 position-relative">
                            <Label className="form-label" htmlFor="validationTooltip04">Gender</Label>
                            <select className="form-control" value={gender} name="gender" onChange={this.handleChange}>
                              <option >Select Gender</option>
                              <option >male</option>
                              <option >female</option>
                              <option >other</option>
                            </select>

                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="4">
                          <div className="mb-3 position-relative">
                            <Label className="form-label" htmlFor="validationTooltip02">Specialty</Label>
                            <select className="form-control" value={specialty} name="specialty" onChange={this.handleChange}>
                              <option value="">Select Specialty</option>
                              <option value="Cardiology">Cardiology</option>
                              <option value="Dermatology">Dermatology</option>
                              <option value="Neurology">Neurology</option>
                              <option value="Orthopedics">Orthopedics</option>
                              <option value="Pediatrics">Pediatrics</option>
                              <option value="Gynecology">Gynecology</option>
                              <option value="Urology">Urology</option>
                              <option value="Oncology">Oncology</option>
                              <option value="Psychiatry">Psychiatry</option>
                              <option value="ENT">ENT</option>
                            </select>

                          </div>
                        </Col>

                        <Col md="8">
                          <div className="mb-3 position-relative">
                            <Label className="form-label" htmlFor="validationTooltip04">Address</Label>
                            <Input type="text" value={address} className="form-control" id="validationTooltip04" name="address" placeholder="Address" onChange={this.handleChange} />
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

export default withRouter(EditDoctor);

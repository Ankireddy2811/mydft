import React, { useState, useEffect } from "react";
//import axios from 'axios';
import { Row, Col, Card, CardBody, Button, Label, Input, Container, Form } from "reactstrap";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Breadcrumbs from '../../components/Common/Breadcrumb';
//import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { drfAddDoctor } from "../../drfServer";

const AddDoctor = ({history}) => {
  const [state, setState] = useState({
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
    client: "",
    access_token: "",
  });

  useEffect(() => {
    const access = JSON.parse(localStorage.getItem('access_token'));
    const client_id = JSON.parse(localStorage.getItem('client_id'));
    if (client_id) {
      setState(prevState => ({ ...prevState, client: client_id, access_token: access }));
    }
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'date_of_birth') {
      const formattedDate = formatDate(value);
      setState(prevState => ({ ...prevState, date_of_birth: formattedDate }));
    } else {
      setState(prevState => ({ ...prevState, [name]: value }));
    }
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file instanceof File) {
      setState(prevState => ({ ...prevState, profile_image: file }));
    } else {
      setState(prevState => ({ ...prevState, profile_image: null }));
    }
  };

  const handleSubmit = async (e) => {
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
      department,
      client,
      access_token,
    } = state;

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
    formData.append('department', department);
    formData.append('client', client);
   

    if (profile_image) {
      formData.append('profile_image', profile_image);
    }

    try {
      const headersPart = {
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
      const response = await drfAddDoctor(formData, headersPart);

    
    if (response.status === 201) {
      toast.success(response.data.success);
      // Reset the form fields
      history.replace('/doctors'); // Assuming "/doctors" is the route for the doctors page

    }
    else {
      throw new Error("Something went wrong");
  }
  } catch (error) {
    console.error("Error:", error);

    if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
    } else {
        toast.error("Something went wrong");
    }
  }
  };

 

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="Add Doctor" breadcrumbItems={state.breadcrumbItems} />
          <Row>
            <Col lg={12}>
              <Card>
               
                  <CardBody>
                    <Form className="needs-validation" method="post" id="tooltipForm" onSubmit={handleSubmit} enctype="multipart/form-data">
                      <Row>
                        <Col md="4">
                          <div className="mb-3 position-relative">
                            <Label className="form-label" htmlFor="validationTooltip01">First Name</Label>
                            <Input type="text" className="form-control" id="validationTooltip01" value={state.first_name} name="first_name" placeholder="First Name" onChange={handleChange} required />

                            <div className="valid-tooltip">
                              Looks good!
                            </div>
                          </div>
                        </Col>
                        <Col md="4">
                          <div className="mb-3 position-relative">
                            <Label className="form-label" htmlFor="validationTooltip01">Last Name</Label>
                            <Input type="text" value={state.last_name} className="form-control" id="validationTooltip01" name="last_name" placeholder="Last Name" onChange={handleChange} required />

                            <div className="valid-tooltip">
                              Looks good!
                            </div>
                          </div>
                        </Col>
                        <Col md="4">
                          <div className="mb-3 position-relative">
                            <Label className="form-label" htmlFor="validationTooltip04">Profile Image</Label>
                            <Input type="file" className="form-control" id="validationTooltip06" name="profile_image" placeholder="Profile Image" onChange={handleProfileImageChange} />
                            <div className="valid-tooltip">
                              Looks good!
                            </div>
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="4">
                          <div className="mb-3 position-relative">
                            <Label className="form-label" htmlFor="validationTooltip01">Email</Label>
                            <Input type="text" value={state.email} className="form-control" id="validationTooltip01" name="email" placeholder="Email" onChange={handleChange} required />

                            <div className="valid-tooltip">
                              Looks good!
                            </div>
                          </div>
                        </Col>
                        <Col md="4">
                          <div className="mb-3 position-relative">
                            <Label className="form-label" htmlFor="validationTooltip02">Phone Number</Label>
                            <Input type="text" value={state.contact_number} className="form-control" id="validationTooltip02" name="contact_number" placeholder="Phone Number" onChange={handleChange} required />
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
                              value={state.date_of_birth} // Use the formatted date
                              onChange={handleChange}

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
                            <Input type="text" value={state.department} className="form-control" id="validationTooltip02" name="department" placeholder="Department" onChange={handleChange} required />
                            <div className="valid-tooltip">
                              Looks good!
                            </div>
                          </div>
                        </Col>
                        <Col md="4">
                          <div className="mb-3 position-relative">
                            <Label className="form-label" htmlFor="validationTooltip02">Qualifications</Label>
                            <Input type="text" value={state.qualifications} className="form-control" id="validationTooltip02" name="qualifications" placeholder="Qualifications" onChange={handleChange} required />
                            <div className="valid-tooltip">
                              Looks good!
                            </div>
                          </div>
                        </Col>
                        <Col md="4">
                          <div className="mb-3 position-relative">
                            <Label className="form-label" htmlFor="validationTooltip02">Specialty</Label>
                            <select className="form-control" value={state.specialty} name="specialty" onChange={handleChange} required >
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


                      </Row>
                      <Row>
                        <Col md="4">
                          <div className="mb-3 position-relative">
                            <Label className="form-label" htmlFor="validationTooltip04">Gender</Label>
                            <select className="form-control" value={state.gender} name="gender" onChange={handleChange} required >
                              <option value="">Select Gender</option>
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                              <option value="other">Other</option>
                            </select>

                          </div>
                        </Col>

                        <Col md="8">
                          <div className="mb-3 position-relative">
                            <Label className="form-label" htmlFor="validationTooltip04">Address</Label>
                            <Input type="text" value={state.address} className="form-control" id="validationTooltip04" name="address" placeholder="Address" onChange={handleChange} required />
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
};

export default AddDoctor;


/* import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Row, Col, Card, CardBody, FormGroup, Button, Label, Input, Container, InputGroup, Form } from "reactstrap";
import { toast } from 'react-toastify'; // Import toast from react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS file for styling
//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { drfAddDoctor } from "../../drfServer";


const AddDoctor = ({ match, history }) => {
  const [state, setState] = useState({
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
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const doctor_id = match.params.doctor_id;
        const id = JSON.parse(localStorage.getItem('client_id'));
        const access = JSON.parse(localStorage.getItem('access_token'));

        if (id) {
          setState(prevState => ({ ...prevState, client_id: id, access_token: access }));

          const response = await fetch(`http://194.163.40.231:8000/Doctor/details-By/`, {
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

            setState(prevState => ({
              ...prevState,
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
            }));
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
    fetchData();
  }, [match.params.doctor_id]);

  const handleSubmit = async (e) => {
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
      doctor_id,
      department,
      client_id,
      access_token,
    } = state; 

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

    // Append form data

    try {
      const headersPart = {
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'multipart/form-data', // Set the content type to multipart/form-data
        },
      }
      const response = await drfAddDoctor(formData, headersPart);

      if (response.data.message) {
        toast.success(response.data.message);
        // Reset the form fields
        this.props.history.push('/doctors'); // Assuming "/doctors" is the route for the doctors page

      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };


  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'date_of_birth') {
      const formattedDate = formatDate(value);
      setState(prevState => ({ ...prevState, date_of_birth: formattedDate }));
    } else {
      setState(prevState => ({ ...prevState, [name]: value }));
    }
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file instanceof File) {
      setState(prevState => ({ ...prevState, profile_image: file }));
    } else {
      setState(prevState => ({ ...prevState, profile_image: null }));
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="Edit Doctor" breadcrumbItems={state.breadcrumbItems} />
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <Form className="needs-validation" method="post" id="tooltipForm" onSubmit={handleSubmit} enctype="multipart/form-data">
                  <Row>
                        <Col md="4">
                          <div className="mb-3 position-relative">
                            <Label className="form-label" htmlFor="validationTooltip01">First Name</Label>
                            <Input type="text" className="form-control" id="validationTooltip01" value={state.first_name} name="first_name" placeholder="First Name" onChange={handleChange} />

                            <div className="valid-tooltip">
                              Looks good!
                            </div>
                          </div>
                        </Col>
                        <Col md="4">
                          <div className="mb-3 position-relative">
                            <Label className="form-label" htmlFor="validationTooltip01">Last Name</Label>
                            <Input type="text" value={state.last_name} className="form-control" id="validationTooltip01" name="last_name" placeholder="Last Name" onChange={handleChange} />

                            <div className="valid-tooltip">
                              Looks good!
                            </div>
                          </div>
                        </Col>
                        <Col md="4">
                          <div className="mb-3 position-relative">
                            <Label className="form-label" htmlFor="validationTooltip01">Email</Label>
                            <Input type="text" value={state.email} className="form-control" id="validationTooltip01" name="email" placeholder="Email" onChange={handleChange} />

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
                            <Input type="file" className="form-control" id="validationTooltip06" name="profile_image" placeholder="Profile Image" onChange={handleProfileImageChange} />
                            <div className="valid-tooltip">
                              Looks good!
                            </div>
                          </div>
                        </Col>
                        <Col md="4">
                          <div className="mb-3 position-relative">
                            <Label className="form-label" htmlFor="validationTooltip02">Phone Number</Label>
                            <Input type="text" value={state.contact_number} className="form-control" id="validationTooltip02" name="contact_number" placeholder="Phone Number" onChange={handleChange} />
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
                              value={state.date_of_birth} // Use the formatted date
                              onChange={handleChange}

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
                            <Input type="text" value={state.department} className="form-control" id="validationTooltip02" name="department" placeholder="Department" onChange={handleChange} />
                            <div className="valid-tooltip">
                              Looks good!
                            </div>
                          </div>
                        </Col>



                        <Col md="4">
                          <div className="mb-3 position-relative">
                            <Label className="form-label" htmlFor="validationTooltip02">Qualifications</Label>
                            <Input type="text" value={state.qualifications} className="form-control" id="validationTooltip02" name="qualifications" placeholder="Qualifications" onChange={handleChange} />
                            <div className="valid-tooltip">
                              Looks good!
                            </div>
                          </div>
                        </Col>
                        <Col md="4">
                          <div className="mb-3 position-relative">
                            <Label className="form-label" htmlFor="validationTooltip04">Gender</Label>
                            <select className="form-control" value={state.gender} name="gender" onChange={handleChange}>
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
                            <select className="form-control" value={state.specialty} name="specialty" onChange={handleChange}>
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
                            <Input type="text" value={state.address} className="form-control" id="validationTooltip04" name="address" placeholder="Address" onChange={handleChange} />
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
};

export default AddDoctor; */

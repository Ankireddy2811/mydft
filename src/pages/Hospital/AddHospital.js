import React, { Component } from "react";
import { Row, Col, Card, CardBody, FormGroup, Button, Label, Input, Container, InputGroup, Form } from "reactstrap";
import { toast } from 'react-toastify'; // Import toast from react-toastify
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS file for styling
// Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';

class AddHospital extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hospital_name: '',
            owner_name: '',
            city: '',
            address: '',
            email: '',
            phone: '',
            password: '',
            profile_image: null,
            user_logo: null,
            user_type: 'Admin',
            name:"",
        };
    }
    componentDidMount() {
        const access = JSON.parse(localStorage.getItem('access_token'));
        if (access) {
          this.setState({ access_token: access });
        }
    }
     
    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        });
    };

    handleProfileImageChange = (e) => {
        this.setState({
          profile_image: e.target.files[0], // Store the selected file
        });
      };
      
      handleUserLogoChange = (e) => {
        this.setState({
          user_logo: e.target.files[0], // Store the selected file
        });
      };

      handleSubmit = async (e) => {
        e.preventDefault();
        const { owner_name, hospital_name, city, address, email, phone, password, profile_image, user_logo, user_type,name } = this.state;
        const formData = new FormData();
        formData.append("hospital_name", hospital_name);
        formData.append("owner_name", owner_name);
        formData.append("city", city);
        formData.append("address", address);
        formData.append("email", email);
        formData.append("phone", phone);
        formData.append("password", password);
        formData.append("profile_image", profile_image);
        formData.append("user_logo", user_logo);
        formData.append("user_type", user_type);
        formData.append("name", owner_name);

    
        try {
            const response = await axios.post("/Hospital/add/", formData, {
                headers: {
                    'Authorization': `Bearer ${this.state.access_token}`,
                    'Content-Type': 'multipart/form-data', // Ensure you set the content type for FormData
                },
            });
    
            const data = response.data;
    
            if (data.message) {
                // Display a success toast
                this.props.history.push('/hospital-list'); // Assuming "/doctors" is the route for the doctors page
                toast.success(data.message);
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                // Display an error toast with the error message from the server
                toast.error(error.response.data.message);
            } else {
                // Display a generic error toast
                toast.error("Something went wrong");
            }
        }
    };
    

    render() {
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid={true}>
                        <Row>
                            <h1 style={{ textAlign: "center" }}> ADD HOSPITAL</h1>
                            <Col lg={12}>
                                <Card>
                                    <CardBody>
                                        <Form className="needs-validation" method="post" id="tooltipForm" onSubmit={this.handleSubmit}>
                                            <Row>
                                                <Col md="6">
                                                    <div className="mb-3 position-relative">
                                                        <Label className="form-label" htmlFor="validationTooltip01">Owner Name</Label>
                                                        <Input type="text" className="form-control" id="validationTooltip01" name="owner_name" placeholder="Owner Name" onChange={this.handleChange} required/>
                                                        <div className="valid-tooltip">
                                                            Looks good!
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col md="6">
                                                    <div className="mb-3 position-relative">
                                                        <Label className="form-label" htmlFor="validationTooltip01">Hospital Name</Label>
                                                        <Input type="text" className="form-control" id="validationTooltip01" name="hospital_name" placeholder="Hospital Name" onChange={this.handleChange} required/>
                                                        <div className="valid-tooltip">
                                                            Looks good!
                                                        </div>
                                                    </div>
                                                </Col>
                                                
                                            </Row>

                                            <Row>
                                            <Col md="6">
                                                    <div className="mb-3 position-relative">
                                                        <Label className="form-label" htmlFor="validationTooltip02">Phone Number</Label>
                                                        <Input type="text" className="form-control" id="validationTooltip02" name="phone" placeholder="Phone Number" onChange={this.handleChange} required/>
                                                        <div className="valid-tooltip">
                                                            Looks good!
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col md="6">
                                                    <div className="mb-3 position-relative">
                                                        <Label className="form-label" htmlFor="validationTooltip02">Email ID</Label>
                                                        <Input type="text" className="form-control" id="validationTooltip03" name="email" placeholder="Email ID" onChange={this.handleChange} required/>
                                                        <div className="valid-tooltip">
                                                            Looks good!
                                                        </div>
                                                    </div>
                                                </Col>
                                                
                                                

                                            </Row>
                                            <Row>
                                            <Col md="6">
                                                    <div className="mb-3 position-relative">
                                                        <Label className="form-label" htmlFor="validationTooltip02">Password</Label>
                                                        <Input type="text" className="form-control" id="validationTooltip04" name="password" placeholder="Password" onChange={this.handleChange} required/>
                                                        <div className="valid-tooltip">
                                                            Looks good!
                                                        </div>
                                                    </div>
                                                </Col>
                                            <Col md="6">
                                                    <div className="mb-3 position-relative">
                                                        <Label className="form-label" htmlFor="validationTooltip02">City</Label>
                                                        <Input type="text" className="form-control" id="validationTooltip05" name="city" placeholder="City" onChange={this.handleChange} required/>
                                                        <div className="valid-tooltip">
                                                            Looks good!
                                                        </div>
                                                    </div>
                                                </Col>
                                                </Row>
                                                <Row>
                                                <Col md="6">
                                                    <div className="mb-3 position-relative">
                                                        <Label className="form-label" htmlFor="validationTooltip04">Profile Image</Label>
                                                        <Input type="file" className="form-control" id="validationTooltip06" name="profile_image" placeholder="Profile Image" onChange={this.handleProfileImageChange}  required/>
                                                        <div className="valid-tooltip">
                                                            Looks good!
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col md="6">
                                                    <div className="mb-3 position-relative">
                                                        <Label className="form-label" htmlFor="validationTooltip04">User Logo</Label>
                                                        <Input type="file" className="form-control" id="validationTooltip06" name="user_logo" placeholder="User Logo" onChange={this.handleUserLogoChange} required/>
                                                        <div className="valid-tooltip">
                                                            Looks good!
                                                        </div>
                                                    </div>
                                                </Col>
                                               
                                            </Row>
                                            <Row>
                                                <Col md="12">
                                                    <div className="mb-3 position-relative">
                                                        <Label className="form-label" htmlFor="validationTooltip04">Address</Label>
                                                        <Input type="text" className="form-control" id="validationTooltip06" name="address" placeholder="Address" onChange={this.handleChange} required/>
                                                        <div className="valid-tooltip">
                                                            Looks good!
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>


                                            <Row>
                                                <Col md="12" className="text-center">
                                                    <Button color="primary" type="submit">Submit form</Button>
                                                </Col>
                                            </Row>
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

export default AddHospital;

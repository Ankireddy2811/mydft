import React, { useState,useEffect } from "react";
import { Row, Col, Card, CardBody,Button, Label, Input, Container, Form } from "reactstrap";
import { toast } from 'react-toastify'; // Import toast from react-toastify
//import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS file for styling
// Import Breadcrumb
//import Breadcrumbs from '../../components/Common/Breadcrumb';
import {drfAddHospital} from "../../drfServer";

const AddHospital = ({history})=>{

    const [state,setState] = useState({
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
        access_token:"",
        
    
    })
    
          
    
    useEffect(()=>{
        const access = JSON.parse(localStorage.getItem('access_token'));
        if (access) {
            setState({ access_token: access });
          }
    }) 
      
        
    
     
    const handleChange = (e) => {
        setState(prevState=>({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const handleProfileImageChange = (e) => {
        setState(prevState=>({
          ...prevState,
          profile_image: e.target.files[0], // Store the selected file
        }));
      };
      
    const handleUserLogoChange = (e) => {
        setState(prevState=>({
          ...prevState,
          user_logo: e.target.files[0], // Store the selected file
        }));
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        const { owner_name, hospital_name, city, address, email, phone, password, profile_image, user_logo, user_type } = state;
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

        const headersPart = {
            headers: {
                'Authorization': `Bearer ${state.access_token}`,
                'Content-Type': 'multipart/form-data', // Ensure you set the content type for FormData
            }
        }
        try {
            const response = await drfAddHospital(formData,headersPart);
    
            const data = response.data;
    
            if (data.message) {
                // Display a success toast
                history.replace('/hospital-list'); // Assuming "/doctors" is the route for the doctors page
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
    
    

        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid={true}>
                        <Row>
                            <h1 style={{ textAlign: "center" }}> ADD HOSPITAL</h1>
                            <Col lg={12}>
                                <Card>
                                    <CardBody>
                                        <Form className="needs-validation" method="post" id="tooltipForm" onSubmit={handleSubmit}>
                                            <Row>
                                                <Col md="6">
                                                    <div className="mb-3 position-relative">
                                                        <Label className="form-label" htmlFor="validationTooltip01">Owner Name</Label>
                                                        <Input type="text" className="form-control" id="validationTooltip01" name="owner_name" placeholder="Owner Name" onChange={handleChange} required/>
                                                        <div className="valid-tooltip">
                                                            Looks good!
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col md="6">
                                                    <div className="mb-3 position-relative">
                                                        <Label className="form-label" htmlFor="validationTooltip01">Hospital Name</Label>
                                                        <Input type="text" className="form-control" id="validationTooltip01" name="hospital_name" placeholder="Hospital Name" onChange={handleChange} required/>
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
                                                        <Input type="text" className="form-control" id="validationTooltip02" name="phone" placeholder="Phone Number" onChange={handleChange} required/>
                                                        <div className="valid-tooltip">
                                                            Looks good!
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col md="6">
                                                    <div className="mb-3 position-relative">
                                                        <Label className="form-label" htmlFor="validationTooltip02">Email ID</Label>
                                                        <Input type="text" className="form-control" id="validationTooltip03" name="email" placeholder="Email ID" onChange={handleChange} required/>
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
                                                        <Input type="text" className="form-control" id="validationTooltip04" name="password" placeholder="Password" onChange={handleChange} required/>
                                                        <div className="valid-tooltip">
                                                            Looks good!
                                                        </div>
                                                    </div>
                                                </Col>
                                            <Col md="6">
                                                    <div className="mb-3 position-relative">
                                                        <Label className="form-label" htmlFor="validationTooltip02">City</Label>
                                                        <Input type="text" className="form-control" id="validationTooltip05" name="city" placeholder="City" onChange={handleChange} required/>
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
                                                        <Input type="file" className="form-control" id="validationTooltip06" name="profile_image" placeholder="Profile Image" onChange={handleProfileImageChange}  required/>
                                                        <div className="valid-tooltip">
                                                            Looks good!
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col md="6">
                                                    <div className="mb-3 position-relative">
                                                        <Label className="form-label" htmlFor="validationTooltip04">User Logo</Label>
                                                        <Input type="file" className="form-control" id="validationTooltip06" name="user_logo" placeholder="User Logo" onChange={handleUserLogoChange} required/>
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
                                                        <Input type="text" className="form-control" id="validationTooltip06" name="address" placeholder="Address" onChange={handleChange} required/>
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


export default AddHospital;

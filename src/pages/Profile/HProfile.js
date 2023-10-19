import React, { Component } from "react";
import Autosuggest from "react-autosuggest";



import {
    Row, Col, Card, CardBody, FormGroup, Button, Label, Input, Container, InputGroup, Form,
} from "reactstrap";

import { toast } from 'react-toastify'; // Import toast from react-toastify
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS file for styling
// Import Breadcrumb
class HProfile extends Component {
    constructor() {
        super();
        this.state = {
            data: [], // Store fetched data here
            client_id: "",
            access_token: "",
            patientSuggestions: [], // Store patient suggestions from the API
            isEditMode: false, // Track edit mode
            editedData: {}, // Store edited data here
            hospital_name: "",
            owner_name: "",
            phone: "",
            email: "",
            password: "",
            address: "",
            city: "",
            profile_image: null,
            profile:"",
        };
    }
    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        });
    };
 // Function to fetch data from the API
 fetchDataFromAPI = () => {
    // Use the same logic you have in componentDidMount
    const access = JSON.parse(localStorage.getItem("access_token"));
    const id = JSON.parse(localStorage.getItem("client_id"));
    if (access) {
      this.setState({ access_token: access }, () => {
        this.setState({ client_id: id }, () => {
          fetch(`/Hospital/list/${this.state.client_id}/`, {
            headers: {
              Authorization: `Bearer ${this.state.access_token}`,
            },
          })
            .then((response) => response.json())
            .then((data) => {
              this.setState({
                owner_name: data.owner_name,
                hospital_name: data.hospital_name,
                phone: data.phone,
                email: data.email,
                address: data.address,
                city: data.city,
                password: data.password,
                profile_image: data.profile_image,
              });
            })
            .catch((error) => {
              console.error("Error fetching data:", error);
            });
        });
      });
    }
  };

  componentDidMount() {
    // Call the fetchDataFromAPI function in componentDidMount
    this.fetchDataFromAPI();
  }

    // Function to toggle edit mode
    toggleEditMode = () => {
        this.setState((prevState) => ({
            isEditMode: !prevState.isEditMode,
            editedData: this.state.data, // Initialize editedData with the current data
        }));
    };
    handleImageUpload = (e) => {
        const file = e.target.files[0];
        this.setState({ profile: file }, () => {
            // After setting the profile image, call handleSubmit
            this.handleSubmit(e);
        });
    };
    
    openImageUploadDialog = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = this.handleImageUpload;
        input.click();
       
    };
    // Function to handle form input changes

    // Function to submit edited data to the API
    // handleSubmit = (e) => {
    //     // Prepare the form data
    //     e.preventDefault(); // Add this line to prevent default form submission

    //     const formData = new FormData();
    //     formData.append("hospital_name", this.state.hospital_name);
    //     formData.append("owner_name", this.state.owner_name);
    //     formData.append("phone", this.state.phone);
    //     formData.append("email", this.state.email);
    //     formData.append("password", this.state.password);
    //     formData.append("address", this.state.address);
    //     formData.append("city", this.state.city);

    //     axios.put(`http://194.163.40.231:8080/Hospital/update/${this.state.client_id}/`, formData, {
    //         headers: {
    //             Authorization: `Bearer ${this.state.access_token}`,
    //             // Make sure to set content type as 'multipart/form-data'
    //             'Content-Type': 'multipart/form-data',
    //         },
    //     })
    //         .then((response) => {
    //             // Handle success response here, e.g., show a success message
    //             window.alert("Profile updated successfully");
    //         })
    //         .catch((error) => {
    //             // Handle error here, e.g., show an error message
    //             console.error("Error updating profile:", error);
    //         });
    // };
    handleSubmit = (e) => {
        e.preventDefault();
         const {client_id,access_token} =this.state;
        const formData = new FormData();
        formData.append("hospital_name", this.state.hospital_name);
        formData.append("owner_name", this.state.owner_name);
        formData.append("phone", this.state.phone);
        formData.append("email", this.state.email);
        formData.append("password", this.state.password);
        formData.append("address", this.state.address);
        formData.append("city", this.state.city);
    
        // Append the profile image if it exists
        if (this.state.profile) {
            formData.append("profile_image", this.state.profile);
        }
    
        axios.put(`/Hospital/update/${client_id}/`, formData, {
            headers: {
                Authorization: `Bearer ${access_token}`,
                'Content-Type': 'multipart/form-data',
            },
        })
        .then((response) => {
            // Handle success response here, e.g., show a success message
            toast.success("Profile updated successfully");
            this.fetchDataFromAPI();

        })
        .catch((error) => {
            // Handle error here, e.g., show an error message
            console.error("Error updating profile:", error);
            toast.error("Something went wrong")
        });
    };
    

    render() {
        const { owner_name, hospital_name, phone, email, address, city, password, profile_image } = this.state;
        const defaultProfileImage = 'https://th.bing.com/th/id/OIP.1LRUIB2OXVePxD5hQm4fqwHaHa?pid=ImgDet&rs=1'; // Replace with the path to your default image

        return (
            <React.Fragment>
                <div className="page-content">
                    <Container  >
                        <Row>
                            <Col >
                                <Card className="col-lg-4 col-md-8 col-sm-12 mx-auto">
                                    <CardBody>
                                        <div className="text-center mb-3">
                                            <img
                                                src={profile_image ? profile_image : defaultProfileImage} // Use the URL from data.profile_image
                                                alt="Profile Image"
                                                className="img-fluid rounded-circle"
                                                style={{ width: "130px", height: "130px", boxShadow: "0px 2px 4px black", }}
                                            />
                                            <h5 className="mt-2" style={{ textShadow: "2px 2px 4px rgba(0.8, 0.8, 0.8, 0.2)", }}>Profile Image</h5>
                                        </div>
                                        <Row>
                                            <Col md="12">
                                                <div className="text-center">
                                                    <Button color="primary" onClick={this.openImageUploadDialog}>Change Your Avatar</Button>
                                                </div>
                                            </Col>
                                        </Row>
                                        <Form className="needs-validation" method="post" id="tooltipForm" onSubmit={this.handleSubmit}>
                                            <Row>
                                                <Col md="12">
                                                    <div className="mb-3 position-relative">
                                                        <Label className="form-label" htmlFor="validationTooltip01">Hospital Name</Label>
                                                        <Input type="text" className="form-control" id="validationTooltip01" value={hospital_name} name="hospital_name" placeholder="Hospital Name" onChange={this.handleChange} required />
                                                        <div className="valid-tooltip">
                                                            Looks good!
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md="12">
                                                    <div className="mb-3 position-relative">
                                                        <Label className="form-label" htmlFor="validationTooltip01">Owner Name</Label>
                                                        <Input type="text" className="form-control" id="validationTooltip01" value={owner_name} name="owner_name" placeholder="Owner Name" onChange={this.handleChange} required />
                                                        <div className="valid-tooltip">
                                                            Looks good!
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md="12">
                                                    <div className="mb-3 position-relative">
                                                        <Label className="form-label" htmlFor="validationTooltip02">Phone Number</Label>
                                                        <Input type="text" className="form-control" id="validationTooltip02" value={phone} name="phone" placeholder="Phone Number" onChange={this.handleChange} required />
                                                        <div className="valid-tooltip">
                                                            Looks good!
                                                        </div>
                                                    </div>
                                                </Col>


                                               
                                            </Row>
                                            <Row>
                                            <Col md="6">
                                                    <div className="mb-3 position-relative">
                                                        <Label className="form-label" htmlFor="validationTooltip02">Email</Label>
                                                        <Input type="text" className="form-control" id="validationTooltip02" value={email} name="email" placeholder="Email" onChange={this.handleChange} required />
                                                        <div className="valid-tooltip">
                                                            Looks good!
                                                        </div>
                                                    </div>
                                                </Col>

                                                <Col md="6">
                                                    <div className="mb-3 position-relative">
                                                        <Label className="form-label" htmlFor="validationTooltip04">City</Label>
                                                        <Input type="text" className="form-control" id="validationTooltip04" value={city} name="city" placeholder="City" onChange={this.handleChange} required />
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
                                                        <Input type="text" className="form-control" id="validationTooltip04" value={address} name="address" placeholder="Address" onChange={this.handleChange} required />
                                                        <div className="valid-tooltip">
                                                            Looks good!
                                                        </div>
                                                    </div>
                                                </Col>

                                            </Row>
                                            <Col md="12" className="text-center">
                                                <Button color="primary" type="submit">Update Profile</Button>
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

export default HProfile;

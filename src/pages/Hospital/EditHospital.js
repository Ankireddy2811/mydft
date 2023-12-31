import React, { Component } from "react";
import { Row, Col, Card, CardBody, FormGroup, Button, Label, Input, Container, InputGroup, Form } from "reactstrap";
import { toast } from 'react-toastify'; // Import toast from react-toastify
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS file for styling
import { withRouter } from 'react-router-dom';

//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';
import {drfUpdateHospital,drfGetHospitalListById} from "../../drfServer";
class EditHospital extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hospital_name: '',
            owner_name: '',
            city: '',
            address: '',
            email: '',
            phone: '',
            client_id: '',
            password: '',
            access_token:"",
            name:"",
        };
    }
    async componentDidMount() {
        try {
          const { match } = this.props; // React Router match object
          const id = match.params.client_id;
        //   toast.success(id);
          const access = JSON.parse(localStorage.getItem('access_token'));
          if (access) {
            this.setState({ access_token: access,client_id:id });
          }
      
          const response = await fetch(`/Hospital/list/${id}/`, {
            headers: {
              'Authorization': `Bearer ${access}`
            }
          });
      
          if (!response.ok) {
            throw new Error("Network response was not ok.");
          }
      
          const data = await response.json();
      
          console.log(data);
      
          // Update state with fetched hospital data
          this.setState({
            client_id: id,
            hospital_name: data.hospital_name,
            owner_name: data.owner_name,
            city: data.city,
            address: data.address,
            email: data.email,
            phone: data.phone,
          });
        } catch (error) {
          console.log(error);
          // Handle error fetching hospital data
        }
      }
      
      

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        });
    };


    handleSubmit = (e) => {
        e.preventDefault();
        const {
          owner_name, hospital_name, city, address, email, phone, client_id, password, name,
        } = this.state;
      
        let formData;
        const abc = owner_name;
        if (abc) {
          this.setState({ name: abc });
        }
      
        // Check if the password field is empty
        if (!password) {
          // If the password field is empty, remove it from formData
          formData = {
            owner_name, hospital_name, city, address, email, phone, name,
          };
        } else {
          // If the password field is not empty, include it in formData
          formData = {
            owner_name, hospital_name, city, address, email, phone, password, name,
          };
        }
      
        // Synchronous code here
        this.sendFormDataToServer(formData);
      };
      
      sendFormDataToServer = async (formData) => {
        const headersPart = {
            headers: {
                Authorization: `Bearer ${this.state.access_token}`,
                'Content-Type': 'application/json',
            }
        }

        try{
         const client_id = this.state.client_id;
         const response = await drfUpdateHospital(client_id,formData,headersPart);
         if (response.data.message) {
            toast.success(response.data.message);
            this.props.history.push('/hospital-list'); // Assuming "/hospital-list" is the route for the hospital list page
          } else {
            toast.error(response.data.message || 'An error occurred while processing your request.');
          }
        }
        catch (error) {
            console.error("Error:", error);
            toast.error("An error occurred while processing your request.");
        }
          
      };
    
      

    render() {
        const {
            owner_name, hospital_name, city, address, email, phone,password } = this.state;
        // console.log("Gender:", gender);

        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid={true}>
                        <Row>
                            <Col lg={12}>
                                <Card>
                                    <CardBody>
                                        <Form className="needs-validation" method="post" id="tooltipForm" onSubmit={this.handleSubmit}>
                                            <Row>
                                                <Col md="4">
                                                    <div className="mb-3 position-relative">
                                                        <Label className="form-label" htmlFor="validationTooltip01">Owner Name</Label>
                                                        <Input type="text" className="form-control" id="validationTooltip01" value={owner_name} name="owner_name" placeholder="Owner Name" onChange={this.handleChange} />
                                                        <div className="valid-tooltip">
                                                            Looks good!
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col md="4">
                                                    <div className="mb-3 position-relative">
                                                        <Label className="form-label" htmlFor="validationTooltip01">Hospital Name</Label>
                                                        <Input type="text" className="form-control" id="validationTooltip01" value={hospital_name} name="hospital_name" placeholder="Hospital Name" onChange={this.handleChange} />
                                                        <div className="valid-tooltip">
                                                            Looks good!
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col md="4">
                                                    <div className="mb-3 position-relative">
                                                        <Label className="form-label" htmlFor="validationTooltip02">Phone Number</Label>
                                                        <Input type="text" className="form-control" id="validationTooltip02" value={phone} name="phone" placeholder="Phone Number" onChange={this.handleChange} />
                                                        <div className="valid-tooltip">
                                                            Looks good!
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>

                                            <Row>
                                                <Col md="4">
                                                    <div className="mb-3 position-relative">
                                                        <Label className="form-label" htmlFor="validationTooltip02">Email ID</Label>
                                                        <Input type="text" className="form-control" id="validationTooltip02" value={email} name="email" placeholder="Email ID" onChange={this.handleChange} />
                                                        <div className="valid-tooltip">
                                                            Looks good!
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col md="4">
                                                    <div className="mb-3 position-relative">
                                                        <Label className="form-label" htmlFor="validationTooltip02">Password</Label>
                                                        <Input type="text" className="form-control" id="validationTooltip02" value={password} name="password" placeholder="Password" onChange={this.handleChange} />
                                                        <div className="valid-tooltip">
                                                            Looks good!
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col md="4">
                                                    <div className="mb-3 position-relative">
                                                        <Label className="form-label" htmlFor="validationTooltip02">City</Label>
                                                        <Input type="text" className="form-control" id="validationTooltip02" value={city} name="city" placeholder="City" onChange={this.handleChange} />
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
                                                        <Input type="file" className="form-control" id="validationTooltip06" name="profile_image" placeholder="Profile Image" onChange={this.handleProfileImageChange} />
                                                        <div className="valid-tooltip">
                                                            Looks good!
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col md="6">
                                                    <div className="mb-3 position-relative">
                                                        <Label className="form-label" htmlFor="validationTooltip04">User Logo</Label>
                                                        <Input type="file" className="form-control" id="validationTooltip06" name="user_logo" placeholder="User Logo" onChange={this.handleUserLogoChange}/>
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
                                                        <Input type="text" className="form-control" id="validationTooltip04" value={address} name="address" placeholder="Address" onChange={this.handleChange} />
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

export default withRouter(EditHospital);


/* import React, {useState,useEffect} from "react";
import { Row, Col, Card, CardBody,Button, Label, Input, Container,Form } from "reactstrap";
import { toast } from 'react-toastify'; // Import toast from react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS file for styling
import { withRouter } from 'react-router-dom';

//Import Breadcrumb
//import Breadcrumbs from '../../components/Common/Breadcrumb';
import {drfUpdateHospital,drfGetHospitalListById} from "../../drfServer";

const EditHospital = (props) => {
    const [state, setState] = useState({
        hospital_name: '',
        owner_name: '',
        city: '',
        address: '',
        email: '',
        phone: '',
        client_id: '',
        password: '',
        access_token: '',
        name: '',
        profile_image: null, // Added for profile image state
        user_logo: null, // Added for user logo state
    });

    useEffect(() => {
        const fetchData = async () => {
            
            const id = JSON.parse(localStorage.getItem('client_id'));
            const access = JSON.parse(localStorage.getItem('access_token'));

            if (id){
                setState(prevState=>({...prevState,client_id:id,access_token:access}))
                const headersPart = {
                    headers:{
                        'Authorization':`Bearer ${access}`
                    }
                };

               try {
               
                const response = await drfGetHospitalListById(id,headersPart);
                if (!response.status === 200) {
                    throw new Error('Network response was not ok.');
                }

                const hospitalData = await response.data;

                setState(prevState => ({
                    ...prevState,
                    
                    hospital_name:hospitalData.Data.hospital_name,
                    owner_name:hospitalData.Data.owner_name,
                    city:hospitalData.Data.city,
                    address:hospitalData.Data.address,
                    email:hospitalData.Data.email,
                    phone:hospitalData.Data.phone,
                    hospital_id:hospitalData.Data.hospital_id

                }));
            
               
            } 
             catch (error) {
                throw new Error(error);
            }
        }
        
        else{
            throw new Error("Client ID not found");
        }
        };

        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setState(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleProfileImageChange = (e) => {
      const file = e.target.files[0];
      if (file && file instanceof File) {
        setState(prevState => ({ ...prevState, profile_image: file }));
      } else {
        setState(prevState => ({ ...prevState, profile_image: null }));
      }
    };

    const handleUserLogoChange = (e) => {
        setState({
          user_logo: e.target.files[0], // Store the selected file
        });
      };

    const handleSubmit = (e) => {
        e.preventDefault();
        const { owner_name, hospital_name, city, address, email, phone, password, name } = state;
        let formData;

        if (!password) {
            formData = {
                owner_name,
                hospital_name,
                city,
                address,
                email,
                phone,
                name,
            };
        } else {
            formData = {
                owner_name,
                hospital_name,
                city,
                address,
                email,
                phone,
                password,
                name,
            };
        }

        sendFormDataToServer(formData);
    };

    const sendFormDataToServer = async (formData) => {
        const headersPart = {
            headers: {
                Authorization: `Bearer ${state.access_token}`,
                'Content-Type': 'application/json',
            }
        };

        try {
            const client_id = state.client_id;
            const response = await drfUpdateHospital(client_id, formData, headersPart);

            if (response.data.message) {
                // Assuming toast and redirect are available in props
                toast.success(response.data.message);
                props.history.push('/hospital-list');
            } else {
                toast.error(response.data.message || 'An error occurred while processing your request.');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('An error occurred while processing your request.');
        }
    };

    const {
        owner_name,
        hospital_name,
        city,
        address,
        email,
        phone,
        password
    } = state;

    return (
        <React.Fragment>
            <div className="page-content">
            <Container fluid={true}>
                        <Row>
                            <Col lg={12}>
                                <Card>
                                    <CardBody>
                                        <Form className="needs-validation" method="post" id="tooltipForm" onSubmit={handleSubmit}>
                                            <Row>
                                                <Col md="4">
                                                    <div className="mb-3 position-relative">
                                                        <Label className="form-label" htmlFor="validationTooltip01">Owner Name</Label>
                                                        <Input type="text" className="form-control" id="validationTooltip01" value={owner_name} name="owner_name" placeholder="Owner Name" onChange={handleChange} />
                                                        <div className="valid-tooltip">
                                                            Looks good!
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col md="4">
                                                    <div className="mb-3 position-relative">
                                                        <Label className="form-label" htmlFor="validationTooltip01">Hospital Name</Label>
                                                        <Input type="text" className="form-control" id="validationTooltip01" value={hospital_name} name="hospital_name" placeholder="Hospital Name" onChange={handleChange} />
                                                        <div className="valid-tooltip">
                                                            Looks good!
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col md="4">
                                                    <div className="mb-3 position-relative">
                                                        <Label className="form-label" htmlFor="validationTooltip02">Phone Number</Label>
                                                        <Input type="text" className="form-control" id="validationTooltip02" value={phone} name="phone" placeholder="Phone Number" onChange={handleChange} />
                                                        <div className="valid-tooltip">
                                                            Looks good!
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>

                                            <Row>
                                                <Col md="4">
                                                    <div className="mb-3 position-relative">
                                                        <Label className="form-label" htmlFor="validationTooltip02">Email ID</Label>
                                                        <Input type="text" className="form-control" id="validationTooltip02" value={email} name="email" placeholder="Email ID" onChange={handleChange} />
                                                        <div className="valid-tooltip">
                                                            Looks good!
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col md="4">
                                                    <div className="mb-3 position-relative">
                                                        <Label className="form-label" htmlFor="validationTooltip02">Password</Label>
                                                        <Input type="text" className="form-control" id="validationTooltip02" value={password} name="password" placeholder="Password" onChange={handleChange} />
                                                        <div className="valid-tooltip">
                                                            Looks good!
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col md="4">
                                                    <div className="mb-3 position-relative">
                                                        <Label className="form-label" htmlFor="validationTooltip02">City</Label>
                                                        <Input type="text" className="form-control" id="validationTooltip02" value={city} name="city" placeholder="City" onChange={handleChange} />
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
                                                        <Input type="file" className="form-control" id="validationTooltip06" name="profile_image" placeholder="Profile Image" onChange={handleProfileImageChange} />
                                                        <div className="valid-tooltip">
                                                            Looks good!
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col md="6">
                                                    <div className="mb-3 position-relative">
                                                        <Label className="form-label" htmlFor="validationTooltip04">User Logo</Label>
                                                        <Input type="file" className="form-control" id="validationTooltip06" name="user_logo" placeholder="User Logo" onChange={handleUserLogoChange}/>
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
                                                        <Input type="text" className="form-control" id="validationTooltip04" value={address} name="address" placeholder="Address" onChange={handleChange} />
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
};

export default withRouter(EditHospital); */












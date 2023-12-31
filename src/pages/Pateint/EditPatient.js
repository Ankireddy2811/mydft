/* import React, { Component } from "react";
import { Row, Col, Card, CardBody, FormGroup, Button, Label, Input, Container, InputGroup, Form } from "reactstrap";
import { withRouter } from 'react-router-dom';

import { toast } from 'react-toastify'; // Import toast from react-toastify
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS file for styling
//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import {drfUpdatePatient,drfGetSpecificPatientDetails} from "../../drfServer"
class EditPatient extends Component {
    constructor(props) {
        super(props);
        this.state = {
            breadcrumbItems: [
                { title: "Forms", link: "#" },
                { title: "Form Mask", link: "#" },
            ],
            first_name: "",
            last_name: "",
            email: "",
            contact_number: "",
            date_of_birth: "",
            gender: "",
            address: "",
            patient_id: "",
            medical_history: "",
            client_id: "",
            access_token: "",

        };
    }
    async componentDidMount() {
        const { match } = this.props;
        const patient_id = match.params.patient_id;
        const access = JSON.parse(localStorage.getItem('access_token'));

        const id = JSON.parse(localStorage.getItem('client_id'));

        try {
            if (!id) {
                throw new Error("client_id not found in localStorage");
            }

            // Fetch patient details using the patient_id
           
            const formData = { patient_id, client_id: id }
            const headersPart = {
                headers: 
              {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${access}`,
              }
            }
            const response = await drfGetSpecificPatientDetails(formData,headersPart);
            if (!response.ok) {
                throw new Error("Network response was not ok.");
            }

            const data = await response.data;
            const patientData = data.Data[0];

            if (!patientData) {
                throw new Error("Patient data not found in the response");
            }
            const formattedDateOfBirth = this.formatDate(patientData.date_of_birth);

            // Update state with fetched patient data
            this.setState({
                client_id: id,
                first_name: patientData.first_name,
                last_name: patientData.last_name,
                email: patientData.email,
                contact_number: patientData.contact_number,
                address: patientData.address,
                date_of_birth: formattedDateOfBirth, // Use the formatted date

                gender: patientData.gender,
                patient_id: patient_id,
                medical_history: patientData.medical_history,
                access_token: access,

            });

            //console.log("Patient data loaded:", this.state);
        } catch (error) {
            console.log("Error:", error);
            // Handle error fetching patient data, e.g., show an error message
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
                date_of_birth: formattedDate,
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
            first_name,
            last_name,
            email,
            contact_number,
            date_of_birth,
            address,
            gender,
            patient_id,
            medical_history,
            client_id,
            access_token,
        } = this.state;

        const formData = {
            first_name,
            last_name,
            gender,
            email,
            contact_number,
            address,
            date_of_birth,
            medical_history,
            client_id,
            patient_id,
        };

        const headersPart = {
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${access_token}`,
            }
        }

        try {
            const response = await drfUpdatePatient(formData, headersPart);

            const data = response.data;

            if (data.message) {
                toast.success(data.message);
                this.props.history.push('/patients'); // Assuming "/patients" is the route for the patients page
            } else {
                toast.error(data.message || 'An error occurred while processing your request.');
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
            date_of_birth,
            address,
            gender,
            patient_id,
            medical_history,
        } = this.state;
        // console.log("Gender:", gender);

        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid={true}>
                        <Breadcrumbs title="Edit Patient" breadcrumbItems={this.state.breadcrumbItems} />
                        <Row>
                            <Col lg={12}>
                                <Card>
                                    <CardBody>
                                        <Form className="needs-validation" method="post" id="tooltipForm" onSubmit={this.handleSubmit}>
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
                                                        <Input type="text" className="form-control" id="validationTooltip01" value={last_name} name="last_name" placeholder="Last Name" onChange={this.handleChange} />

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
                                                        <Label className="form-label" htmlFor="validationTooltip02">Phone Number</Label>
                                                        <Input type="text" value={contact_number} className="form-control" id="validationTooltip02" name="contact_number" placeholder="Phone Number" onChange={this.handleChange} />
                                                        <div className="valid-tooltip">
                                                            Looks good!
                                                        </div>
                                                    </div>
                                                </Col>

                                                <Col md="4">
                                                    <div className="mb-3 position-relative">
                                                        <Label className="form-label" htmlFor="validationTooltip04">Gender</Label>
                                                        <select className="form-control" name="gender" value={gender} onChange={this.handleChange}>
                                                            <option>Select Gender</option>
                                                            <option>male</option>
                                                            <option>female</option>
                                                            <option>other</option>
                                                        </select>
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
                                                        <Label className="form-label" htmlFor="validationTooltip04">Medical History</Label>
                                                        <Input type="text" value={medical_history} className="form-control" id="validationTooltip04" name="medical_history" placeholder="Medical History" onChange={this.handleChange} />
                                                        <div className="valid-tooltip">
                                                            Looks good!
                                                        </div>
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

export default withRouter(EditPatient); */

import React,{useState,useEffect} from "react";

import { Row, Col, Card, CardBody,Button, Label, Input, Container, Form } from "reactstrap";
import { withRouter } from 'react-router-dom';

import { toast } from 'react-toastify'; // Import toast from react-toastify
// import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS file for styling
//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';
// import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {drfUpdatePatient,drfGetSpecificPatientDetails} from "../../drfServer"

const EditPatient = (props) => {
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        contact_number: "",
        date_of_birth: "",
        gender: "",
        address: "",
        patient_id: "",
        medical_history: "",
        client_id: "",
        access_token: "",
    });

    const [breadcrumbItems] = useState([
        { title: "Forms", link: "#" },
        { title: "Form Mask", link: "#" },
    ]);

    useEffect(() => {
        const fetchData = async () => {
            const { match } = props;
            const patient_id = match.params.patient_id;
            const access = JSON.parse(localStorage.getItem('access_token'));
            const id = JSON.parse(localStorage.getItem('client_id'));

            
            if (id) {
                setFormData(prevState=>({...prevState,client_id:id,access_token:access}))
            

                const requestFormData = { patient_id, client_id: id };
                const headersPart = {
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${access}`,
                    }
                };

                try{

                const response = await drfGetSpecificPatientDetails(requestFormData, headersPart);

                if (!response.status === 200) {
                    throw new Error('Network response was not ok.');
                } 
                const data = await response.data;
                const patientData = data.Data[0];

                if (!patientData) {
                    throw new Error("Patient data not found in the response");
                }

                const formattedDateOfBirth = formatDate(patientData.date_of_birth);

                setFormData({
                    client_id: id,
                    first_name: patientData.first_name,
                    last_name: patientData.last_name,
                    email: patientData.email,
                    contact_number: patientData.contact_number,
                    address: patientData.address,
                    date_of_birth: formattedDateOfBirth,
                    gender: patientData.gender,
                    patient_id: patient_id,
                    medical_history: patientData.medical_history,
                    access_token: access,
                });
            } catch (error) {
                throw new Error("Error:", error);
            }
            }
        else{
            throw new Error("Client ID not found");
        }
        };
        fetchData();
    }, [props]);

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
            setFormData({
                ...formData,
                date_of_birth: formattedDate,
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const headersPart = {
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${formData.access_token}`,
            }
        };

        try {
            const response = await drfUpdatePatient(formData, headersPart);
            const data = response.data;

            if (data.message) {
                toast.success(data.message);
                props.history.push('/patients');
            } else {
                toast.error(data.message || 'An error occurred while processing your request.');
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("An error occurred while processing your request.");
        }
    };

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="Edit Patient" breadcrumbItems={breadcrumbItems} />
                    <Row>
                        <Col lg={12}>
                            <Card>
                                <CardBody>
                                    <Form className="needs-validation" method="post" id="tooltipForm" onSubmit={handleSubmit}>
                                        <Row>
                                            <Col md="4">
                                                <div className="mb-3 position-relative">
                                                    <Label className="form-label" htmlFor="validationTooltip01">First Name</Label>
                                                    <Input type="text" className="form-control" id="validationTooltip01" value={formData.first_name} name="first_name" placeholder="First Name" onChange={handleChange} />

                                                    <div className="valid-tooltip">
                                                        Looks good!
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col md="4">
                                                <div className="mb-3 position-relative">
                                                    <Label className="form-label" htmlFor="validationTooltip01">Last Name</Label>
                                                    <Input type="text" className="form-control" id="validationTooltip01" value={formData.last_name} name="last_name" placeholder="Last Name" onChange={handleChange} />

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
                                                        value={formData.date_of_birth} // Use the formatted date
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
                                                    <Label className="form-label" htmlFor="validationTooltip02">Phone Number</Label>
                                                    <Input type="text" value={formData.contact_number} className="form-control" id="validationTooltip02" name="contact_number" placeholder="Phone Number" onChange={handleChange} />
                                                    <div className="valid-tooltip">
                                                        Looks good!
                                                    </div>
                                                </div>
                                            </Col>

                                            <Col md="4">
                                                <div className="mb-3 position-relative">
                                                    <Label className="form-label" htmlFor="validationTooltip04">Gender</Label>
                                                    <select className="form-control" name="gender" value={formData.gender} onChange={handleChange}>
                                                        <option>Select Gender</option>
                                                        <option>male</option>
                                                        <option>female</option>
                                                        <option>other</option>
                                                    </select>
                                                    <div className="valid-tooltip">
                                                        Looks good!
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col md="4">
                                                <div className="mb-3 position-relative">
                                                    <Label className="form-label" htmlFor="validationTooltip01">Email</Label>
                                                    <Input type="text" value={formData.email} className="form-control" id="validationTooltip01" name="email" placeholder="Email" onChange={handleChange} />

                                                    <div className="valid-tooltip">
                                                        Looks good!
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>

                                        <Row>

                                            <Col md="4">
                                                <div className="mb-3 position-relative">
                                                    <Label className="form-label" htmlFor="validationTooltip04">Medical History</Label>
                                                    <Input type="text" value={formData.medical_history} className="form-control" id="validationTooltip04" name="medical_history" placeholder="Medical History" onChange={handleChange} />
                                                    <div className="valid-tooltip">
                                                        Looks good!
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col md="8">
                                                <div className="mb-3 position-relative">
                                                    <Label className="form-label" htmlFor="validationTooltip04">Address</Label>
                                                    <Input type="text" value={formData.address} className="form-control" id="validationTooltip04" name="address" placeholder="Address" onChange={handleChange} />
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

export default withRouter(EditPatient);

/* import React, { Component } from "react";
import { Row, Col, Card, CardBody, FormGroup, Button, Label, Input, Container, InputGroup, Form } from "reactstrap";

import { toast } from 'react-toastify'; // Import toast from react-toastify
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS file for styling
// Import Breadcrumb
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import { drfAddPatient } from "../../drfServer";

class AddPatient extends Component {
    constructor(props) {
        super(props);
        this.state = {
            first_name: "",
            last_name: "",
            email: "",
            phone: "",
            age: "",
            date_of_birth: "",
            gender: "",
            address: "",
            medical_history: "",
            client: "",
            access_token: "",

        };
    }
    componentDidMount() {
        // Load client_id from local storage and set it in the state
        const access = JSON.parse(localStorage.getItem('access_token'));

        const client_id = JSON.parse(localStorage.getItem('client_id'));
        if (client_id) {
            this.setState({ client: client_id });
            this.setState({ access_token: access });

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
            age,
            date_of_birth,
            gender,
            address,
            medical_history,
            client,
            access_token,
        } = this.state;

        const formData = {
            first_name,
            last_name,
            email,
            contact_number,
            age,
            date_of_birth,
            gender,
            address,
            medical_history,
            client,
        }

        const headersPart = {
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${access_token}`,
            }
        }

        try {
            const response = await drfAddPatient(formData,headersPart);

            const data = response.data;

            if (data.message && data.success) {
                toast.success(data.message);
                this.props.history.push('/patients'); // Assuming "/doctors" is the route for the doctors page

            } else {
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


    render() {
        const {

            date_of_birth,

        } = this.state;
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
                                                        <Label className="form-label" htmlFor="validationTooltip01">First Name</Label>
                                                        <Input type="text" className="form-control" id="validationTooltip01" name="first_name" placeholder="First Name" onChange={this.handleChange} required />
                                                        <div className="valid-tooltip">
                                                            Looks good!
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col md="4">
                                                    <div className="mb-3 position-relative">
                                                        <Label className="form-label" htmlFor="validationTooltip01">Last Name</Label>
                                                        <Input type="text" className="form-control" id="validationTooltip01" name="last_name" placeholder="Last Name" onChange={this.handleChange} required />
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
                                                        <Input type="text" className="form-control" id="validationTooltip02" name="contact_number" placeholder="Phone Number" onChange={this.handleChange} required />
                                                        <div className="valid-tooltip">
                                                            Looks good!
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col md="4">
                                                    <div className="mb-3 position-relative">
                                                        <Label className="form-label" htmlFor="validationTooltip04">Gender</Label>
                                                        <select className="form-control" name="gender" onChange={this.handleChange} required>
                                                            <option value="">Select Gender</option>
                                                            <option value="male">Male</option>
                                                            <option value="female">Female</option>
                                                            <option value="other"> Other</option>
                                                        </select>
                                                    </div>
                                                </Col>
                                                <Col md="4">
                                                    <div className="mb-3 position-relative">
                                                        <Label className="form-label" htmlFor="validationTooltip04">Age</Label>
                                                        <Input type="text" className="form-control" id="validationTooltip04" name="age" placeholder="Age" onChange={this.handleChange} required />
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
                                                        <Input type="text" className="form-control" id="validationTooltip02" name="email" placeholder="Email ID" onChange={this.handleChange} required />
                                                        <div className="valid-tooltip">
                                                            Looks good!
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col md="4">
                                                    <div className="mb-3 position-relative">
                                                        <Label className="form-label" htmlFor="validationTooltip04">Address</Label>
                                                        <Input type="text" className="form-control" id="validationTooltip04" name="address" placeholder="Address" onChange={this.handleChange} required />
                                                        <div className="valid-tooltip">
                                                            Looks good!
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col md="4">
                                                    <div className="mb-3 position-relative">
                                                        <Label className="form-label" htmlFor="validationTooltip04">Medical History</Label>
                                                        <Input type="text" className="form-control" id="validationTooltip04" name="medical_history" placeholder="Medical History" onChange={this.handleChange} required />
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

export default AddPatient; */


import React, { useState, useEffect } from "react";
import { Row, Col, Card, CardBody, Button, Label, Input, Container, Form } from "reactstrap";
import { toast } from 'react-toastify'; // Import toast from react-toastify
//import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS file for styling
// Import Breadcrumb
//import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
// import Breadcrumbs from '../../components/Common/Breadcrumb';
import { drfAddPatient } from "../../drfServer";

const AddPatient = ({ history }) => {
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        contact_number: "",
        age: "",
        date_of_birth: "",
        gender: "",
        address: "",
        medical_history: "",
        client: "",
        access_token: "",
    });

    useEffect(() => {
        const access = JSON.parse(localStorage.getItem('access_token'));
        const client_id = JSON.parse(localStorage.getItem('client_id'));

        if (client_id) {
            setFormData(prevFormData => ({
                ...prevFormData,
                client: client_id,
                access_token: access,
            }));
        }
    }, []);

    const formatDate = dateString => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const handleChange = e => {
        const { name, value } = e.target;

        if (name === 'date_of_birth') {
            const formattedDate = formatDate(value);
            setFormData(prevFormData => ({
                ...prevFormData,
                date_of_birth: formattedDate,
            }));
        } else {
            setFormData(prevFormData => ({
                ...prevFormData,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { first_name,
            last_name,
            gender,
            email,
            contact_number,
            address,
            date_of_birth,
            medical_history,
            client,access_token} = formData
        

        const headersPart = {
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${access_token}`,
            }
        }

        const requestFormData = {
            first_name,
            last_name,
            gender,
            email,
            contact_number,
            address,
            date_of_birth,
            medical_history,
            client
        }

        try {
            const response = await drfAddPatient(requestFormData, headersPart);
            const data = response.data;

            if (data.message && data.success) {
                toast.success(data.message);
                history.push('/patients');
            } else {
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

    const { date_of_birth } = formData;

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
                                                <Label className="form-label" htmlFor="validationTooltip01">First Name</Label>
                                                <Input type="text" className="form-control" id="validationTooltip01" name="first_name" placeholder="First Name" onChange={handleChange} required />
                                                <div className="valid-tooltip">
                                                    Looks good!
                                                </div>
                                            </div>
                                        </Col>
                                        <Col md="4">
                                            <div className="mb-3 position-relative">
                                                <Label className="form-label" htmlFor="validationTooltip01">Last Name</Label>
                                                <Input type="text" className="form-control" id="validationTooltip01" name="last_name" placeholder="Last Name" onChange={handleChange} required />
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
                                                <Input type="text" className="form-control" id="validationTooltip02" name="contact_number" placeholder="Phone Number" onChange={handleChange} required />
                                                <div className="valid-tooltip">
                                                    Looks good!
                                                </div>
                                            </div>
                                        </Col>
                                        <Col md="4">
                                            <div className="mb-3 position-relative">
                                                <Label className="form-label" htmlFor="validationTooltip04">Gender</Label>
                                                <select className="form-control" name="gender" onChange={handleChange} required>
                                                    <option value="">Select Gender</option>
                                                    <option value="male">Male</option>
                                                    <option value="female">Female</option>
                                                    <option value="other"> Other</option>
                                                </select>
                                            </div>
                                        </Col>
                                        <Col md="4">
                                            <div className="mb-3 position-relative">
                                                <Label className="form-label" htmlFor="validationTooltip04">Age</Label>
                                                <Input type="text" className="form-control" id="validationTooltip04" name="age" placeholder="Age" onChange={handleChange} required />
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
                                                <Input type="text" className="form-control" id="validationTooltip02" name="email" placeholder="Email ID" onChange={handleChange} required />
                                                <div className="valid-tooltip">
                                                    Looks good!
                                                </div>
                                            </div>
                                        </Col>
                                        <Col md="4">
                                            <div className="mb-3 position-relative">
                                                <Label className="form-label" htmlFor="validationTooltip04">Address</Label>
                                                <Input type="text" className="form-control" id="validationTooltip04" name="address" placeholder="Address" onChange={handleChange} required />
                                                <div className="valid-tooltip">
                                                    Looks good!
                                                </div>
                                            </div>
                                        </Col>
                                        <Col md="4">
                                            <div className="mb-3 position-relative">
                                                <Label className="form-label" htmlFor="validationTooltip04">Medical History</Label>
                                                <Input type="text" className="form-control" id="validationTooltip04" name="medical_history" placeholder="Medical History" onChange={handleChange} required />
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

export default AddPatient;


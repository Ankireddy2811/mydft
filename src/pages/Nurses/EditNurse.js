/* import React, { Component } from "react";
import { Row, Col, Card, CardBody, FormGroup, Button, Label, Input, Container, InputGroup, Form } from "reactstrap";

import { toast } from 'react-toastify'; // Import toast from react-toastify
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS file for styling
// Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';
import {drfUpdateNurses,drfGetSpecificNurseDetails } from "../../drfServer"
class EditNurse extends Component {
    constructor(props) {
        super(props);
        this.state = {
            first_name: "",
            last_name: "",
            contact_number: "",
            date_of_birth: "",
            gender: "",
            department: "",
            nurse_id: "",
            client_id: "",
            access_token:"",

        };
    }
    async componentDidMount() {
        const { match } = this.props; // React Router match object
        const nurse_id = match.params.nurse_id;
        const access = JSON.parse(localStorage.getItem('access_token'));

        // Load client_id from local storage and set it in the state
        const id = JSON.parse(localStorage.getItem('client_id'));
        if (id) {
            this.setState({ client_id: id });
            this.setState({ access_token: access });

        }
        const requestFormData = { nurse_id, client_id:id }
        const headersPart = {
            headers:{
                "Content-type":"application/json",
                 Authorization:`Bearer ${this.state.access_token}`
            }
        }

        try {
            const response = await drfGetSpecificNurseDetails(requestFormData,headersPart);
            if (!response.ok) {
                throw new Error("Network response was not ok.");
            }
            const data = await response.data;
            //console.log(data.data);

            // Update state with fetched doctor data
            this.setState({
                first_name: data.Data.first_name,
                last_name: data.Data.last_name,
                contact_number: data.Data.contact_number,
                gender: data.Data.gender,
                date_of_birth: data.Data.date_of_birth,
                nurse_id: data.Data.nurse_id,
                department: data.Data.department,
            });
            // console.log(gender);
        } catch (error) {
            console.log(error);
            // Handle error fetching doctor data
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
          contact_number,
          date_of_birth,
          gender,
          department,
          nurse_id,
          client_id,
          access_token,
        } = this.state;
    
        const formData = {
          first_name,
          last_name,
          gender,
          date_of_birth,
          contact_number,
          department,
          nurse_id,
          client_id,
        };

        const headersPart = {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${access_token}`,
            },
          }
    
        try {
          const response = await drfUpdateNurses(formData,headersPart);
    
          const data = response.data;
    
          if (data.message) {
            toast.success(data.message);
            this.props.history.push("/nurse-list");
          } else {
            toast.error('An error occurred while processing your request.');
          }
        } catch (error) {
          if (error.response && error.response.data && error.response.data.message) {
            toast.error(error.response.data.message);
          } else {
            toast.error('Something went wrong');
          }
        }
      };

    render() {
        const { first_name,
            last_name,
            contact_number,
            date_of_birth,
            gender,
            department, } = this.state;
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
                                                <Col md="6">
                                                    <div className="mb-3 position-relative">
                                                        <Label className="form-label" htmlFor="validationTooltip01">First Name</Label>
                                                        <Input type="text" className="form-control" id="validationTooltip01" value={first_name} name="first_name" placeholder="First Name" onChange={this.handleChange} />
                                                        <div className="valid-tooltip">
                                                            Looks good!
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col md="6">
                                                    <div className="mb-3 position-relative">
                                                        <Label className="form-label" htmlFor="validationTooltip01">Last Name</Label>
                                                        <Input type="text" className="form-control" id="validationTooltip01" value={last_name} name="last_name" placeholder="Last Name" onChange={this.handleChange} />
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
                                                        <Input type="text" className="form-control" id="validationTooltip02" value={contact_number} name="contact_number" placeholder="Phone Number" onChange={this.handleChange} />
                                                        <div className="valid-tooltip">
                                                            Looks good!
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col md="6">
                                                    <div className="mb-3 position-relative">
                                                        <Label className="form-label" htmlFor="validationTooltip04">Gender</Label>
                                                        <select className="form-control" value={gender} name="gender" onChange={this.handleChange}>
                                                            <option>Select Gender</option>
                                                            <option>male</option>
                                                            <option>female</option>
                                                            <option>other</option>
                                                        </select>
                                                    </div>
                                                </Col>

                                            </Row>

                                            <Row>
                                                <Col md="6">
                                                    <div className="mb-3 position-relative">
                                                        <Label className="form-label" htmlFor="validationTooltip04">Date Of Birth</Label>
                                                        <Input type="text" className="form-control" id="validationTooltip04" value={date_of_birth} name="date_of_birth" placeholder="Date Of Birth (format i.e. yyyy-mm-dd)" onChange={this.handleChange} />
                                                        <div className="valid-tooltip">
                                                            Looks good!
                                                        </div>
                                                    </div>
                                                </Col>

                                                <Col md="6">
                                                    <div className="mb-3 position-relative">
                                                        <Label className="form-label" htmlFor="validationTooltip04">Department</Label>
                                                        <Input type="text" className="form-control" id="validationTooltip04" value={department} name="department" placeholder="Department" onChange={this.handleChange} />
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

export default EditNurse; */


import React, { useState, useEffect } from "react";
import { Row, Col, Card, CardBody, FormGroup, Button, Label, Input, Container, InputGroup, Form } from "reactstrap";
import { toast } from 'react-toastify'; // Import toast from react-toastify
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS file for styling
// Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';
import {drfUpdateNurses,drfGetSpecificNurseDetails } from "../../drfServer"

const EditNurse = (props) => {
    const [state, setState] = useState({
        first_name: "",
        last_name: "",
        contact_number: "",
        date_of_birth: "",
        gender: "",
        department: "",
        nurse_id: "",
        client_id: "",
        access_token: "",
    });

    useEffect(() => {
        const fetchData = async () => {
            const nurse_id = props.match.params.nurse_id;
            const access = JSON.parse(localStorage.getItem('access_token'));
            const id = JSON.parse(localStorage.getItem('client_id'));

            if (id) {
                setState(prevState => ({ ...prevState, client_id: id, access_token: access }));
                
                const requestFormData = { nurse_id, client_id:id }
                const headersPart = {
                    headers: 
                  {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${access}`,
                  }
                }
                try {
                const response = await drfGetSpecificNurseDetails(requestFormData,headersPart);
           
                if (!response.status === 200) {
                    throw new Error('Network response was not ok.');
                  } 

                const nurseData = await response.data;
                if (!nurseData){
                    throw new Error("Nurse data not found in the response");
                  }

                setState(prevState => ({
                    ...prevState,
                    first_name: nurseData.Data.first_name,
                    last_name: nurseData.Data.last_name,
                    contact_number:nurseData.Data.contact_number,
                    gender: nurseData.Data.gender,
                    date_of_birth: nurseData.Data.date_of_birth,
                    nurse_id: nurseData.Data.nurse_id,
                    department:nurseData.Data.department,
                }));
            } catch (error) {
                throw new Error(error);;
            }
        }
        else {
            throw new Error("Client ID not found");
          }
        };

        fetchData();
    }, [props.match.params.nurse_id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setState(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const {
            first_name,
            last_name,
            contact_number,
            date_of_birth,
            gender,
            department,
            nurse_id,
            client_id,
            access_token,
        } = state;

        const formData = {
            first_name,
            last_name,
            gender,
            date_of_birth,
            contact_number,
            department,
            nurse_id,
            client_id,
        };

        const headersPart = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`,
            },
        };

        try {
            const response = await drfUpdateNurses(formData, headersPart);
            const data = response.data;
            console.log(data)
            if (data.message) {
                toast.success(data.message);
                props.history.push("/nurse-list");
            } else {
                toast.error('An error occurred while processing your request.');
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Something went wrong');
            }
        }
    };

    const { first_name, last_name, contact_number, date_of_birth, gender, department } = state;

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
                                        <Col md="6">
                                            <div className="mb-3 position-relative">
                                                <Label className="form-label" htmlFor="validationTooltip01">First Name</Label>
                                                <Input type="text" className="form-control" id="validationTooltip01" value={first_name} name="first_name" placeholder="First Name" onChange={handleChange} />
                                                <div className="valid-tooltip">
                                                    Looks good!
                                                </div>
                                            </div>
                                        </Col>
                                        <Col md="6">
                                            <div className="mb-3 position-relative">
                                                <Label className="form-label" htmlFor="validationTooltip01">Last Name</Label>
                                                <Input type="text" className="form-control" id="validationTooltip01" value={last_name} name="last_name" placeholder="Last Name" onChange={handleChange} />
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
                                                <Input type="text" className="form-control" id="validationTooltip02" value={contact_number} name="contact_number" placeholder="Phone Number" onChange={handleChange} />
                                                <div className="valid-tooltip">
                                                    Looks good!
                                                </div>
                                            </div>
                                        </Col>
                                        <Col md="6">
                                            <div className="mb-3 position-relative">
                                                <Label className="form-label" htmlFor="validationTooltip04">Gender</Label>
                                                <select className="form-control" value={gender} name="gender" onChange={handleChange}>
                                                    <option>Select Gender</option>
                                                    <option>male</option>
                                                    <option>female</option>
                                                    <option>other</option>
                                                </select>
                                            </div>
                                        </Col>

                                    </Row>

                                    <Row>
                                        <Col md="6">
                                            <div className="mb-3 position-relative">
                                                <Label className="form-label" htmlFor="validationTooltip04">Date Of Birth</Label>
                                                <Input type="text" className="form-control" id="validationTooltip04" value={date_of_birth} name="date_of_birth" placeholder="Date Of Birth (format i.e. yyyy-mm-dd)" onChange={handleChange} />
                                                <div className="valid-tooltip">
                                                    Looks good!
                                                </div>
                                            </div>
                                        </Col>

                                        <Col md="6">
                                            <div className="mb-3 position-relative">
                                                <Label className="form-label" htmlFor="validationTooltip04">Department</Label>
                                                <Input type="text" className="form-control" id="validationTooltip04" value={department} name="department" placeholder="Department" onChange={handleChange} />
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

export default withRouter(EditNurse);

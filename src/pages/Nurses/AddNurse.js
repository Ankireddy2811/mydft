/* import React, { Component } from "react";
import { Row, Col, Card, CardBody, FormGroup, Button, Label, Input, Container, InputGroup, Form } from "reactstrap";
import { toast } from 'react-toastify'; // Import toast from react-toastify
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS file for styling
// Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';
import {drfAddNurses} from "../../drfServer"
class AddNurse extends Component {
    constructor(props) {
        super(props);
        this.state = {
            first_name: "",
            last_name: "",
            contact_number: "",
            date_of_birth: "",
            gender: "",
            department: "",
            client:"",
            access_token:"",

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

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        });
    };

   // Replace the existing handleSubmit with Axios and toast
  handleSubmit = async (e) => {
    e.preventDefault();
    const { 
      first_name,
      last_name,
      contact_number,
      date_of_birth,
      gender,
      department,
      client,
      access_token,
    } = this.state;

    const formData = {
        first_name,
        last_name,
        contact_number,
        date_of_birth,
        gender,
        department,
        client,
    }

    const headersPart = {
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${access_token}`,
          }
    }

    try {
      const response = await drfAddNurses(formData,headersPart)
     
      const data = response.data;

      if (data.message) {
        toast.success(data.message); // Use toast for success notification
      } else {
        throw new Error("Something went wrong");
      }
    } catch (error) {
      console.error("Error:", error);

      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message); // Use toast for error notification
      } else {
        toast.error("Something went wrong"); // Use toast for generic error notification
      }
    }
  };
    render() {
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
                                                        <Input type="text" className="form-control" id="validationTooltip01" name="first_name" placeholder="First Name" onChange={this.handleChange} />
                                                        <div className="valid-tooltip">
                                                            Looks good!
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col md="6">
                                                    <div className="mb-3 position-relative">
                                                        <Label className="form-label" htmlFor="validationTooltip01">Last Name</Label>
                                                        <Input type="text" className="form-control" id="validationTooltip01" name="last_name" placeholder="Last Name" onChange={this.handleChange} />
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
                                                        <Input type="text" className="form-control" id="validationTooltip02" name="contact_number" placeholder="Phone Number" onChange={this.handleChange} />
                                                        <div className="valid-tooltip">
                                                            Looks good!
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col md="6">
                                                    <div className="mb-3 position-relative">
                                                        <Label className="form-label" htmlFor="validationTooltip04">Gender</Label>
                                                        <select className="form-control" name="gender" onChange={this.handleChange}>
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
                                                        <Input type="text" className="form-control" id="validationTooltip04" name="date_of_birth" placeholder="Date Of Birth (format i.e. yyyy-mm-dd)" onChange={this.handleChange} />
                                                        <div className="valid-tooltip">
                                                            Looks good!
                                                        </div>
                                                    </div>
                                                </Col>
                                                
                                                <Col md="6">
                                                    <div className="mb-3 position-relative">
                                                        <Label className="form-label" htmlFor="validationTooltip04">Department</Label>
                                                        <Input type="text" className="form-control" id="validationTooltip04" name="department" placeholder="Department" onChange={this.handleChange} />
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

export default AddNurse; */


import React, { useState,useEffect } from "react";
import { Row, Col, Card, CardBody, FormGroup, Button, Label, Input, Container, InputGroup, Form } from "reactstrap";
import { toast } from 'react-toastify'; // Import toast from react-toastify
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS file for styling
// Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';
import {drfAddNurses} from "../../drfServer"

const AddNurse = ({history}) => {
    const [state, setState] = useState({
        first_name: "",
        last_name: "",
        contact_number: "",
        date_of_birth: "",
        gender: "",
        department: "",
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

    const handleChange = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value,
        });
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
            client,
            access_token,
        } = state;

        const formData = {
            first_name,
            last_name,
            contact_number,
            date_of_birth,
            gender,
            department,
            client,
        };

        const headersPart = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`,
            }
        };

        try {
            const response = await drfAddNurses(formData, headersPart);

            const data = response.data;

            if (response.status === 201) {
                toast.success(data.message);
                history.push("/nurse-list")
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
                                                <Input type="text" className="form-control" id="validationTooltip01" name="first_name" placeholder="First Name" onChange={handleChange} />
                                                <div className="valid-tooltip">
                                                    Looks good!
                                                </div>
                                            </div>
                                        </Col>
                                        <Col md="6">
                                            <div className="mb-3 position-relative">
                                                <Label className="form-label" htmlFor="validationTooltip01">Last Name</Label>
                                                <Input type="text" className="form-control" id="validationTooltip01" name="last_name" placeholder="Last Name" onChange={handleChange} />
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
                                                <Input type="text" className="form-control" id="validationTooltip02" name="contact_number" placeholder="Phone Number" onChange={handleChange} />
                                                <div className="valid-tooltip">
                                                    Looks good!
                                                </div>
                                            </div>
                                        </Col>
                                        <Col md="6">
                                            <div className="mb-3 position-relative">
                                                <Label className="form-label" htmlFor="validationTooltip04">Gender</Label>
                                                <select className="form-control" name="gender" onChange={handleChange}>
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
                                                <Input type="text" className="form-control" id="validationTooltip04" name="date_of_birth" placeholder="Date Of Birth (format i.e. yyyy-mm-dd)" onChange={handleChange} />
                                                <div className="valid-tooltip">
                                                    Looks good!
                                                </div>
                                            </div>
                                        </Col>
                                        
                                        <Col md="6">
                                            <div className="mb-3 position-relative">
                                                <Label className="form-label" htmlFor="validationTooltip04">Department</Label>
                                                <Input type="text" className="form-control" id="validationTooltip04" name="department" placeholder="Department" onChange={handleChange} />
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

export default AddNurse;

import React, { Component } from "react";
import { Row, Col, Card, CardBody, FormGroup, Button, Label, Input, Container, InputGroup, Form } from "reactstrap";

import { toast } from 'react-toastify'; // Import toast from react-toastify
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS file for styling
// Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';

class EditLabTest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            patient: "",
            doctor: "",
            test_name:"",
            test_date:"",
            results:"",
            lab_test_id:"",
            client_id:"",
            access_token:"",

        };
    }

    async componentDidMount() {
        const { match } = this.props; // React Router match object
        const lab_test_id = match.params.lab_test_id;
        const access = JSON.parse(localStorage.getItem('access_token'));

            // Load client_id from local storage and set it in the state
            const id = JSON.parse(localStorage.getItem('client_id'));
            if (id) {
              this.setState({ client_id: id });
              this.setState({ access_token: access });

            }
          

        try {
            const response = await fetch(`/LabTest/details-By/`,{
                method:"POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${access}`,

                  },
                  body: JSON.stringify({ lab_test_id, client_id: id }), // Use the updated client_id

            });
            if (!response.ok) {
                throw new Error("Network response was not ok.");
            }
            const data = await response.json();

            console.log(data);

            // Update state with fetched doctor data
            this.setState({
                patient: data.Data.patient_id,
                doctor: data.Data.doctor_id,
                test_date: data.Data.test_date,
                test_name:data.Data.test_name,
                results: data.Data.results,
                lab_test_id:data.Data.lab_test_id,
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
          patient,
          doctor,
          test_name,
          test_date,
          results,
          lab_test_id,
          client_id,
          access_token,
        } = this.state;
      
        try {
          const response = await axios.put(`/LabTest/Updated/`, {
            patient,
            doctor,
            test_name,
            test_date,
            results,
            lab_test_id,
            client_id,
          }, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${access_token}`,
            },
          });
      
          const data = response.data;
      
          if (data.message) {
            toast.success(`${data.message}`);
            this.props.history.push('/lab-test-list');
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
            patient,
            doctor,
            test_name,
            test_date,
            results,
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
                                                <Col md="6">
                                                    <div className="mb-3 position-relative">
                                                        <Label className="form-label" htmlFor="validationTooltip01">Patient ID</Label>
                                                        <Input type="text" className="form-control" id="validationTooltip01" value={patient} name="patient" placeholder="Patient ID" onChange={this.handleChange} />
                                                        <div className="valid-tooltip">
                                                            Looks good!
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col md="6">
                                                    <div className="mb-3 position-relative">
                                                        <Label className="form-label" htmlFor="validationTooltip01">Doctor ID</Label>
                                                        <Input type="text" className="form-control" id="validationTooltip01" value={doctor} name="doctor" placeholder="Doctor ID" onChange={this.handleChange} />
                                                        <div className="valid-tooltip">
                                                            Looks good!
                                                        </div>
                                                    </div>
                                                </Col>
                                                
                                            </Row>

                                            <Row>
                                                <Col md="6">
                                                    <div className="mb-3 position-relative">
                                                        <Label className="form-label" htmlFor="validationTooltip02">Test Name</Label>
                                                        <Input type="text" className="form-control" id="validationTooltip02" value={test_name} name="test_name" placeholder="Test Name" onChange={this.handleChange} />
                                                        <div className="valid-tooltip">
                                                            Looks good!
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col md="6">
                                                    <div className="mb-3 position-relative">
                                                        <Label className="form-label" htmlFor="validationTooltip02">Test Date</Label>
                                                        <Input type="text" className="form-control" id="validationTooltip02" value={test_date} name="test_date" placeholder="Test Date" onChange={this.handleChange} />
                                                        <div className="valid-tooltip">
                                                            Looks good!
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col md="6">
                                                    <div className="mb-3 position-relative">
                                                        <Label className="form-label" htmlFor="validationTooltip02">Results</Label>
                                                        <Input type="text" className="form-control" id="validationTooltip02" value={results} name="results" placeholder="Results" onChange={this.handleChange} />
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

export default EditLabTest;

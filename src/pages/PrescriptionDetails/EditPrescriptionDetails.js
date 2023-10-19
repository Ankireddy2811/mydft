import React, { Component } from "react";
import { Row, Col, Card, CardBody, FormGroup, Button, Label, Input, Container, InputGroup, Form } from "reactstrap";
//import { toast } from 'react-toastify';

import { toast } from 'react-toastify'; // Import toast from react-toastify
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS file for styling
// Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';

class EditPrescriptionDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            prescription:"",
            medicine:"",
            dosage:"",
            frequency:"",
            prescription_detail_id:"",
            client_id:"",
            access_token:"",

        };
    }
    async componentDidMount() {
        const { match } = this.props; // React Router match object
        const prescription_detail_id = match.params.prescription_detail_id;
        const access = JSON.parse(localStorage.getItem('access_token'));
            // Load client_id from local storage and set it in the state
            const id = JSON.parse(localStorage.getItem('client_id'));
            if (id) {
              this.setState({ client_id: id });
              this.setState({ access_token: access });

            }
          

        try {
            const response = await fetch(`/PrescriptionDetail/details-By/`,{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${access}`,

                },
                body: JSON.stringify({ prescription_detail_id, client_id: id }),}); // Use the updated client_id);
            if (!response.ok) {
                throw new Error("Network response was not ok.");
            }
            const data = await response.json();
            //console.log(data);

            // Update state with fetched doctor data
            this.setState({
                prescription:data.Data.prescription_id,
                medicine:data.Data.medicine_id,
                dosage:data.Data.dosage,
                frequency: data.Data.frequency,
                prescription_detail_id,
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
          prescription,
          medicine,
          dosage,
          frequency,
          prescription_detail_id,
          client_id,
          access_token,
        } = this.state;
    
        const formData = {
          prescription,
          medicine,
          dosage,
          frequency,
          prescription_detail_id,
          client_id,
        };
    
        try {
          const response = await axios.put(`/PrescriptionDetail/Updated/`, formData, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${access_token}`,
            },
          });
    
          if (response.data.message) {
            toast.success(response.data.message);
            this.props.history.push('/prescription-details-list'); // Assuming '/prescription-details-list' is the route for the prescription details list page
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
        const { 
            prescription,
            medicine,
            dosage,
            frequency,} = this.state;
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
                                                        <Label className="form-label" htmlFor="validationTooltip01">Prescription</Label>
                                                        <Input type="text" className="form-control" id="validationTooltip01" value={prescription} name="prescription" placeholder="Prescription" onChange={this.handleChange} />
                                                        <div className="valid-tooltip">
                                                            Looks good!
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col md="6">
                                                    <div className="mb-3 position-relative">
                                                        <Label className="form-label" htmlFor="validationTooltip01">Medicine</Label>
                                                        <Input type="text" className="form-control" id="validationTooltip01" value={medicine} name="medicine" placeholder="Medicine" onChange={this.handleChange} />
                                                        <div className="valid-tooltip">
                                                            Looks good!
                                                        </div>
                                                    </div>
                                                </Col>
                                                
                                            </Row>

                                            <Row>
                                                <Col md="6">
                                                    <div className="mb-3 position-relative">
                                                        <Label className="form-label" htmlFor="validationTooltip02">Dosage</Label>
                                                        <Input type="text" className="form-control" id="validationTooltip02" value={dosage} name="dosage" placeholder="Dosage" onChange={this.handleChange} />
                                                        <div className="valid-tooltip">
                                                            Looks good!
                                                        </div>
                                                    </div>
                                                </Col>
                                               
                                                <Col md="6">
                                                    <div className="mb-3 position-relative">
                                                        <Label className="form-label" htmlFor="validationTooltip04">Frequency</Label>
                                                        <Input type="text" className="form-control" id="validationTooltip04" value={frequency} name="frequency" placeholder="Frequency" onChange={this.handleChange} />
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

export default EditPrescriptionDetails;

import React, { Component } from "react";
import { Row, Col, Card, CardBody, FormGroup, Button, Label, Input, Container, InputGroup, Form } from "reactstrap";
//import { toast } from 'react-toastify';

import { toast } from 'react-toastify'; // Import toast from react-toastify
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS file for styling
// Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';

class EditPrescription extends Component {
    constructor(props) {
        super(props);
        this.state = {
            patient: "",
            doctor: "",
            prescription_date: "",
            notes: "",
            prescription_id: "",
            client_id: "",
            access_token:"",

        };
    }
    async componentDidMount() {
        const { match } = this.props; // React Router match object
        const access = JSON.parse(localStorage.getItem('access_token'));

        const prescription_id = match.params.prescription_id;
        // Load client_id from local storage and set it in the state
        const id = JSON.parse(localStorage.getItem('client_id'));
        if (id) {
            this.setState({ client_id: id ,access_token: access});

        }


        try {
            const response = await fetch(`/Prescription/details-By/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${access}`,

                },
                body: JSON.stringify({ prescription_id, client_id: id }), // Use the updated client_id
            });
            if (!response.ok) {
                throw new Error("Network response was not ok.");
            }
            const data = await response.json();
            // console.log(data.data);

            // Update state with fetched doctor data
            this.setState({
                prescription_id: data.Data.prescription_id,
                prescription_date: data.Data.prescription_date,
                notes: data.Data.notes,
                patient: data.Data.patient,
                doctor: data.Data.doctor,
                created_at: data.Data.created_at,
                updated_at: data.Data.updated_at,
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
          prescription_date,
          notes,
          prescription_id,
          client_id,
          access_token,
        } = this.state;
    
        const formData = {
          patient,
          doctor,
          prescription_date,
          notes,
          prescription_id,
          client_id,
        };
    
        try {
          const response = await axios.put(`/Prescription/Updated/`, formData, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${access_token}`,
            },
          });
    
          if (response.data.message) {
            toast.success(`${response.data.message}`,{autoClose:1000});
            // Redirect to the appropriate page after successful update
            this.props.history.push('/prescription-list'); // Assuming '/prescription-list' is the route for the prescription list page
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
            patient,
            doctor,
            prescription_date,
            notes } = this.state;
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
                                                        <Label className="form-label" htmlFor="validationTooltip01">Pateint ID</Label>
                                                        <Input type="text" className="form-control" id="validationTooltip01" value={patient} name="patient_id" placeholder="Patient ID" onChange={this.handleChange} />
                                                        <div className="valid-tooltip">
                                                            Looks good!
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col md="6">
                                                    <div className="mb-3 position-relative">
                                                        <Label className="form-label" htmlFor="validationTooltip01">Doctor ID</Label>
                                                        <Input type="text" className="form-control" id="validationTooltip01" value={doctor} name="doctor_id" placeholder="Doctor ID" onChange={this.handleChange} />
                                                        <div className="valid-tooltip">
                                                            Looks good!
                                                        </div>
                                                    </div>
                                                </Col>

                                            </Row>

                                            <Row>
                                                <Col md="6">
                                                    <div className="mb-3 position-relative">
                                                        <Label className="form-label" htmlFor="validationTooltip02">Prescription Date</Label>
                                                        <Input type="text" className="form-control" id="validationTooltip02" value={prescription_date} name="prescription_date" placeholder="Prescription Date" onChange={this.handleChange} />
                                                        <div className="valid-tooltip">
                                                            Looks good!
                                                        </div>
                                                    </div>
                                                </Col>

                                                <Col md="6">
                                                    <div className="mb-3 position-relative">
                                                        <Label className="form-label" htmlFor="validationTooltip04">Notes</Label>
                                                        <Input type="text" className="form-control" id="validationTooltip04" value={notes} name="notes" placeholder="Notes" onChange={this.handleChange} />
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

export default EditPrescription;

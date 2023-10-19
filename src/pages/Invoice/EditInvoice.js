import React, { Component } from "react";
import { Row, Col, Card, CardBody, FormGroup, Button, Label, Input, Container, InputGroup, Form } from "reactstrap";
import { toast } from 'react-toastify'; // Import toast from react-toastify
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS file for styling
// Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';

class EditInvoice extends Component {
    constructor(props) {
        super(props);
        this.state = {
            patient: "",
            invoice_date: "",
            total_amount: "",
            invoice_id: "",
            client_id:"",
        };
    }
    async componentDidMount() {
        const { match } = this.props; // React Router match object
        const invoice_id = match.params.invoice_id;
        const access = JSON.parse(localStorage.getItem('access_token'));

            // Load client_id from local storage and set it in the state
            const id = JSON.parse(localStorage.getItem('client_id'));
            if (id) {
              this.setState({ client_id: id });
              this.setState({ access_token: access });

            }
          

        try {
            const response = await fetch(`/Invoice/details-By/`,{
                method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${access}`,

        },
        body: JSON.stringify({ invoice_id, client_id: id }), // Use the updated client_id
            });
            if (!response.ok) {
                throw new Error("Network response was not ok.");
            }
            const data = await response.json();

           // console.log(data);

            // Update state with fetched doctor data
            this.setState({
                patient: data.Data.patient_id,
                invoice_date: data.Data.invoice_date,
                total_amount: data.Data.total_amount,
                invoice_id,
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
          invoice_date,
          total_amount,
          invoice_id,
          client_id,
          access_token,
        } = this.state;
    
        const formData = {
          patient,
          invoice_date,
          total_amount,
          invoice_id,
          client_id,
        };
    
        try {
          const response = await axios.put(`/Invoice/Updated/`, formData, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${access_token}`,
            },
          });
    
          if (response.data.message) {
            toast.success(`${response.data.message}`, {
                autoClose: 1000, // Duration in milliseconds (e.g., 3000ms = 3 seconds)
              });
            this.props.history.push('/invoice-list'); // Assuming 'invoice-list' is the route for the invoice list page
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
            invoice_date,
            total_amount, } = this.state;
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
                                                        <Input type="text" className="form-control" id="validationTooltip01" value={patient} name="patient"  placeholder="Patient ID" onChange={this.handleChange} />
                                                        <div className="valid-tooltip">
                                                            Looks good!
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col md="6">
                                                    <div className="mb-3 position-relative">
                                                        <Label className="form-label" htmlFor="validationTooltip01">Invoice Date</Label>
                                                        <Input type="text" className="form-control" id="validationTooltip02" value={invoice_date} name="invoice_date"  placeholder="Invoice Date" onChange={this.handleChange} />
                                                        <div className="valid-tooltip">
                                                            Looks good!
                                                        </div>
                                                    </div>
                                                </Col>
                                                
                                            </Row>

                                            <Row>
                                                <Col md="6">
                                                    <div className="mb-3 position-relative">
                                                        <Label className="form-label" htmlFor="validationTooltip02">Total Amount</Label>
                                                        <Input type="text" className="form-control" id="validationTooltip03" value={total_amount} name="total_amount"  placeholder="Total Amount" onChange={this.handleChange} />
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

export default EditInvoice;

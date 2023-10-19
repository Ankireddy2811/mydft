import React, { Component } from "react";
import { Row, Col, Card, CardBody, FormGroup, Button, Label, Input, Container, InputGroup, Form } from "reactstrap";

import { toast } from 'react-toastify'; // Import toast from react-toastify
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS file for styling
// Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';

class EditMedicine extends Component {
    constructor(props) {
        super(props);
        this.state = {
            medicine_name: "",
            manufacturer: "",
            unit_price: null,
            stock_quantity:null,
            medicine_id:"",
            client_id:"",
            access_token:"",

        };
    }
    async componentDidMount() {
        const access = JSON.parse(localStorage.getItem('access_token'));

        const { match } = this.props; // React Router match object
        const medicine_id = match.params.medicine_id;
            // Load client_id from local storage and set it in the state
            const id = JSON.parse(localStorage.getItem('client_id'));
            if (id) {
              this.setState({ client_id: id });
              this.setState({ access_token: access });

            }
          

        try {
            const response = await fetch(`/Medicine/details-By/`,{
                method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${access}`,

        },
        body: JSON.stringify({ medicine_id, client_id: id }), // Use the updated client_id
            });
            if (!response.ok) {
                throw new Error("Network response was not ok.");
            }
            const data = await response.json();

            console.log(data);

            // Update state with fetched doctor data
            this.setState({
                medicine_name: data.Data.medicine_name,
                manufacturer: data.Data.manufacturer,
                unit_price: data.Data.unit_price,
                stock_quantity: data.Data.stock_quantity,
                medicine_id:data.Data.medicine_id,
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
          medicine_name,
          manufacturer,
          unit_price,
          stock_quantity,
          medicine_id,
          client_id,
          access_token,
        } = this.state;
    
        const formData = {
          medicine_name,
          manufacturer,
          unit_price,
          stock_quantity,
          medicine_id,
          client_id,
        };
    
        try {
          const response = await axios.put(`/Medicine/Updated/`, formData, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${access_token}`,
            },
          });
    
          if (response.status === 200) {
            toast.success(response.data.message);
            this.props.history.push('/medicine-list');
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
            medicine_name,
            manufacturer,
            unit_price,
            stock_quantity, } = this.state;
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
                                                        <Label className="form-label" htmlFor="validationTooltip01">Medicine Name</Label>
                                                        <Input type="text" className="form-control" id="validationTooltip01" name="medicine_name" value={medicine_name} placeholder="Medicine Name" onChange={this.handleChange} />
                                                        <div className="valid-tooltip">
                                                            Looks good!
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col md="6">
                                                    <div className="mb-3 position-relative">
                                                        <Label className="form-label" htmlFor="validationTooltip01">Manufacturer Name</Label>
                                                        <Input type="text" className="form-control" id="validationTooltip01" name="manufacturer" value={manufacturer} placeholder="Manufacturer Name" onChange={this.handleChange} />
                                                        <div className="valid-tooltip">
                                                            Looks good!
                                                        </div>
                                                    </div>
                                                </Col>
                                                
                                            </Row>

                                            <Row>
                                                <Col md="6">
                                                    <div className="mb-3 position-relative">
                                                        <Label className="form-label" htmlFor="validationTooltip02">Unit Price</Label>
                                                        <Input type="text" className="form-control" id="validationTooltip02" name="unit_price" value={unit_price} placeholder="Unit Price" onChange={this.handleChange} />
                                                        <div className="valid-tooltip">
                                                            Looks good!
                                                        </div>
                                                    </div>
                                                </Col>
                                               
                                                <Col md="6">
                                                    <div className="mb-3 position-relative">
                                                        <Label className="form-label" htmlFor="validationTooltip04">Stock Quantity</Label>
                                                        <Input type="text" className="form-control" id="validationTooltip04" name="stock_quantity" value={stock_quantity} placeholder="Stock Quantity" onChange={this.handleChange} />
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

export default EditMedicine;

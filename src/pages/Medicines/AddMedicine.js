import React, { Component } from "react";
import { Row, Col, Card, CardBody, FormGroup, Button, Label, Input, Container, InputGroup, Form } from "reactstrap";

import { toast } from 'react-toastify'; // Import toast from react-toastify
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS file for styling
// Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';

class AddMedicine extends Component {
    constructor(props) {
        super(props);
        this.state = {
            medicine_name: "",
            manufacturer: "",
            unit_price: null,
            stock_quantity:null,
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
      medicine_name,
      manufacturer,
      unit_price,
      stock_quantity, 
      client,
      access_token,
    } = this.state;

    try {
      const response = await axios.post(`/Medicine/register/`, {
        medicine_name,
        manufacturer,
        unit_price,
        stock_quantity,
        client,
      }, {
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${access_token}`,
        }
      });

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
                                                        <Label className="form-label" htmlFor="validationTooltip01">Medicine Name</Label>
                                                        <Input type="text" className="form-control" id="validationTooltip01" name="medicine_name" placeholder="Medicine Name" onChange={this.handleChange} />
                                                        <div className="valid-tooltip">
                                                            Looks good!
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col md="6">
                                                    <div className="mb-3 position-relative">
                                                        <Label className="form-label" htmlFor="validationTooltip01">Manufacturer Name</Label>
                                                        <Input type="text" className="form-control" id="validationTooltip01" name="manufacturer" placeholder="Manufacturer Name" onChange={this.handleChange} />
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
                                                        <Input type="text" className="form-control" id="validationTooltip02" name="unit_price" placeholder="Unit Price" onChange={this.handleChange} />
                                                        <div className="valid-tooltip">
                                                            Looks good!
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col md="6">
                                                    <div className="mb-3 position-relative">
                                                        <Label className="form-label" htmlFor="validationTooltip04">Stock Quantity</Label>
                                                        <Input type="text" className="form-control" id="validationTooltip04" name="stock_quantity" placeholder="Stock Quantity" onChange={this.handleChange} />
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

export default AddMedicine;

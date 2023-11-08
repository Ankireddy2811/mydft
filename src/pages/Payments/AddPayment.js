import React, { useState, useEffect } from "react";
import { Row, Col, Card, CardBody, FormGroup, Button, Label, Input, Container, InputGroup, Form } from "reactstrap";
import { toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import { drfAddPayment } from "../../drfServer";

const AddPayment = () => {
    const [state, setState] = useState({
        invoice: "",
        payment_date: "",
        amount: "",
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
        const { name, value } = e.target;
        setState(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { invoice, payment_date, amount, client, access_token } = state;
        const formData = {
            invoice,
            payment_date,
            amount,
            client,
        };

        const headersPart = {
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${access_token}`,
            }
        };

        try {
            const response = await drfAddPayment(formData, headersPart);
            const data = response.data;

            if (data.message) {
                toast.success(data.message);
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
                                                    <Label className="form-label" htmlFor="validationTooltip01">Invoice</Label>
                                                    <Input type="text" className="form-control" id="validationTooltip01" name="invoice" placeholder="Invoice" onChange={handleChange} required />
                                                    <div className="valid-tooltip">
                                                        Looks good!
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col md="6">
                                                <div className="mb-3 position-relative">
                                                    <Label className="form-label" htmlFor="validationTooltip01">Payment Date</Label>
                                                    <Input type="text" className="form-control" id="validationTooltip01" name="payment_date" placeholder="Payment Date" onChange={handleChange} required />
                                                    <div className="valid-tooltip">
                                                        Looks good!
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="12">
                                                <div className="mb-3 position-relative">
                                                    <Label className="form-label" htmlFor="validationTooltip02">Amount</Label>
                                                    <Input type="text" className="form-control" id="validationTooltip02" name="amount" placeholder="Amount" onChange={handleChange} required />
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

export default AddPayment;

import React, { useState, useEffect } from "react";
import { Row, Col, Card, CardBody, Button, Label, Input, Container, Form } from "reactstrap";
import { toast } from 'react-toastify';
//import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { withRouter } from "react-router-dom";
//import Breadcrumbs from '../../components/Common/Breadcrumb';
import { drfUpdatePayment,drfGetSpecificPaymentDetails } from "../../drfServer";

const EditPayment = ({history,match}) => {
    const [state, setState] = useState({
        invoice: '',
        payment_date: '',
        amount: '',
        payment_id: '',
        client_id: "",
        access_token: "",
    });

    useEffect(() => {
        const fetchData = async () =>{
            const access = JSON.parse(localStorage.getItem('access_token'));
            const payment_id = match.params.payment_id;
            const id = JSON.parse(localStorage.getItem('client_id'));
        
     

        if (id) {
            setState(prevState => ({ ...prevState, client_id: id, access_token: access }));
            const formData = { payment_id, client_id: id }
            const headersPart = {
              headers: 
            {
              "Content-Type": "application/json",
              'Authorization': `Bearer ${access}`,
            }
          }
          
          try{
            const response = await drfGetSpecificPaymentDetails(formData,headersPart);

            if (!response.status === 200) {
              throw new Error('Network response was not ok.');
            } 

            const paymentData = await response.data;
            if (!paymentData){
                throw new Error("Payment data not found in the response");
              }

              setState(prevState => ({
                ...prevState,
                invoice: paymentData.Data.invoice_id,
                payment_date: paymentData.Data.payment_date,
                amount: paymentData.Data.amount,
                payment_id:paymentData.Data.payment_id
               
            }));

          }
        
          catch (error) {
            throw new Error(error);
          }
        }
        else {
            throw new Error("Client ID not found");
          }
        
        }

        fetchData();
    },[match.params.payment_id]);
           
               
               
              

    const handleChange = (e) => {
        const { name, value } = e.target;
        setState(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { invoice, payment_date, amount, payment_id, client_id, access_token } = state;

        const formData = {
            invoice,
            payment_date,
            amount,
            payment_id,
            client_id,
        };

        const headersPart = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`,
            },
        };

        try {
            const response = await drfUpdatePayment(formData, headersPart);
            const data = response.data;

            if (response.status === 200 && data.message) {
                toast.success(data.message);
                history.replace('/payment-list');
            } else {
                toast.error(data.message || "An error occurred while processing your request.");
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("An error occurred while processing your request.");
        }
    };

    const { invoice, payment_date, amount } = state;

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
                                                    <Input type="text" className="form-control" id="validationTooltip01" value={invoice} name="invoice" placeholder="Invoice" onChange={handleChange} />
                                                    <div className="valid-tooltip">
                                                        Looks good!
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col md="6">
                                                <div className="mb-3 position-relative">
                                                    <Label className="form-label" htmlFor="validationTooltip01">Payment Date</Label>
                                                    <Input type="text" className="form-control" id="validationTooltip01" value={payment_date} name="payment_date" placeholder="Payment Date" onChange={handleChange} />
                                                    <div className="valid-tooltip">
                                                        Looks good!
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="6">
                                                <div className="mb-3 position-relative">
                                                    <Label className="form-label" htmlFor="validationTooltip02">Amount</Label>
                                                    <Input type="text" className="form-control" id="validationTooltip02" value={amount} name="amount" placeholder="Amount" onChange={handleChange} />
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

export default withRouter(EditPayment);

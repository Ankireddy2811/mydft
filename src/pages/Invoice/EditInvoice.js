import React, { useState, useEffect } from 'react';
import { Row, Col, Card, CardBody, Button, Label, Input, Container, Form } from 'reactstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import { drfUpdateInvoice, drfGetSpecificInvoiceDetails } from '../../drfServer';

const EditInvoice = ({ history, match }) => {
  const [formData, setFormData] = useState({
    patient: '',
    invoice_date: '',
    total_amount: '',
    invoice_id: '',
    client_id: '',
    access_token: ''
  });

  const { patient, invoice_date, total_amount,  access_token } = formData;

  useEffect(() => {
    const fetchData = async () => {
      const id = JSON.parse(localStorage.getItem('client_id'));
      const access = JSON.parse(localStorage.getItem('access_token'));

      if (id) {
        setFormData(prevState => ({ ...prevState, client_id: id, access_token: access }));
      

      const headersPart = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access}`
        }
      };

      const formData = { invoice_id: match.params.invoice_id, client_id: id };

      try {
       
         const response = await drfGetSpecificInvoiceDetails(formData,headersPart);
         
        if (!response.status === 200) {
          throw new Error('Network response was not ok.');
        } 
        const Invoicedata = await response.data;

        if (!Invoicedata){
          throw new Error("Invoice data not found in the response");
        }
      
        
        setFormData(prevState => ({
          ...prevState,
          patient: Invoicedata.Data.patient_id,
          invoice_date: Invoicedata.Data.invoice_date,
          total_amount: Invoicedata.Data.total_amount,
          invoice_id: match.params.invoice_id
        }));
      } catch (error) {
        throw new Error(error);
      }
    }
    else {
      throw new Error("Client ID not found");
      }
    };

    fetchData();
  }, [match.params.invoice_id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const headersPart = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`
      }
    };

    try {
      const response = await drfUpdateInvoice(formData, headersPart);

      if (response.data.message) {
        toast.success(`${response.data.message}`, {
          autoClose: 1000
        });
        history.replace('/invoice-list');
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
                          <Label className="form-label" htmlFor="validationTooltip01">
                            Patient ID
                          </Label>
                          <Input
                            type="text"
                            className="form-control"
                            id="validationTooltip01"
                            value={patient}
                            name="patient"
                            placeholder="Patient ID"
                            onChange={handleChange}
                          />
                          <div className="valid-tooltip">Looks good!</div>
                        </div>
                      </Col>
                      <Col md="6">
                        <div className="mb-3 position-relative">
                          <Label className="form-label" htmlFor="validationTooltip01">
                            Invoice Date
                          </Label>
                          <Input
                            type="text"
                            className="form-control"
                            id="validationTooltip02"
                            value={invoice_date}
                            name="invoice_date"
                            placeholder="Invoice Date"
                            onChange={handleChange}
                          />
                          <div className="valid-tooltip">Looks good!</div>
                        </div>
                      </Col>
                    </Row>

                    <Row>
                      <Col md="6">
                        <div className="mb-3 position-relative">
                          <Label className="form-label" htmlFor="validationTooltip02">
                            Total Amount
                          </Label>
                          <Input
                            type="text"
                            className="form-control"
                            id="validationTooltip03"
                            value={total_amount}
                            name="total_amount"
                            placeholder="Total Amount"
                            onChange={handleChange}
                          />
                          <div className="valid-tooltip">Looks good!</div>
                        </div>
                      </Col>
                    </Row>

                    <Col md="12" className="text-center">
                      <Button color="primary" type="submit">
                        Submit form
                      </Button>
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

export default EditInvoice;

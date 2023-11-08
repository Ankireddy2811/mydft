import React, { useState, useEffect } from 'react';
import { Row, Col, Card, CardBody, Button, Label, Input, Container, Form } from 'reactstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//import Breadcrumbs from '../../components/Common/Breadcrumb';
import { drfAddInvoice } from '../../drfServer';

const AddInvoice = () => {
  const [formData, setFormData] = useState({
    patient: '',
    invoice_date: '',
    total_amount: '',
    client: '',
    access_token: ''
  });

  

  useEffect(() => {
    const access = JSON.parse(localStorage.getItem('access_token'));
    const client_id = JSON.parse(localStorage.getItem('client_id'));

    if (client_id) {
      setFormData(prevState => ({ ...prevState, client: client_id, access_token: access }));
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const headersPart = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${formData.access_token}`,
        },
      };

      const response = await drfAddInvoice(formData, headersPart);
      const data = response.data;

      if (data.message) {
        toast.success(data.message);
      } else {
        throw new Error('Something went wrong');
      }
    } catch (error) {
      console.error('Error:', error);

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
                          <Label className="form-label" htmlFor="validationTooltip01">Patient ID</Label>
                          <Input
                            type="text"
                            className="form-control"
                            id="validationTooltip01"
                            name="patient"
                            placeholder="Patient ID"
                            onChange={handleChange}
                          />
                          <div className="valid-tooltip">Looks good!</div>
                        </div>
                      </Col>
                      <Col md="6">
                        <div className="mb-3 position-relative">
                          <Label className="form-label" htmlFor="validationTooltip01">Invoice Date</Label>
                          <Input
                            type="text"
                            className="form-control"
                            id="validationTooltip01"
                            name="invoice_date"
                            placeholder="Invoice Date"
                            onChange={handleChange}
                          />
                          <div className="valid-tooltip">Looks good!</div>
                        </div>
                      </Col>
                    </Row>

                    <Row>
                      <Col md="12">
                        <div className="mb-3 position-relative">
                          <Label className="form-label" htmlFor="validationTooltip02">Total Amount</Label>
                          <Input
                            type="text"
                            className="form-control"
                            id="validationTooltip02"
                            name="total_amount"
                            placeholder="Total Amount"
                            onChange={handleChange}
                          />
                          <div className="valid-tooltip">Looks good!</div>
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

export default AddInvoice;


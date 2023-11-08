import React, { useState,useEffect } from "react";
import { Row, Col, Card, CardBody, Button, Label, Input, Container, Form } from "reactstrap";
import { toast } from 'react-toastify'; // Import toast from react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS file for styling
//import Breadcrumbs from '../../components/Common/Breadcrumb';
import {drfAddPrescriptionDetail} from "../../drfServer"

const AddPrescriptionDetails = ()=> {
    const [formData,setFormData] = useState({
            prescription: 0,
            medicine: 0,
            dosage: "",
            frequency: "",
            client:"",
            access_token:"",

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
        const { 
          prescription,
          medicine,
          dosage,
          frequency,
          client,
          access_token,
        } = formData;

        const requestFormData = {
            prescription,
            medicine,
            dosage,
            frequency,
            client,
        }

        const headersPart = {
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${access_token}`,
              }
        }
      
        try {
          const response = await drfAddPrescriptionDetail(requestFormData,headersPart);
      
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
                                                        <Label className="form-label" htmlFor="validationTooltip01">Prescription ID</Label>
                                                        <Input type="text" className="form-control" id="validationTooltip01" name="prescription" placeholder="Prescription" onChange={handleChange} required/>
                                                        <div className="valid-tooltip">
                                                            Looks good!
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col md="6">
                                                    <div className="mb-3 position-relative">
                                                        <Label className="form-label" htmlFor="validationTooltip01">Medicine ID</Label>
                                                        <Input type="text" className="form-control" id="validationTooltip01" name="medicine" placeholder="Medicine ID" onChange={handleChange} required/>
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
                                                        <Input type="text" className="form-control" id="validationTooltip02" name="dosage" placeholder="Dosage" onChange={handleChange} required/>
                                                        <div className="valid-tooltip">
                                                            Looks good!
                                                        </div>
                                                    </div>
                                                </Col>
                                               
                                                <Col md="6">
                                                    <div className="mb-3 position-relative">
                                                        <Label className="form-label" htmlFor="validationTooltip04">Frequency</Label>
                                                        <Input type="text" className="form-control" id="validationTooltip04" name="frequency" placeholder="No. of time in words" onChange={handleChange} required/>
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


export default AddPrescriptionDetails;

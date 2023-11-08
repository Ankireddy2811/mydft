import React, {useState,useEffect} from "react";
import { Row, Col, Card, CardBody, FormGroup, Button, Label, Input, Container, InputGroup, Form } from "reactstrap";
import { toast } from 'react-toastify'; // Import toast from react-toastify
// import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS file for styling

import Breadcrumbs from '../../components/Common/Breadcrumb';
import { drfAddPrescriptions } from "../../drfServer";

const AddPrescription = ({history})=>{
    const [formData,setFormData] = useState({
        patient: "",
        doctor: "",
        prescription_date: "",
        notes: "",
        client:"",
        access_token:"",
        prescription_time: "",
    });

    useEffect(() => {
        const access = JSON.parse(localStorage.getItem('access_token'));
        const client_id = JSON.parse(localStorage.getItem('client_id'));
    
        if (client_id) {
          setFormData(prevState => ({ ...prevState, client: client_id, access_token: access }));
        }
    }, []);
    
        

    
    
    
    const handleChange = (e) => {
        setFormData(prevState=>({ ...prevState, [e.target.name]: e.target.value }));
      };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const {patient,doctor,prescription_date,notes,client,access_token,prescription_time} = formData;
        const requestFormData = {patient,doctor,prescription_date,prescription_time,notes,client}

        const headersPart= {
                headers: {
                  "Content-Type": "application/json",
                  'Authorization': `Bearer ${access_token}`,
                }
              
        }
      
        try {
          const response = await drfAddPrescriptions(requestFormData,headersPart)
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
                                                <Col md="4">
                                                    <div className="mb-3 position-relative">
                                                        <Label className="form-label" htmlFor="validationTooltip01">Pateint ID</Label>
                                                        <Input type="text" className="form-control" id="validationTooltip01" name="patient" placeholder="Patient ID" onChange={handleChange} />
                                                        <div className="valid-tooltip">
                                                            Looks good!
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col md="4">
                                                    <div className="mb-3 position-relative">
                                                        <Label className="form-label" htmlFor="validationTooltip01">Doctor ID</Label>
                                                        <Input type="text" className="form-control" id="validationTooltip01" name="doctor" placeholder="Doctor ID" onChange={handleChange} />
                                                        <div className="valid-tooltip">
                                                            Looks good!
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col md="4">
                                                    <div className="mb-3 position-relative">
                                                        <Label className="form-label" htmlFor="validationTooltip02">Prescription Date</Label>
                                                        <Input type="text" className="form-control" id="validationTooltip02" name="prescription_date" placeholder="Date format i.e yyyy-mm-dd" onChange={handleChange} />
                                                        <div className="valid-tooltip">
                                                            Looks good!
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>

                                            <Row>
                                                <Col md="6">
                                                    <div className="mb-3 position-relative">
                                                        <Label className="form-label" htmlFor="validationTooltip02">Prescription Time</Label>
                                                        <Input type="text" className="form-control" id="validationTooltip02" name="prescription_time" placeholder="Time format i.e hr:mn:sec" onChange={handleChange} />
                                                        <div className="valid-tooltip">
                                                            Looks good!
                                                        </div>
                                                    </div>
                                                </Col>
                                               
                                                <Col md="6">
                                                    <div className="mb-3 position-relative">
                                                        <Label className="form-label" htmlFor="validationTooltip04">Notes</Label>
                                                        <Input type="text" className="form-control" id="validationTooltip04" name="notes" placeholder="Notes" onChange={handleChange} />
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


export default AddPrescription;

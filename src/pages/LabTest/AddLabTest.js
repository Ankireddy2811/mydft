import React, {useEffect, useState } from "react";
import { Row, Col, Card, CardBody, Button, Label, Input, Container,Form } from "reactstrap";
import { toast } from 'react-toastify'; // Import toast from react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS file for styling
import { drfAddLabTest } from "../../drfServer";

const AddLabTest = ()=> {

    const [formData,setFormData] = useState({
        patient: "",
        doctor: "",
        test_name:"",
        test_date:"",
        results:"",
        client:"",
        access_token:"",
    })
   
        
    useEffect(()=>{
        // Load client_id,acces_token from local storage and set it in the formData
        const access = JSON.parse(localStorage.getItem('access_token'));
        const client_id = JSON.parse(localStorage.getItem('client_id'));
        if(client_id){
            setFormData(prevState=>({...prevState,client:client_id,access_token:access}));
        }

    },[]); 
        
       
    const handleChange = (e) => {
        setFormData({...formData,[e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { 
          patient,
          doctor,
          test_name,
          test_date,
          results,
          client,
          access_token,
        } = formData;
      
      const requestFormData = {
        patient,
        doctor,
        test_name,
        test_date,
        results,
        client,
      }

      const headersPart = {
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${access_token}`
        }
      }
        try {
          const response = await drfAddLabTest(requestFormData,headersPart);
      
          if (response.data.message) {
            toast.success(response.data.message);
          }
          else {
            throw new Error('Something went wrong');
          }
        } catch (error) {
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
                                                        <Label className="form-label" htmlFor="validationTooltip01">Patient ID</Label>
                                                        <Input type="text" className="form-control" id="validationTooltip01" name="patient" placeholder="Patient ID" onChange={handleChange} required/>
                                                        <div className="valid-tooltip">
                                                            Looks good!
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col md="6">
                                                    <div className="mb-3 position-relative">
                                                        <Label className="form-label" htmlFor="validationTooltip01">Doctor ID</Label>
                                                        <Input type="text" className="form-control" id="validationTooltip01" name="doctor" placeholder="Doctor ID" onChange={handleChange} required/>
                                                        <div className="valid-tooltip">
                                                            Looks good!
                                                        </div>
                                                    </div>
                                                </Col>
                                                
                                            </Row>

                                            <Row>
                                                <Col md="6">
                                                    <div className="mb-3 position-relative">
                                                        <Label className="form-label" htmlFor="validationTooltip02">Test Name</Label>
                                                        <Input type="text" className="form-control" id="validationTooltip02" name="test_name" placeholder="Test Name" onChange={handleChange} required/>
                                                        <div className="valid-tooltip">
                                                            Looks good!
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col md="6">
                                                    <div className="mb-3 position-relative">
                                                        <Label className="form-label" htmlFor="validationTooltip02">Test Date</Label>
                                                        <Input type="text" className="form-control" id="validationTooltip02" name="test_date" placeholder="Test Date" onChange={handleChange} required/>
                                                        <div className="valid-tooltip">
                                                            Looks good!
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col md="12">
                                                    <div className="mb-3 position-relative">
                                                        <Label className="form-label" htmlFor="validationTooltip02">Results</Label>
                                                        <Input type="text" className="form-control" id="validationTooltip02" name="results" placeholder="Results" onChange={handleChange} required/>
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

export default AddLabTest;

import React, {useState,useEffect } from "react";
import { Row, Col, Card, CardBody, Button, Label, Input, Container, Form } from "reactstrap";

import { toast } from 'react-toastify'; // Import toast from react-toastify

import 'react-toastify/dist/ReactToastify.css'; // Import the CSS file for styling

import { drfUpdateLabTest ,drfGetSpecificLabTestDetails} from "../../drfServer";

const EditLabTest = ({match,history})=>{
    const [formData,setFormData]= useState({
        patient: "",
        doctor: "",
        test_name:"",
        test_date:"",
        results:"",
        lab_test_id:"",
        client_id:"",
        access_token:"",

    })

        
    useEffect(()=>{
        const fetchData = async()=>{
            const access = JSON.parse(localStorage.getItem('access_token'));
            const id = JSON.parse(localStorage.getItem('client_id'));
            const lab_test_id = match.params.lab_test_id;
            console.log(lab_test_id);
            console.log(access);
            if (id) {
                setFormData(prevState => ({ ...prevState, client_id: id, access_token: access }));
                const headersPart = {
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${access}`
                    }
                  };
            
                  const formData = { lab_test_id, client_id: id };
                  try {
       
                    const response = await drfGetSpecificLabTestDetails(formData,headersPart);
                    
                   if (!response.status === 200) {
                     throw new Error('Network response was not ok.');
                   } 
                   const LabTestData = await response.data;
           
                   if (!LabTestData){
                     throw new Error("LabTestData data not found in the response");
                   }
                 
                   
                   setFormData(prevState => ({
                    ...prevState,
                    patient:LabTestData.Data.patient_id,
                    doctor: LabTestData.Data.doctor_id,
                    test_date:LabTestData.Data.test_date,
                    test_name:LabTestData.Data.test_name,
                    results:LabTestData.Data.results,
                    lab_test_id:LabTestData.Data.lab_test_id,
                   }));
                 } catch (error) {
                   throw new Error(error);
                 }
               }
               else {
                 throw new Error("Client ID not found");
                 }
        }
        fetchData();
     

    },[match.params.lab_test_id]);

  
    const handleChange = (e) => {
        setFormData(prevState=>({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData);
        const { 
          patient,
          doctor,
          test_name,
          test_date,
          results,
          lab_test_id,
          client_id,
          access_token,
        } = formData;


        const requestFormData = {
            patient,
            doctor,
            test_name,
            test_date,
            results,
            lab_test_id,
            client_id,
          }

          console.log(access_token)
    
          const headersPart = {
            headers: {
              "Content-Type": "application/json",
              'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjk5MjAzNjE1LCJpYXQiOjE2OTc0NzU2MTUsImp0aSI6ImE5NDVlMWFjMmU4YjQwYWU4YjE2YTk5YzI3ZmVkNWYzIiwiY2xpZW50X2lkIjoiSElEMDAwMTkifQ.mIKsLB_pFagl43MNHakfpU9HD7fRRIoHs5j15mdWEoI`
            }
          }
          
        try {
          const response = await drfUpdateLabTest(requestFormData,headersPart);
      
          const data = response.data;
      
          if (data.message) {
            toast.success(`${data.message}`);
            history.replace('/lab-test-list');
          } else {
            toast.error(data.message || "An error occurred while processing your request.");
          }
        } catch (error) {
          console.error("Error:", error);
          toast.error("An error occurred while processing your request.");
        }
      };
      

    
        const { 
            patient,
            doctor,
            test_name,
            test_date,
            results,
        } = formData;
        
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
                                                        <Input type="text" className="form-control" id="validationTooltip01" value={patient} name="patient" placeholder="Patient ID" onChange={handleChange} />
                                                        <div className="valid-tooltip">
                                                            Looks good!
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col md="6">
                                                    <div className="mb-3 position-relative">
                                                        <Label className="form-label" htmlFor="validationTooltip01">Doctor ID</Label>
                                                        <Input type="text" className="form-control" id="validationTooltip01" value={doctor} name="doctor" placeholder="Doctor ID" onChange={handleChange} />
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
                                                        <Input type="text" className="form-control" id="validationTooltip02" value={test_name} name="test_name" placeholder="Test Name" onChange={handleChange} />
                                                        <div className="valid-tooltip">
                                                            Looks good!
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col md="6">
                                                    <div className="mb-3 position-relative">
                                                        <Label className="form-label" htmlFor="validationTooltip02">Test Date</Label>
                                                        <Input type="text" className="form-control" id="validationTooltip02" value={test_date} name="test_date" placeholder="Test Date" onChange={handleChange} />
                                                        <div className="valid-tooltip">
                                                            Looks good!
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col md="6">
                                                    <div className="mb-3 position-relative">
                                                        <Label className="form-label" htmlFor="validationTooltip02">Results</Label>
                                                        <Input type="text" className="form-control" id="validationTooltip02" value={results} name="results" placeholder="Results" onChange={handleChange} />
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


export default EditLabTest;

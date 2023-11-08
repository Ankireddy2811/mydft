import React, { useState, useEffect } from "react";
import { Row, Col, Card, CardBody, Button, Label, Input, Container, Form } from "reactstrap";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS file for styling
import { drfAddBed } from "../../drfServer";

const AddBed = () => {
    const [formData, setFormData] = useState({
            department: "",
            bed_number: "",
            is_occupied: false,
            client: "",
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
          department,
          is_occupied,
          client,
          access_token,
        } = formData;
        
        console.log("token =>",access_token);
        const requestFormData = {department,is_occupied,client};
        const headersPart = {
          headers :{
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`
          }
        }
        try {
           
            const response = await drfAddBed(requestFormData,headersPart);
            console.log(response);
            if (response.data.message) {
              toast.success(response.data.message); // Use toast for success notification
            } else {
              throw new Error("Something went wrong");
            } 
         
        } 
        catch (error) {
          console.error("Error:", error);
    
          if (error.response && error.response.data && error.response.data.message) {
            toast.error(error.response.data.message); // Use toast for error notification
          } else {
            toast.error("Something went wrong"); // Use toast for generic error notification
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
                                                <Col md="12">
                                                    <div className="mb-3 position-relative">
                                                        <Label className="form-label" htmlFor="validationTooltip01">Department ID</Label>
                                                        <Input type="text" className="form-control" id="validationTooltip01" name="department" placeholder="Department ID" onChange={handleChange} required />
                                                        <div className="valid-tooltip">
                                                            Looks good!
                                                        </div>
                                                    </div>
                                                </Col>
                                               
                                            </Row>

                                            <Row>
                                                <Col md="12">
                                                    <div className="mb-3 position-relative">
                                                        <Label className="form-label" htmlFor="validationTooltip02">Occupied</Label>
                                                        <select className="form-control" value={formData.is_occupied} name="is_occupied" onChange={handleChange} required >
                                                            <option value="">Select </option>
                                                            <option value="True">Yes</option>
                                                            <option value="False">No</option>
                                                        </select>
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


export default AddBed;



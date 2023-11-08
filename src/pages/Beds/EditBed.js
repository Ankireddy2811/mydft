import React, { useState,useEffect} from "react";
import { Row, Col, Card, CardBody, Button, Label, Input, Container,  Form } from "reactstrap";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS file for styling
import { drfUpdateBed,drfGetSpecificBedDetails  } from '../../drfServer'; 



const EditBed = ({match,history}) => {
    const [formData, setFormData] = useState({
      bed_id: '',
      department_id: '',
      bed_number: '',
      is_occupied: false,
      client_id: '',
      access_token: '',
    });
  
    useEffect(() => {
      const fetchData = async()=>{
      const id = JSON.parse(localStorage.getItem('client_id'));
      const access = JSON.parse(localStorage.getItem('access_token'));
      const bed_id = match.params.bed_id;
      const department_id = match.params.department_id;
  
      if (id) {
        setFormData((prevData) => ({...prevData,client_id: id,access_token: access}));
  
        const headersPart = {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${access}`
            }
          };
    
          const requestFormData = { bed_id, client_id: id, department_id };

          try{
            const response = await drfGetSpecificBedDetails(requestFormData,headersPart);
            if (!response.status === 200) {
                throw new Error('Network response was not ok.');
            } 

            const bedData = await response.data;
           

            if (!bedData){
                throw new Error("Bed data not found in the response");
              }
            
            setFormData((prevData) => ({
                ...prevData,
                bed_id: bedData.Data[0].bed_id,
                bed_number: bedData.Data[0].bed_number,
                is_occupied: bedData.Data[0].is_occupied,
                department_id: bedData.Data[0].department_id,
              }));
          

          }
          catch (error) {
            throw new Error(error);
          }
        
      }
      else{
        throw new Error("Client ID not found");
      }
    }
      fetchData();
    }, [match.params.bed_id, match.params.department_id]);
  
    const handleChange = (e) => {
       setFormData((prevData) => ({
        ...prevData,
        [e.target.name]: e.target.value,
      }));
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      const {
        bed_id,
        bed_number,
        is_occupied,
        department_id,
        client_id,
        access_token,
      } = formData;
  
      const requestFormData = {
        client_id,
        department_id,
        bed_id,
        is_occupied,
        bed_number,
      };
  
      const headersPart = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`,
        },
      };
  
      try {
        const response = await drfUpdateBed(requestFormData, headersPart);
  
        if (response.data.message) {
            toast.success(`${response.data.message}`, {
                autoClose: 1000
            });
           history.replace('/bed-list');
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
  
    const {
      bed_id,
      bed_number,
      is_occupied,
      department_id,
    } = formData;

    console.log(bed_id);
    console.log(bed_number);
    console.log(department_id);
  
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
                                                        <Label className="form-label" htmlFor="validationTooltip01">Department ID</Label>
                                                        <Input type="text" className="form-control" id="validationTooltip01" name="department_id" value={department_id} placeholder="Department ID" onChange={handleChange} />
                                                        <div className="valid-tooltip">
                                                            Looks good!
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col md="6">
                                                    <div className="mb-3 position-relative">
                                                        <Label className="form-label" htmlFor="validationTooltip01">Bed Number</Label>
                                                        <Input type="text" className="form-control" id="validationTooltip01" name="bed_number" value={bed_number} placeholder="Bed Number" onChange={handleChange} />
                                                        <div className="valid-tooltip">
                                                            Looks good!
                                                        </div>
                                                    </div>
                                                </Col>

                                            </Row>

                                            <Row>
                                                <Col md="6">
                                                    <div className="mb-3 position-relative">
                                                        <Label className="form-label" htmlFor="validationTooltip02">Occupied</Label>
                                                        <Input type="text" className="form-control" id="validationTooltip02" name="is_occupied" value={is_occupied} placeholder="Occupied" onChange={handleChange} />
                                                        <div className="valid-tooltip">
                                                            Looks good!
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col md="6">
                                                    <div className="mb-3 position-relative">
                                                        <Label className="form-label" htmlFor="validationTooltip02">Bed ID</Label>
                                                        <Input type="text" className="form-control" id="validationTooltip02" name="bed_id" value={bed_id} placeholder="Bed ID" onChange={handleChange} />
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
  
  export default EditBed;
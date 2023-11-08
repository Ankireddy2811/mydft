import React, {useState,useEffect} from "react";
import { Row, Col, Card, CardBody,  Button, Label, Input, Container, Form } from "reactstrap";
import { toast } from 'react-toastify'; // Import toast from react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS file for styling
import { drfUpdatePrescriptionDetail,drfGetSpecificPrescriptionDetails } from "../../drfServer";

const EditPrescriptionDetails = (props)=> {
   const [formData,setFormData] = useState({
            prescription:"",
            medicine:"",
            dosage:"",
            frequency:"",
            prescription_detail_id:"",
            client_id:"",
            access_token:"",

        });
    
    useEffect(()=>{
        const fetchData = async ()=>{
            const prescription_detail_id = props.match.params.prescription_detail_id;
            const access = JSON.parse(localStorage.getItem('access_token'));
            const id = JSON.parse(localStorage.getItem('client_id'));
            if (id) {
                setFormData(prevState => ({ ...prevState, client_id: id, access_token: access }));
                const headersPart = {
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${access}`
                    }
                  };
            try{
                const requestFormData = { prescription_detail_id, client_id: id }
                const response = await drfGetSpecificPrescriptionDetails(requestFormData,headersPart);
                if (!response.status === 200) {
                    throw new Error('Network response was not ok.');
                  } 
                const data = await response.data;
                setFormData(prevState=>({
                    ...prevState,
                    prescription:data.Data.prescription_id,
                    medicine:data.Data.medicine_id,
                    dosage:data.Data.dosage,
                    frequency: data.Data.frequency,
                    prescription_detail_id,
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
    },[props]);
       
          

    
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
          prescription_detail_id,
          client_id,
          access_token,
        } = formData;
    
        const requestFormData = {
          prescription,
          medicine,
          dosage,
          frequency,
          prescription_detail_id,
          client_id,
        };

        const headersPart = {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${access_token}`,
            },
          }
    
        try {
          const response = await drfUpdatePrescriptionDetail(requestFormData, headersPart);
    
          if (response.data.message) {
            toast.success(response.data.message);
            props.history.replace('/prescription-details-list'); // Assuming '/prescription-details-list' is the route for the prescription details list page
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

  
        const { prescription,medicine,dosage,frequency,} = formData;
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
                                                        <Label className="form-label" htmlFor="validationTooltip01">Prescription</Label>
                                                        <Input type="text" className="form-control" id="validationTooltip01" value={prescription} name="prescription" placeholder="Prescription" onChange={handleChange} />
                                                        <div className="valid-tooltip">
                                                            Looks good!
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col md="6">
                                                    <div className="mb-3 position-relative">
                                                        <Label className="form-label" htmlFor="validationTooltip01">Medicine</Label>
                                                        <Input type="text" className="form-control" id="validationTooltip01" value={medicine} name="medicine" placeholder="Medicine" onChange={handleChange} />
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
                                                        <Input type="text" className="form-control" id="validationTooltip02" value={dosage} name="dosage" placeholder="Dosage" onChange={handleChange} />
                                                        <div className="valid-tooltip">
                                                            Looks good!
                                                        </div>
                                                    </div>
                                                </Col>
                                               
                                                <Col md="6">
                                                    <div className="mb-3 position-relative">
                                                        <Label className="form-label" htmlFor="validationTooltip04">Frequency</Label>
                                                        <Input type="text" className="form-control" id="validationTooltip04" value={frequency} name="frequency" placeholder="Frequency" onChange={handleChange} />
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


export default EditPrescriptionDetails;

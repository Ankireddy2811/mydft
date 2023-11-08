import React, {useState,useEffect} from "react";
import { Row, Col, Card, CardBody, Button, Label, Input, Container, Form } from "reactstrap";
import { toast } from 'react-toastify'; // Import toast from react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS file for styling
import Breadcrumbs from '../../components/Common/Breadcrumb';
import { drfUpdatePrescriptions, drfGetSpecificPrescription } from "../../drfServer";

const EditPrescription = ({match,history})=> {
    
    const [formData, setFormData] = useState({
            patient: "",
            doctor: "",
            prescription_date: "",
            notes: "",
            prescription_id: "",
            client_id: "",
            access_token:"",

        });
    
    useEffect(()=>{
      const fetchData = async()=>{
        const access = JSON.parse(localStorage.getItem('access_token'));
        const id = JSON.parse(localStorage.getItem('client_id'));
        const prescription_id = match.params.prescription_id;
        if (id) {
            setFormData(prevState => ({ ...prevState, client_id: id, access_token: access,prescription_id }));
            const headersPart = {
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${access}`,
    
                },
            }
            const requestFormData = { prescription_id,client_id: id }
            try {
                const response = await drfGetSpecificPrescription(requestFormData,headersPart);
                console.log(response);
                if (!response.status === 200) {
                    throw new Error('Network response was not ok.');
                  } 
                
                const data = await response.data;
                console.log(data)
               
                setFormData((prevState)=>({
                    ...prevState,
                    prescription_id: data.Data.prescription_id,
                    prescription_date: data.Data.prescription_date,
                    notes: data.Data.notes,
                    patient: data.Data.patient,
                    doctor: data.Data.doctor,
                    created_at: data.Data.created_at,
                    updated_at: data.Data.updated_at,
                }));
            
            } catch (error) {
               throw new Error(error);
               
            }
        }
        else{
            throw new Error("Client ID not found");
        }

    };
    fetchData();
    },[match.params.prescription_id]);
       
    
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const {
          patient,
          doctor,
          prescription_date,
          notes,
          prescription_id,
          client_id,
          access_token,
        } = formData;
    
        const requestFormData = {
          patient,
          doctor,
          prescription_date,
          notes,
          prescription_id,
          client_id,
        };

        const headersPart = {
            headers: {'Content-Type': 'application/json','Authorization': `Bearer ${access_token}`},
          }
    
        try {
          const response = await drfUpdatePrescriptions(requestFormData,headersPart);
    
          if (response.data.message) {
            toast.success(`${response.data.message}`,{autoClose:1000});
            // Redirect to the appropriate page after successful update
            history.replace('/prescription-list'); // Assuming '/prescription-list' is the route for the prescription list page
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

   
        const { patient,doctor,prescription_date,notes} = formData;
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
                                                        <Label className="form-label" htmlFor="validationTooltip01">Pateint ID</Label>
                                                        <Input type="text" className="form-control" id="validationTooltip01" value={patient} name="patient_id" placeholder="Patient ID" onChange={handleChange} />
                                                        <div className="valid-tooltip">
                                                            Looks good!
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col md="6">
                                                    <div className="mb-3 position-relative">
                                                        <Label className="form-label" htmlFor="validationTooltip01">Doctor ID</Label>
                                                        <Input type="text" className="form-control" id="validationTooltip01" value={doctor} name="doctor_id" placeholder="Doctor ID" onChange={handleChange} />
                                                        <div className="valid-tooltip">
                                                            Looks good!
                                                        </div>
                                                    </div>
                                                </Col>

                                            </Row>

                                            <Row>
                                                <Col md="6">
                                                    <div className="mb-3 position-relative">
                                                        <Label className="form-label" htmlFor="validationTooltip02">Prescription Date</Label>
                                                        <Input type="text" className="form-control" id="validationTooltip02" value={prescription_date} name="prescription_date" placeholder="Prescription Date" onChange={handleChange} />
                                                        <div className="valid-tooltip">
                                                            Looks good!
                                                        </div>
                                                    </div>
                                                </Col>

                                                <Col md="6">
                                                    <div className="mb-3 position-relative">
                                                        <Label className="form-label" htmlFor="validationTooltip04">Notes</Label>
                                                        <Input type="text" className="form-control" id="validationTooltip04" value={notes} name="notes" placeholder="Notes" onChange={handleChange} />
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


export default EditPrescription;

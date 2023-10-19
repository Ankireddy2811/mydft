import React, { Component } from "react";
import { Row, Col, Card, CardBody, FormGroup, Button, Label, Input, Container, InputGroup, Form } from "reactstrap";
import { toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS file for styling
// Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';

import { drfUpdateBed } from '../../drfServer'; 

class EditBed extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bed_id: "",
            department_id: "",
            bed_number: "",
            is_occupied: false,
            client_id: null,
            access_token:"",

        };
    }
    async componentDidMount() {
        try {
            const { match } = this.props;

            // 1. Initialize client_id in the state.
            const id = JSON.parse(localStorage.getItem('client_id'));
            const access = JSON.parse(localStorage.getItem('access_token'));


            if (id) {
                this.setState({ client_id: id }, () => {

                    const bed_id = match.params.bed_id;
                    const department_id = match.params.department_id;
                    this.setState({ access_token: access });

                    // 2. Make the API call.
                    fetch(`/Bed/details-By/`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            'Authorization': `Bearer ${access}`,

                        },
                        body: JSON.stringify({ bed_id, client_id: this.state.client_id, department_id }),
                    })
                        .then((response) => {
                            if (!response.ok) {
                                throw new Error("Network response was not ok.");
                            }
                            return response.json();
                        })
                        .then((data) => {
                            console.log(data);

                            // 3. Update state with the API response data.
                            this.setState({
                                bed_id: data.Data[0].bed_id,
                                bed_number: data.Data[0].bed_number,
                                is_occupied: data.Data[0].is_occupied,
                                department_id: data.Data[0].department_id,
                            });
                        })
                        .catch((error) => {
                            console.error(error);
                            // Handle error fetching bed data
                        });
                });
            }
        } catch (error) {
            console.error(error);
            // Handle other errors
        }
    }



    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        });
    };

    handleSubmit = async (e) => {
        e.preventDefault();
        const {
          bed_id,
          bed_number,
          is_occupied,
          department_id,
          client_id,
          access_token,
        } = this.state;
    
        const formData = {
          client_id,
          department_id,
          bed_id,
          is_occupied,
          bed_number,
        };
    
        try {
            /* const apiUrl = 'https://www.iyrajewels.com/Bed/Updated/'; 
            const access_token1 = access_token; 
            
            console.log("formData =>",formData);
           
            const headers = {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${access_token1}`
            };

            

          const requestOptions = {
           method: 'PUT',
           headers: headers,
           body: JSON.stringify(formData)
          };

        const response = await fetch(apiUrl, requestOptions)
        if (response.ok){
            const data = await response.json()
        }
        else{
            throw new Error('Network response was not ok');
        } */
       
           /* const response = await drfUpdateBed(formData,{headers:{
                "Content-Type": "application/json",
                'Authorization': `Bearer ${access_token}`,
            }}) */
          
           const response = await axios.put(`/Bed/Updated/`, formData, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${access_token}`,
            },
          }); 
    
          if (response.data.message) {
            toast.success(`${response.data.message}`, {
                autoClose: 1000, // Duration in milliseconds (e.g., 3000ms = 3 seconds)
              });
              this.props.history.push('/bed-list');

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
    

    render() {
        const {
            bed_id,
            bed_number,
            is_occupied,
            department_id, } = this.state;
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid={true}>
                        <Row>
                            <Col lg={12}>
                                <Card>
                                    <CardBody>
                                        <Form className="needs-validation" method="post" id="tooltipForm" onSubmit={this.handleSubmit}>
                                            <Row>
                                                <Col md="6">
                                                    <div className="mb-3 position-relative">
                                                        <Label className="form-label" htmlFor="validationTooltip01">Department ID</Label>
                                                        <Input type="text" className="form-control" id="validationTooltip01" name="department_id" value={department_id} placeholder="Department ID" onChange={this.handleChange} />
                                                        <div className="valid-tooltip">
                                                            Looks good!
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col md="6">
                                                    <div className="mb-3 position-relative">
                                                        <Label className="form-label" htmlFor="validationTooltip01">Bed Number</Label>
                                                        <Input type="text" className="form-control" id="validationTooltip01" name="bed_number" value={bed_number} placeholder="Bed Number" onChange={this.handleChange} />
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
                                                        <Input type="text" className="form-control" id="validationTooltip02" name="is_occupied" value={is_occupied} placeholder="Occupied" onChange={this.handleChange} />
                                                        <div className="valid-tooltip">
                                                            Looks good!
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col md="6">
                                                    <div className="mb-3 position-relative">
                                                        <Label className="form-label" htmlFor="validationTooltip02">Bed ID</Label>
                                                        <Input type="text" className="form-control" id="validationTooltip02" name="bed_id" value={bed_id} placeholder="Bed ID" onChange={this.handleChange} />
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
}

export default EditBed;

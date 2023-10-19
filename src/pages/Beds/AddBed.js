import React, { Component } from "react";
import { Row, Col, Card, CardBody, FormGroup, Button, Label, Input, Container, InputGroup, Form } from "reactstrap";
import { toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS file for styling
// Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';

// import { drfAddBed } from '../../drfServer'; 


class AddBed extends Component {
    constructor(props) {
        super(props);
        this.state = {
            department: "",
            bed_number: "",
            is_occupied: false,
            client: "",
            access_token:"",

        };
    }
    componentDidMount() {
        // Load client_id from local storage and set it in the state
        const access = JSON.parse(localStorage.getItem('access_token'));

        const client_id = JSON.parse(localStorage.getItem('client_id'));
        if (client_id) {
          this.setState({ client: client_id });
          this.setState({ access_token: access });

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
          department,
          is_occupied,
          client,
          access_token,
        } = this.state;
        
        console.log("token =>",access_token);
        try {
           

              const apiUrl = 'https://www.iyrajewels.com/Bed/register/'; 
              const access_token1 = access_token; 
              const payload = {department,is_occupied,client};
              console.log("payload =>",payload);
             
              const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token1}`
              };

              

            const requestOptions = {
             method: 'POST',
             headers: headers,
             body: JSON.stringify(payload)
            };

           fetch(apiUrl, requestOptions)
           .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
           }
          return response.json();
          })
         .then(data => {
         // Handle the API response data
         console.log('Response:', data);
         })
         .catch(error => {
         // Handle any errors here
            console.error('Error:', error);
        });
              
              // Make the POST request
             /* const options = {
                method:"POST",
                headers:{
                  'Content-Type': 'application/json',
                   'Authorization': `Bearer ${access_token1}`
                },
                body:JSON.stringify(payload)
              }
              const response = await fetch(apiUrl,options)
              console.log(response) */

              /* axios.post(apiUrl, payload, { headers })
              .then(response => {
                // Handle the API response here
                console.log('Response:', response.data);
              })
              .catch(error => {
                // Handle any errors here
                console.error('Error:', error);
              }); */
              

           /* const response = await axios.post("/Bed/register/", {
            department,
            is_occupied,
            client,
          }, {
            headers: {
              "Content-Type": "application/json",
              'Authorization': `Bearer ${access_token}`,
            }
          }); */
    
          /* const data = response.data;
    
          if (data.message) {
            toast.success(data.message); // Use toast for success notification
          } else {
            throw new Error("Something went wrong");
          } */
        } catch (error) {
          console.error("Error:", error);
    
          if (error.response && error.response.data && error.response.data.message) {
            toast.error(error.response.data.message); // Use toast for error notification
          } else {
            toast.error("Something went wrong"); // Use toast for generic error notification
          }
        } 
      };
    render() {
        const {
            department,
            is_occupied,
            client,
        } = this.state;
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
                                                <Col md="12">
                                                    <div className="mb-3 position-relative">
                                                        <Label className="form-label" htmlFor="validationTooltip01">Department ID</Label>
                                                        <Input type="text" className="form-control" id="validationTooltip01" name="department" placeholder="Department ID" onChange={this.handleChange} required />
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
                                                        <select className="form-control" value={is_occupied} name="is_occupied" onChange={this.handleChange} required >
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
}

export default AddBed;

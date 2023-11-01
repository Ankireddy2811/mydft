import React, { Component } from "react";
import axios from 'axios';
import { Row, Col, Card, CardBody, FormGroup, Button, Label, Input, Container, InputGroup, Form } from "reactstrap";
import { toast } from 'react-toastify'; // Import toast from react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS file for styling


import 'react-datepicker/dist/react-datepicker.css';


class ViewDoctorsList extends Component {

  render() {
   
    return (
      <React.Fragment>
        <div className="page-content">
          <Container fluid={true}>
            
            <Row>
              <Col lg={12}>
                <Card>
                  <CardBody>
                  <div>
                    <h1>This is Doctors List</h1>
                    </div>
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

export default ViewDoctorsList;

import React from "react";
import { Row, Col, Card, CardBody,Container } from "reactstrap";
// import { toast } from 'react-toastify'; // Import toast from react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS file for styling
import 'react-datepicker/dist/react-datepicker.css';


const NotFound = ()=>(
      <React.Fragment>
        <div className="page-content">
          <Container fluid={true}>
            
            <Row>
              <Col lg={12}>
                <Card>
                  <CardBody>
                
                  <div className="text-center">
                   <h1 style={{ color: 'red',fontSize:"30px" }}>404 - Page Not Found</h1>
                    <p style={{ fontSize: '18px',color:"black" }}>The page you are looking for does not exist.</p>
                    <img src="https://assets.ccbp.in/frontend/react-js/not-found-blog-img.png" alt="not-found"/>s
                  </div>
                    
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </React.Fragment>
    );
  


export default NotFound;

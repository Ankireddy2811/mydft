import React, { useState,useEffect } from 'react';
import { Row, Col, Alert, Button, Container, Label } from 'reactstrap';
import { toast } from 'react-toastify';
//import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { withRouter, Link } from 'react-router-dom';
import { AvForm, AvField } from 'availity-reactstrap-validation';
//import logodark from '../../assets/images/logo-dark.png';
import logolight from '../../assets/images/logo-light.png';
import { drfForgetPassword } from "../../drfServer";

const ForgetPasswordPage = (props) =>{
  const [formData,setFormData] = useState({
    email:"",
    access_token:""

  });

useEffect(()=>{
  const access = JSON.parse(localStorage.getItem("access_token"))
  setFormData(prevState=>({...prevState,access_token:access}))
})

  
  const handleValidSubmit = async (e) => {
    e.preventDefault();
    const {email} = formData;

    try {
      const response = await drfForgetPassword({ email });

      if (response.data.message) {
        toast.success(response.data.message, {
          autoClose: 1000,
        });
      } else {
        const data = response.data;
        if (data.error_message.password) {
          toast.error(data.error_message.password, {
            autoClose: 1000,
          });
        }
        if (data.error_message.email) {
          toast.error(data.error_message.email, {
            autoClose: 1000,
          });
        }
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred while processing your request.', {
        autoClose: 3000,
      });
    }
  };

  const handleEmailChange = (e) => {
    setFormData(prevState=>({...prevState,[e.target.name] :e.target.value}));
  };

  return (
    <div>
      <Container fluid className="p-0">
        <Row className="g-0">
          <Col lg={4}>
            <div className="authentication-page-content p-4 d-flex align-items-center min-vh-100">
              <div className="w-100">
                <Row className="justify-content-center">
                  <Col lg={9}>
                    <div>
                      <div>
                        <Link to="/" className="">
                          <img
                            src={logolight}
                            alt=""
                            height="40"
                            className="auth-logo logo-dark mx-auto"
                          />
                          <img
                            src={logolight}
                            alt=""
                            height="40"
                            className="auth-logo logo-light mx-auto"
                          />
                        </Link>
                      </div>
                      <div className="text-center">
                        <h4 className="font-size-18 mt-4">Reset Password</h4>
                        <p className="text-muted">Reset your password to orionqo.</p>
                      </div>

                      <div className="p-2 mt-5">
                        {props.forgetError && props.forgetError ? (
                          <Alert color="danger" className="mb-4">
                            {props.forgetError}
                          </Alert>
                        ) : null}
                        {props.message ? (
                          <Alert color="success" className="mb-4">
                            {props.message}
                          </Alert>
                        ) : null}
                        <AvForm
                          className="form-horizontal"
                          onValidSubmit={handleValidSubmit}
                        >
                          <div className="auth-form-group-custom mb-4">
                            <i className="ri-mail-line auti-custom-input-icon"></i>
                            <Label htmlFor="useremail">Email</Label>
                            <AvField
                              name="useremail"
                              value={formData.email}
                              onChange={handleEmailChange}
                              type="email"
                              validate={{ email: true, required: true }}
                              className="form-control"
                              id="useremail"
                              placeholder="Enter email"
                            />
                          </div>

                          <div className="mt-4 text-center">
                            <Button
                              color="primary"
                              className="w-md waves-effect waves-light"
                              type="submit"
                            >
                              {props.loading ? 'Loading...' : 'Reset'}
                            </Button>
                          </div>
                        </AvForm>
                      </div>

                      <div className="mt-5 text-center">
                        <p>
                          Don't have an account ?{' '}
                          <Link to="/login" className="fw-medium text-primary">
                            Log in
                          </Link>{' '}
                        </p>
                        <p>
                          © 2023 orionqo. Crafted with{' '}
                          <i className="mdi mdi-heart text-danger"></i> by orionqo
                        </p>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </Col>
          <Col lg={8}>
            <div className="authentication-bg">
              <div className="bg-overlay"></div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default withRouter(ForgetPasswordPage);

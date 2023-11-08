import React, { useState } from 'react';
import { Row, Col, Input, Button, Alert, Container, Label } from 'reactstrap';
import { withRouter, Link } from 'react-router-dom';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { toast } from 'react-toastify';
//import axios from 'axios';
import { ClipLoader } from 'react-spinners';
//import logodark from '../../assets/images/logo-dark.png';
import logolight from '../../assets/images/logo-light.png';
import { css } from '@emotion/react';

import { drfLogin } from '../../drfServer';

const Login = props =>{
  const [state, setState] = useState({
    email: '',
    password: '',
    isLoading: false,
  });

  const handleChange = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = state;

    try {
      setState({ ...state, isLoading: true });
      const response = await drfLogin({ email, password });

      const data = response.data;

      if (data.message) {
        toast.success(`${data.message}`, {
          autoClose: 1000,
        });
        localStorage.setItem('access_token', JSON.stringify(data.access_token));
        localStorage.setItem('refresh_token', JSON.stringify(data.refresh_token));
        localStorage.setItem('client_id', JSON.stringify(data.client_id));
        localStorage.setItem('is_admin', JSON.stringify(data.is_admin));

        if (data.is_admin === true) {
          props.history.replace('/admin-dashboard');
        }
        if (data.is_admin === false) {
          props.history.replace('/dashboard');
        }
      } else {
        if (data.error_message.password) {
          toast.error(data.error_message.password);
        }
        if (data.error_message.email) {
          toast.error(data.error_message.email);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred while processing your request.');
    } finally {
      setState({ ...state, isLoading: false });
    }
  };

  const override = css`
    display: block;
    margin: 0 auto;
  `;

  return (
    <React.Fragment>
      <div>
        <Container fluid className="p-0">
          <Row className="g-0">
            <Col lg={4}>
              <div className="authentication-page-content p-4 d-flex align-items-center min-vh-100">
                <div className="w-100">
                  <Row className="justify-content-center">
                    <Col lg={9}>
                      <div>
                        <div className="text-center">
                          <div>
                            <Link to="/" className="">
                              <img src={logolight} alt="" height="40" className="auth-logo logo-dark mx-auto" />
                              <img src={logolight} alt="" height="40" className="auth-logo logo-light mx-auto" />
                            </Link>
                          </div>

                          <h4 className="font-size-18 mt-4">Welcome Back !</h4>
                          <p className="text-muted">Sign in to continue to orionqo.</p>
                        </div>

                        {props.loginError && props.loginError ? <Alert color="danger">{props.loginError}</Alert> : null}

                        <div className="p-2 mt-5">
                          <AvForm className="form-horizontal" onValidSubmit={handleSubmit}>
                            <div className="auth-form-group-custom mb-4">
                              <i className="ri-user-2-line auti-custom-input-icon"></i>
                              <Label htmlFor="username">Username</Label>
                              <AvField
                                name="email"
                                value={state.email}
                                type="email"
                                onChange={handleChange}
                                className="form-control"
                                id="email"
                                validate={{ email: true, required: true }}
                                placeholder="Enter username"
                              />
                            </div>

                            <div className="auth-form-group-custom mb-4">
                              <i className="ri-lock-2-line auti-custom-input-icon"></i>
                              <Label htmlFor="userpassword">Password</Label>
                              <AvField
                                name="password"
                                value={state.password}
                                type="password"
                                onChange={handleChange}
                                className="form-control"
                                id="userpassword"
                                placeholder="Enter password"
                              />
                            </div>

                            <div className="form-check">
                              <Input type="checkbox" className="form-check-input" id="customControlInline" />
                              <Label className="form-check-label" htmlFor="customControlInline">
                                Remember me
                              </Label>
                            </div>

                            <div className="mt-4 text-center">
                              <div className="mt-4 text-center">
                                {state.isLoading ? (
                                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                                    <ClipLoader color={'#ffffff'} loading={state.isLoading} css={override} size={50} />
                                  </div>
                                ) : null}

                                <Button
                                  color="primary"
                                  className="w-md waves-effect waves-light"
                                  type="submit"
                                  disabled={state.isLoading}
                                  style={{ height: '50px', position: 'relative' }}
                                >
                                  Log In
                                </Button>
                              </div>
                            </div>

                            <div className="mt-4 text-center">
                              <Link to="/forgot-password" className="text-muted">
                                <i className="mdi mdi-lock me-1"></i> Forgot your password?
                              </Link>
                            </div>
                          </AvForm>
                        </div>

                        <div className="mt-5 text-center">
                          <p>© 2023 orionqo. Crafted with <i className="mdi mdi-heart text-danger"></i> by orionqo</p>
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
    </React.Fragment>
  );
}

export default withRouter(Login);

















import React, { Component } from 'react';
import { Row, Col, Input, Button, Alert, Container, Label } from "reactstrap";
import { withRouter, Link } from 'react-router-dom';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { toast } from 'react-toastify'; // Import toast from react-toastify
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS file for styling
import { ClipLoader } from "react-spinners"; // Import ClipLoader from react-spinners
import logodark from "../../assets/images/logo-dark.png";
import logolight from "../../assets/images/logo-light.png";
import { css } from "@emotion/react";

import { drfLogin } from '../../drfServer'; 




class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            isLoading: false, // Add isLoading state
        };

    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        });
    };
    handleSubmit = async (e) => {
        e.preventDefault();
        const { email, password } = this.state;

        try {
            this.setState({ isLoading: true }); // Start loading
            const response = await drfLogin({ email,
                password})

            const data = response.data;

            if (data.message) {
                toast.success(`${data.message}`, {
                    autoClose: 1000, // Duration in milliseconds (e.g., 3000ms = 3 seconds)
                });
                localStorage.setItem("access_token", JSON.stringify(data.access_token));
                localStorage.setItem("refresh_token", JSON.stringify(data.refresh_token));
                localStorage.setItem("client_id", JSON.stringify(data.client_id));
                localStorage.setItem("is_admin", JSON.stringify(data.is_admin));
                // Use toast.success for success messages

                if (data.is_admin === true) {
                    this.props.history.push("/admin-dashboard");
                }
                if (data.is_admin === false) {
                    this.props.history.push("/dashboard");
                }
            } else {
                // Display error messages using toast.error
                if (data.error_message.password) {
                    toast.error(data.error_message.password);
                }
                if (data.error_message.email) {
                    toast.error(data.error_message.email);
                }
            }
        } catch (error) {
            console.error("Error:", error);
            // Handle any network or other errors here
            // Use toast.error for error messages
            toast.error("An error occurred while processing your request.");
        }
        finally {
            this.setState({ isLoading: false }); // Stop loading
        }
    };

    render() {
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
                                                            <Link to="/" class="">
                                                                <img src={logolight} alt="" height="40" class="auth-logo logo-dark mx-auto" />
                                                                <img src={logolight} alt="" height="40" class="auth-logo logo-light mx-auto" />
                                                            </Link>
                                                        </div>

                                                        <h4 className="font-size-18 mt-4">Welcome Back !</h4>
                                                        <p className="text-muted">Sign in to continue to orionqo.</p>
                                                    </div>

                                                    {this.props.loginError && this.props.loginError ? <Alert color="danger">{this.props.loginError}</Alert> : null}

                                                    <div className="p-2 mt-5">
                                                        <AvForm className="form-horizontal" onValidSubmit={this.handleSubmit} >
                                                            <div className="auth-form-group-custom mb-4">
                                                                <i className="ri-user-2-line auti-custom-input-icon"></i>
                                                                <Label htmlFor="username">Username</Label>
                                                                <AvField name="email" value={this.state.email} type="email" onChange={this.handleChange} className="form-control" id="email" validate={{ email: true, required: true }} placeholder="Enter username" />
                                                            </div>

                                                            <div className="auth-form-group-custom mb-4">
                                                                <i className="ri-lock-2-line auti-custom-input-icon"></i>
                                                                <Label htmlFor="userpassword">Password</Label>
                                                                <AvField name="password" value={this.state.password} type="password" onChange={this.handleChange} className="form-control" id="userpassword" placeholder="Enter password" />
                                                            </div>

                                                            <div className="form-check">
                                                                <Input type="checkbox" className="form-check-input" id="customControlInline" />
                                                                <Label className="form-check-label" htmlFor="customControlInline">Remember me</Label>
                                                            </div>

                                                            <div className="mt-4 text-center">
                                                                <div className="mt-4 text-center">
                                                                    {this.state.isLoading ? (
                                                                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                                                                            <ClipLoader color={"#ffffff"} loading={this.state.isLoading} css={override} size={50} />
                                                                        </div>
                                                                    ) : null}

                                                                    <Button
                                                                        color="primary"
                                                                        className="w-md waves-effect waves-light"
                                                                        type="submit"
                                                                        disabled={this.state.isLoading}
                                                                        style={{ height: '50px', position: 'relative' }}
                                                                    >
                                                                        Log In
                                                                    </Button>
                                                                </div>



                                                            </div>

                                                            <div className="mt-4 text-center">
                                                                <Link to="/forgot-password" className="text-muted"><i className="mdi mdi-lock me-1"></i> Forgot your password?</Link>
                                                            </div>
                                                        </AvForm>
                                                    </div>

                                                    <div className="mt-5 text-center">
                                                        {/* <p>Don't have an account ? <Link to="/register" className="fw-medium text-primary"> Register </Link> </p> */}
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
}

export default Login;

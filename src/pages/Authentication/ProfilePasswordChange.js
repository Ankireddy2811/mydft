import React, { Component } from "react";
import { Row, Col, Alert, Button, Container, Label } from "reactstrap";
import { toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS file for stylingimport { withRouter, Link } from "react-router-dom";
import { AvForm, AvField } from "availity-reactstrap-validation";
import { withRouter, Link } from 'react-router-dom';
import logodark from "../../assets/images/logo-dark.png";
import logolight from "../../assets/images/logo-light.png";
class ProfilePasswordChange extends Component {
    constructor(props) {
        super(props);
        this.state = {
            old_password: "",
            new_password: "",
            confirm_password: "",
            access_token: "",
        };
    }
    async componentDidMount() {
        // Access the URL parameters using this.props.match.params
        const access = JSON.parse(localStorage.getItem('access_token'));

        // Set the uid and token in the component's state
        this.setState({ access_token: access });
    }

    handleValidSubmit = async (e) => {
        e.preventDefault();
        const { old_password, new_password, confirm_password, access_token } = this.state;

        try {
            const response = await axios.post(
                `/Hospital/change-password/`,
                {
                    old_password,
                    new_password,
                    confirm_password,
                },
                {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                    },
                }
            );

            if (response.data.message) {
                window.alert(response.data.message);
                this.props.history.push('/');
            } else {
                const data = response.data;
                if (data.error_message.password) {
                    // Handle password error
                }
                if (data.error_message.email) {
                    // Handle email error
                }
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        });
    };

    render() {
        const { old_password, new_password, confirm_password, } = this.state;
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
                                                        <div>
                                                            <h4 className="font-size-18 mt-4">Reset Password</h4>
                                                            <p className="text-muted">Reset your password to orionqo.</p>
                                                        </div>
                                                    </div>

                                                    <div className="p-2 mt-5">
                                                        {this.props.forgetError && this.props.forgetError ? (
                                                            <Alert color="danger" className="mb-4">
                                                                {this.props.forgetError}
                                                            </Alert>
                                                        ) : null}
                                                        {this.props.message ? (
                                                            <Alert color="success" className="mb-4">
                                                                {this.props.message}
                                                            </Alert>
                                                        ) : null}
                                                        <AvForm
                                                            className="form-horizontal"
                                                            onValidSubmit={this.handleValidSubmit}
                                                        >
                                                            <div className="auth-form-group-custom mb-4">
                                                                <i className="ri-lock-2-line auti-custom-input-icon"></i>
                                                                <Label htmlFor="password">Old Password</Label>
                                                                <AvField
                                                                    name="old_password"
                                                                    value={old_password}
                                                                    onChange={this.handleChange}
                                                                    type="password"
                                                                    validate={{
                                                                        required: { value: true, errorMessage: "Password is required" },

                                                                    }}
                                                                    className="form-control"
                                                                    id="password"
                                                                    placeholder="Old password"
                                                                />

                                                            </div>
                                                            <div className="auth-form-group-custom mb-4">
                                                                <i className="ri-lock-2-line auti-custom-input-icon"></i>
                                                                <Label htmlFor="password">New Password</Label>
                                                                <AvField
                                                                    name="new_password"
                                                                    value={new_password}
                                                                    onChange={this.handleChange}
                                                                    type="password"
                                                                    validate={{
                                                                        required: { value: true, errorMessage: "Confirm Password is required" },
                                                                    }}
                                                                    className="form-control"
                                                                    id="password2"
                                                                    placeholder="New Password"
                                                                />
                                                            </div>
                                                            <div className="auth-form-group-custom mb-4">
                                                                <i className="ri-lock-2-line auti-custom-input-icon"></i>
                                                                <Label htmlFor="password">Confirm Password</Label>
                                                                <AvField
                                                                    name="confirm_password"
                                                                    value={confirm_password}
                                                                    onChange={this.handleChange}
                                                                    type="password"
                                                                    validate={{
                                                                        required: { value: true, errorMessage: "Confirm Password is required" },
                                                                        match: { value: "new_password", errorMessage: "Passwords do not match" },
                                                                    }}
                                                                    className="form-control"
                                                                    id="password3"
                                                                    placeholder="Confirm Password"
                                                                />
                                                            </div>

                                                            <div className="mt-4 text-center">
                                                                <Button
                                                                    color="primary"
                                                                    className="w-md waves-effect waves-light"
                                                                    type="submit"
                                                                >
                                                                    {this.props.loading ? "Loading..." : "Reset"}
                                                                </Button>
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
}
export default withRouter(ProfilePasswordChange);

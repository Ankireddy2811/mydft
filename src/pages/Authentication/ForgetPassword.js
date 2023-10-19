import React, { Component } from "react";
import { Row, Col, Alert, Button, Container, Label } from "reactstrap";
import { toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS file for styling
import { withRouter, Link } from "react-router-dom";
import { AvForm, AvField } from "availity-reactstrap-validation";
import logodark from "../../assets/images/logo-dark.png";
import logolight from "../../assets/images/logo-light.png";

import { drfForgetPassword } from "../../drfServer";

class ForgetPasswordPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      access_token: "", // Initialize email state
    };
  }

  handleValidSubmit = async (e) => {
    e.preventDefault();
    const { email, access_token } = this.state;

    const access = JSON.parse(localStorage.getItem("access_token"));
    this.setState({ access_token: access });

    try {
      const response = await drfForgetPassword({
        email: email,
      });

      if (response.data.message) {
        // Use toast.success for success messages
        toast.success(response.data.message, {
          autoClose: 1000, // Duration in milliseconds (e.g., 3000ms = 3 seconds)
        });
      } else {
        const data = response.data;
        if (data.error_message.password) {
          // Use toast.error for password error messages
          toast.error(data.error_message.password, {
            autoClose: 1000,
          });
        }
        if (data.error_message.email) {
          // Use toast.error for email error messages
          toast.error(data.error_message.email, {
            autoClose: 1000,
          });
        }
      }
    } catch (error) {
      console.error("Error:", error);
      // Use toast.error for network or other error messages
      toast.error("An error occurred while processing your request.", {
        autoClose: 3000,
      });
    }
  };

  handleEmailChange = (e) => {
    this.setState({ email: e.target.value });
  };

  render() {
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
                          <div>
                            <Link to="/" class="">
                              <img
                                src={logolight}
                                alt=""
                                height="40"
                                class="auth-logo logo-dark mx-auto"
                              />
                              <img
                                src={logolight}
                                alt=""
                                height="40"
                                class="auth-logo logo-light mx-auto"
                              />
                            </Link>
                          </div>
                          <div className="text-center">
                            <h4 className="font-size-18 mt-4">
                              Reset Password
                            </h4>
                            <p className="text-muted">
                              Reset your password to orionqo.
                            </p>
                          </div>

                          <div className="p-2 mt-5">
                            {this.props.forgetError &&
                            this.props.forgetError ? (
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
                                <i className="ri-mail-line auti-custom-input-icon"></i>
                                <Label htmlFor="useremail">Email</Label>
                                <AvField
                                  name="useremail"
                                  value={this.state.email}
                                  onChange={this.handleEmailChange}
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
                                  {this.props.loading ? "Loading..." : "Reset"}
                                </Button>
                              </div>
                            </AvForm>
                          </div>

                          <div className="mt-5 text-center">
                            <p>
                              Don't have an account ?{" "}
                              <Link
                                to="/login"
                                className="fw-medium text-primary"
                              >
                                Log in
                              </Link>{" "}
                            </p>
                            <p>
                              © 2023 orionqo. Crafted with{" "}
                              <i className="mdi mdi-heart text-danger"></i> by
                              orionqo
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
      </React.Fragment>
    );
  }
}

export default withRouter(ForgetPasswordPage);

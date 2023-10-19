import React, { Component } from "react";
import { drfFeedback } from "../../drfServer";

class FeedbackPopup extends Component {
    constructor(props) {
      super(props);
      this.state = {
        isOpen: false,
        email: "",
        notes: "",
        showButton: true,
        client: "", // Keep one "client" property
        access_token: "",
      };
    }
  
    componentDidMount() {
      // Load client_id from local storage and set it in the state
      const access = JSON.parse(localStorage.getItem("access_token"));
      const client_id = JSON.parse(localStorage.getItem("client_id"));
  
      if (client_id) {
        this.setState({ client: client_id, access_token: access });
      }
    }
  
    togglePopup = () => {
      this.setState((prevState) => ({
        isOpen: !prevState.isOpen,
        showButton: false,
      }));
    };
  
    handleInputChange = (event) => {
      const { name, value } = event.target;
      this.setState({ [name]: value });
    };
  
    handleSubmit = async (event) => {
      event.preventDefault(); // Prevent the default form submission behavior
  
      const { email, notes, client, access_token } = this.state; // Include client_id
  
      const data = {
        email,
        notes,
        client,
      };
  
      try {
        const response = await drfFeedback(data, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
        });
  
        console.log(response); // Log the server response
  
        if (response.data.message) {
          console.log("Feedback submitted successfully");
          this.togglePopup();
        }
      } catch (error) {
        console.error("Error submitting feedback:", error);
      }
    };

  render() {
    const { isOpen, email, notes, showButton } = this.state;

    return (
      <div>
        {showButton && (
          <button
            onClick={this.togglePopup}
            className="btn btn-primary position-fixed bottom-0 end-0 m-3"
          >
            Give Feedback
          </button>
        )}
        {isOpen && (
          <div className={`feedback-popup position-fixed end-0 bottom-0 p-3`}>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Feedback Form</h5>
                <form onSubmit={this.handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={email}
                      onChange={this.handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="notes" className="form-label">
                      Notes
                    </label>
                    <textarea
                      className="form-control"
                      id="notes"
                      name="notes"
                      value={notes}
                      onChange={this.handleInputChange}
                      required
                    ></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Submit
                  </button>
                  <button
                    onClick={this.togglePopup}
                    className="btn btn-secondary ms-2"
                  >
                    Close
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default FeedbackPopup;

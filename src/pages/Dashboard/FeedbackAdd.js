import React, { useState, useEffect } from "react";
import { drfFeedback } from "../../drfServer";

const FeedbackPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [showButton, setShowButton] = useState(true);
  const [client, setClient] = useState("");
  const [accessToken, setAccessToken] = useState("");

  useEffect(() => {
    const access = JSON.parse(localStorage.getItem("access_token"));
    const clientId = JSON.parse(localStorage.getItem("client_id"));

    if (clientId) {
      setClient(clientId);
      setAccessToken(access);
    }
  }, []);

  const togglePopup = () => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
    setShowButton(false);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "email") {
      setEmail(value);
    } else if (name === "notes") {
      setNotes(value);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = {
      email,
      notes,
      client,
    };

    const headersPart =  {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }

    try {
      const response = await drfFeedback(data,headersPart);

      console.log(response);

      if (response.data.message) {
        console.log("Feedback submitted successfully");
        togglePopup();
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };

  return (
    <div>
      {showButton && (
        <button
          onClick={togglePopup}
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
              <form onSubmit={handleSubmit}>
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
                    onChange={handleInputChange}
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
                    onChange={handleInputChange}
                    required
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
                <button
                  onClick={togglePopup}
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
};

export default FeedbackPopup;

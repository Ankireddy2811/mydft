

import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { toast } from 'react-toastify'; // Import toast from react-toastify
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS file for styling



// import { drfLogout } from '../../drfServer'; 



class Logout extends Component {
  componentDidMount() {
    // Remove data from local storage (e.g., user token)
    const itemsToRemove = ['access_token', 'refresh_token', 'client_id', 'is_admin'];

    // Loop through the array and remove each item
    itemsToRemove.forEach(item => {
      localStorage.removeItem(item);
    });

    
    // Redirect to the login page
    this.props.history.push('/login');
  }

  render() {
    return (
      <div>
        Logging out...
      </div>
    );
  }
}

export default Logout;

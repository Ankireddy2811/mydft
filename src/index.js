import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS file for styling
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import store from './store';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render (
    <Provider store={store}>
        <BrowserRouter>
        <ToastContainer autoClose={1200} /> {/* Add the ToastContainer here */}
             <App />
        </BrowserRouter>
    </Provider>
);

serviceWorker.unregister();
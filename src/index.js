import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';

const Main=()=> {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <ToastContainer autoClose={1200} />
        <App />
      </BrowserRouter>
    </Provider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Main />);
serviceWorker.unregister();

/* import React, { Component } from 'react';
import { withRouter } from "react-router-dom";

class NonAuthLayout extends Component {
    constructor(props) {
        super(props);
        this.state={};
        this.capitalizeFirstLetter.bind(this);
    }
    
    capitalizeFirstLetter = string => {
        return string.charAt(1).toUpperCase() + string.slice(2);
      };

    componentDidMount(){
        let currentage = this.capitalizeFirstLetter(this.props.location.pathname);
        currentage = currentage.replaceAll("-" , " ");

        document.title =
          currentage + " | orionqo ";
    }
    render() {
        return <React.Fragment>
            {this.props.children}
        </React.Fragment>;
    }
}

export default (withRouter(NonAuthLayout)); */


/* import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';

const NonAuthLayout = (props) => {
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  useEffect(() => {
    let currentPath = capitalizeFirstLetter(props.location.pathname);
    currentPath = currentPath.replaceAll('-', ' ');

    document.title = currentPath + ' | orionqo';
  }, [props.location.pathname]);

  return <React.Fragment>{props.children}</React.Fragment>;
};

export default withRouter(NonAuthLayout); */



import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const NonAuthLayout = ({ children }) => {
  const location = useLocation();

  const capitalizeFirstLetter = string => {
    return string.charAt(1).toUpperCase() + string.slice(2);
  };

  useEffect(() => {
    const currentPath = capitalizeFirstLetter(location.pathname);
    const formattedPath = currentPath.replaceAll("-", " ");

    document.title = formattedPath + " | orionqo";
  }, [location.pathname]);

  return (
    <React.Fragment>
      {children}
    </React.Fragment>
  );
};

export default NonAuthLayout;

/* import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  changeLayout,
  changeSidebarTheme,
  changeSidebarType,
  toggleRightSidebar,
  changeTopbarTheme,
  changeLayoutTheme,
  changeLayoutWidth
} from "../../store/actions";

// Layout Related Components
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import Rightbar from "../CommonForBoth/Rightbar";

const Layout = (props) => {
  const [isMobile, setIsMobile] = useState(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));

  const toggleMenuCallback = () => {
    if (props.leftSideBarType === "default") {
      props.changeSidebarType("condensed", isMobile);
    } else if (props.leftSideBarType === "condensed") {
      props.changeSidebarType("default", isMobile);
    }
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(1).toUpperCase() + string.slice(2);
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    let currentage = capitalizeFirstLetter(props.location.pathname);
    currentage = currentage.replaceAll("-", " ");

    document.title = currentage + " | orionqo ";

    if (props.leftSideBarTheme) {
      props.changeSidebarTheme(props.leftSideBarTheme);
    }

    if (props.layoutWidth) {
      props.changeLayoutWidth(props.layoutWidth);
    }

    if (props.leftSideBarType) {
      props.changeSidebarType(props.leftSideBarType);
    }

    if (props.topbarTheme) {
      props.changeTopbarTheme(props.topbarTheme);
    }

    if (props.theme) {
      props.changeLayoutTheme(props.theme);
    }

    if (props.showRightSidebar) {
      toggleRightSidebar();
    }
    
    // Handle isPreloader logic
    if (props.isPreloader === true) {
      document.getElementById('preloader').style.display = "block";
      document.getElementById('status').style.display = "block";

      setTimeout(function () {
        document.getElementById('preloader').style.display = "none";
        document.getElementById('status').style.display = "none";
      }, 2500);
    } else {
      document.getElementById('preloader').style.display = "none";
      document.getElementById('status').style.display = "none";
    }
  

  }, [
    props.location.pathname,
    props.leftSideBarTheme,
    props.layoutWidth,
    props.leftSideBarType,
    props.topbarTheme,
    props.theme,
    props.showRightSidebar,
    props.isPreloader
  ]);

  const toggleRightSidebar = () => {
    props.toggleRightSidebar();
  };

  return (
    <React.Fragment>
      <div id="preloader">
        <div id="status">
          <div className="spinner">
            <i className="ri-loader-line spin-icon"></i>
          </div>
        </div>
      </div>

      <div id="layout-wrapper">
        <Header toggleMenuCallback={toggleMenuCallback} toggleRightSidebar={toggleRightSidebar} />
        <Sidebar theme={props.leftSideBarTheme} type={props.leftSideBarType} isMobile={isMobile} />
        <div className="main-content">
          {props.children}
          <Footer />
        </div>
      </div>
      <Rightbar />
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    ...state.Layout
  };
};


export default connect(mapStateToProps, {
  changeLayout,
  changeSidebarTheme,
  changeSidebarType,
  toggleRightSidebar,
  changeTopbarTheme,
  changeLayoutTheme,
  changeLayoutWidth
})(withRouter(Layout)); */

import React, { Component } from "react";

import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  changeLayout,
  changeSidebarTheme,
  changeSidebarType,
  toggleRightSidebar,
  changeTopbarTheme,
  changeLayoutTheme,
  changeLayoutWidth
} from "../../store/actions";

// Layout Related Components
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import Rightbar from "../CommonForBoth/Rightbar"; 

class Layout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMobile: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    };
    this.toggleMenuCallback = this.toggleMenuCallback.bind(this);
    this.toggleRightSidebar = this.toggleRightSidebar.bind(this);
  }

  toggleRightSidebar() {
    this.props.toggleRightSidebar();
  }

  capitalizeFirstLetter = string => {
    return string.charAt(1).toUpperCase() + string.slice(2);
  };

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      if(this.props.isPreloader === true)
        {
          document.getElementById('preloader').style.display = "block";
          document.getElementById('status').style.display = "block";

          setTimeout(function(){ 

          document.getElementById('preloader').style.display = "none";
          document.getElementById('status').style.display = "none";

          }, 2500);
        }
        else
        {
          document.getElementById('preloader').style.display = "none";
          document.getElementById('status').style.display = "none";
        }
    }
}

  componentDidMount() {

    
    // Scroll Top to 0
    window.scrollTo(0, 0);

    let currentage = this.capitalizeFirstLetter(this.props.location.pathname);

    currentage = currentage.replaceAll("-" , " ");
    
    document.title =
      currentage + " | orionqo ";
      
    if (this.props.leftSideBarTheme) {
      this.props.changeSidebarTheme(this.props.leftSideBarTheme);
    }

    if (this.props.layoutWidth) {
      this.props.changeLayoutWidth(this.props.layoutWidth);
    }

    if (this.props.leftSideBarType) {
      this.props.changeSidebarType(this.props.leftSideBarType);
    }
    if (this.props.topbarTheme) {
      this.props.changeTopbarTheme(this.props.topbarTheme);
    }
    if (this.props.theme) {
      this.props.changeLayoutTheme(this.props.theme);
    }

    if (this.props.showRightSidebar) {
      this.toggleRightSidebar();
    }
  }
  toggleMenuCallback = () => {
    if (this.props.leftSideBarType === "default") {
      this.props.changeSidebarType("condensed", this.state.isMobile);
    } else if (this.props.leftSideBarType === "condensed") {
      this.props.changeSidebarType("default", this.state.isMobile);
    }
  };

  render() {
    return (
      <React.Fragment>
        <div id="preloader">
            <div id="status">
                <div className="spinner">
                    <i className="ri-loader-line spin-icon"></i>
                </div>
            </div>
        </div>


        <div id="layout-wrapper">
        <Header toggleMenuCallback={this.toggleMenuCallback} toggleRightSidebar={this.toggleRightSidebar} />
          <Sidebar
            theme={this.props.leftSideBarTheme}
            type={this.props.leftSideBarType}
            isMobile={this.state.isMobile}
          />
              <div className="main-content">
                {this.props.children}
                <Footer/>
              </div>
        </div>
        <Rightbar />
      </React.Fragment>
    );
  }
} 


const mapStatetoProps = state => {
  return {
    ...state.Layout
  };
};
export default connect(mapStatetoProps, {
  changeLayout,
  changeSidebarTheme,
  changeSidebarType,
  toggleRightSidebar,
  changeTopbarTheme,
  changeLayoutTheme,
  changeLayoutWidth
})(withRouter(Layout)); 


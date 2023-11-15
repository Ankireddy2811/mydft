import React, { useEffect } from "react";
import { Collapse, Container } from "reactstrap";
import { Link, useLocation } from "react-router-dom";
//import classname from "classnames";
import { withNamespaces } from "react-i18next";
import { connect } from 'react-redux';

const Navbar = ({ menuOpen, t }) => {
    const location = useLocation();

    useEffect(() => {
        const ul = document.getElementById("navigation");
        const items = ul.getElementsByTagName("a");
        let matchingMenuItem = null;

        for (let i = 0; i < items.length; ++i) {
            if (location.pathname === items[i].pathname) {
                matchingMenuItem = items[i];
                break;
            }
        }

        if (matchingMenuItem) {
            activateParentDropdown(matchingMenuItem);
        }
    }, [location.pathname]);

    const activateParentDropdown = (item) => {
        item.classList.add("active");
        let parent = item.parentElement;

        for (let i = 0; i < 5; i++) {
            if (parent) {
                parent.classList.add("active");
                parent = parent.parentElement;
            } else {
                break;
            }
        }
        return false;
    };

    return (
        <React.Fragment>
            <div className="topnav">
                <Container fluid>
                    <nav className="navbar navbar-light navbar-expand-lg topnav-menu" id="navigation">
                        <Collapse isOpen={menuOpen} className="navbar-collapse" id="topnav-menu-content">
                            <ul className="navbar-nav">
                                <li className="nav-item">
                                    <Link className="nav-link" to="/">
                                        <i className="ri-dashboard-line me-2"></i> {t('Dashboard')}
                                    </Link>
                                </li>
                                {/* Other list items can be added here */}
                            </ul>
                        </Collapse>
                    </nav>
                </Container>
            </div>
        </React.Fragment>
    );
};

const mapStatetoProps = (state) => {
    const { leftSideBarType, leftSideBarTheme } = state.Layout;
    return { leftSideBarType, leftSideBarTheme };
};

export default connect(mapStatetoProps, {})(withNamespaces()(Navbar)); 

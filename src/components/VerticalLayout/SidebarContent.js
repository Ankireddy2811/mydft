import React, { Component } from "react";

// MetisMenu
import MetisMenu from "metismenujs";
import { withRouter,Link } from "react-router-dom";

//i18n
import { withNamespaces } from 'react-i18next';

import { connect } from "react-redux";
import {
    changeLayout,
    changeLayoutWidth,
    changeSidebarTheme,
    changeSidebarType,
    changePreloader
} from "../../store/actions";

class SidebarContent extends Component {

    constructor(props) {
        super(props);
        this.state = {
          is_admin:"",
        };

    }

    componentDidMount() {
        const is_ad = JSON.parse(localStorage.getItem('is_admin'));
        this.setState({ is_admin:is_ad  });
        this.initMenu();

    }

    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {

            if (this.props.type !== prevProps.type) {
                this.initMenu();
            }

        }
    }

    initMenu() {
        new MetisMenu("#side-menu");

        var matchingMenuItem = null;
        var ul = document.getElementById("side-menu");
        var items = ul.getElementsByTagName("a");
        for (var i = 0; i < items.length; ++i) {
            if (this.props.location.pathname === items[i].pathname) {
                matchingMenuItem = items[i];
                break;
            }
        }
        if (matchingMenuItem) {
            this.activateParentDropdown(matchingMenuItem);
        }
    }

    activateParentDropdown = item => {
        item.classList.add("active");
        const parent = item.parentElement;

        if (parent) {
            parent.classList.add("mm-active");
            const parent2 = parent.parentElement;

            if (parent2) {
                parent2.classList.add("mm-show");

                const parent3 = parent2.parentElement;

                if (parent3) {
                    parent3.classList.add("mm-active"); // li
                    parent3.childNodes[0].classList.add("mm-active"); //a
                    const parent4 = parent3.parentElement;
                    if (parent4) {
                        parent4.classList.add("mm-active");
                    }
                }
            }
            return false;
        }
        return false;
    };

    render() {
        return (
            <React.Fragment>
                <div id="sidebar-menu">
                    <ul className="metismenu list-unstyled" id="side-menu">
                        <li className="menu-title">{this.props.t('Menu')}</li>
                        
                        {this.state.is_admin ? (
                            <React.Fragment>
                                <li>
                                    <Link to="/admin-dashboard" className="waves-effect">
                                        <i className="ri-dashboard-line"></i>
                                        <span className="badge rounded-pill bg-success float-end">3</span>
                                        <span className="ms-1">{this.props.t('Dashboard')}</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/#" className="has-arrow waves-effect">
                                        <i className="ri-calendar-event-line"></i>
                                        <span className="ms-1">{this.props.t('Hospitals')}</span>
                                    </Link>
                                    <ul className="sub-menu">
                                        <li><Link to="/hospital-list">{this.props.t('Hospital List')}</Link></li>
                                        <li><Link to="/add-hospital">{this.props.t('Add Hospital')}</Link></li>
                                    </ul>
                                </li>
                                
                            </React.Fragment>
                        ) : (
                            <React.Fragment>
                                {/* Render other menu items when is_admin is false */}
                                
                                <li>
                                    <Link to="/dashboard" className="waves-effect">
                                        <i className="ri-dashboard-line"></i>
                                        <span className="badge rounded-pill bg-success float-end">3</span>
                                        <span className="ms-1">{this.props.t('Dashboard')}</span>
                                    </Link>
                                </li>
                                <li>
                            <Link to="/#" className="has-arrow waves-effect">
                                <i className="ri-group-line"></i>
                                <span className="ms-1">{this.props.t('Doctors')}</span>
                            </Link>
                            <ul className="sub-menu">
                                <li><Link to="/doctors">{this.props.t('Doctors_list')}</Link></li>
                                <li><Link to="/add-doctor">{this.props.t('Add Doctor')}</Link></li>                               
                            </ul>
                        </li>
                        <li>
                            <Link to="/#" className="has-arrow waves-effect">
                                <i className="ri-team-line"></i>
                                <span className="ms-1">{this.props.t('Patients')}</span>
                            </Link>
                            <ul className="sub-menu">
                                <li><Link to="/patients">{this.props.t('Patients_list')}</Link></li>
                                <li><Link to="/add-patient">{this.props.t('Add Patient')}</Link></li>
                          </ul>
                        </li>
                        <li>
                            <Link to="/#" className="has-arrow waves-effect">
                                <i className=" ri-calendar-check-fill"></i>
                                <span className="ms-1">{this.props.t('Appointments')}</span>
                            </Link>
                            <ul className="sub-menu">
                                <li><Link to="/appointments">{this.props.t('Appointments list')}</Link></li>
                               <li><Link to="/add-appointment">{this.props.t('Add Appointment')}</Link></li>
                           </ul>
                        </li>
                        <li>
                            <Link to="/#" className="has-arrow waves-effect">
                                <i className="ri-women-line"></i>
                                <span className="ms-1">{this.props.t('Nurses')}</span>
                            </Link>
                            <ul className="sub-menu">
                                <li><Link to="/nurse-list">{this.props.t('Nurse List')}</Link></li>
                                <li><Link to="/add-nurse">{this.props.t('Add Nurse')}</Link></li>
                          </ul>
                        </li>
                        <li>
                            <Link to="/#" className="has-arrow waves-effect">
                                <i className=" ri-calendar-event-line"></i>
                                <span className="ms-1">{this.props.t('Departments')}</span>
                            </Link>
                            <ul className="sub-menu">
                                <li><Link to="/department-list">{this.props.t('Department List')}</Link></li>
                          </ul>
                        </li>
                        <li>
                            <Link to="/#" className="has-arrow waves-effect">
                                <i className="ri-calendar-event-line"></i>
                                <span className="ms-1">{this.props.t('Medicines')}</span>
                            </Link>
                            <ul className="sub-menu">
                                <li><Link to="/medicine-list">{this.props.t('Medicine List')}</Link></li>
                                <li><Link to="/add-medicine">{this.props.t('Add Medicine')}</Link></li>
                          </ul>
                        </li>
                        <li>
                            <Link to="/#" className="has-arrow waves-effect">
                                <i className=" ri-calendar-event-line"></i>
                                <span className="ms-1">{this.props.t('Beds')}</span>
                            </Link>
                            <ul className="sub-menu">
                                <li><Link to="/bed-list">{this.props.t('Bed List')}</Link></li>
                                <li><Link to="/add-bed">{this.props.t('Add Bed')}</Link></li>
                                {/* <li><Link to="/beds">{this.props.t('Beds')}</Link></li> */}
                          </ul>
                        </li>
                        <li>
                            <Link to="/#" className="has-arrow waves-effect">
                                <i className=" ri-calendar-event-line"></i>
                                <span className="ms-1">{this.props.t('Prescriptions')}</span>
                            </Link>
                            <ul className="sub-menu">
                                <li><Link to="/prescription-list">{this.props.t('Prescriptions List')}</Link></li>
                                <li><Link to="/add-prescription">{this.props.t('Add Prescription')}</Link></li>
                          </ul>
                        </li>
                        <li>
                            <Link to="/#" className="has-arrow waves-effect">
                                <i className=" ri-calendar-event-line"></i>
                                <span className="ms-1">{this.props.t('Prescription Details')}</span>
                            </Link>
                            <ul className="sub-menu">
                                <li><Link to="/prescription-details-list">{this.props.t('Prescriptions Details')}</Link></li>
                                <li><Link to="/add-prescription-details">{this.props.t('Add Prescription Details')}</Link></li>
                          </ul>
                        </li>
                        <li>
                            <Link to="/#" className="has-arrow waves-effect">
                                <i className=" ri-calendar-event-line"></i>
                                <span className="ms-1">{this.props.t('Invoice')}</span>
                            </Link>
                            <ul className="sub-menu">
                                <li><Link to="/invoice-list">{this.props.t('Invoice List')}</Link></li>
                                <li><Link to="/add-invoice">{this.props.t('Add Invoice')}</Link></li>
                          </ul>
                        </li>
                        <li>
                            <Link to="/#" className="has-arrow waves-effect">
                                <i className=" ri-calendar-event-line"></i>
                                <span className="ms-1">{this.props.t('Lab Test')}</span>
                            </Link>
                            <ul className="sub-menu">
                                <li><Link to="/lab-test-list">{this.props.t('Lab Test List')}</Link></li>
                                <li><Link to="/add-lab-test">{this.props.t('Add Lab Test')}</Link></li>
                          </ul>
                        </li>
                        <li>
                            <Link to="/#" className="has-arrow waves-effect">
                                <i className=" ri-calendar-event-line"></i>
                                <span className="ms-1">{this.props.t('Payment')}</span>
                            </Link>
                            <ul className="sub-menu">
                                <li><Link to="/payment-list">{this.props.t('Payment List')}</Link></li>
                                <li><Link to="/add-payment">{this.props.t('Add Payment')}</Link></li>
                          </ul>
                        </li>
                                {/* Add more menu items here as needed */}
                            </React.Fragment>
                        )}
                    </ul>
                </div>
            </React.Fragment>
        );
    }
}

const mapStatetoProps = state => {
    return { ...state.Layout };
};

export default withRouter(connect(mapStatetoProps, {
    changeLayout,
    changeSidebarTheme,
    changeSidebarType,
    changeLayoutWidth,
    changePreloader
})(withNamespaces()(SidebarContent)));

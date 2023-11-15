import React, { useState } from 'react';
import { Link } from "react-router-dom";

// Reactstrap
import { Dropdown, DropdownToggle, DropdownMenu, Row, Col } from "reactstrap";

//i18n
import { withNamespaces } from "react-i18next";

//Import Images
import megamenuImg from "../../assets/images/megamenu-img.png";

const MegaMenu = (props) =>{
    
    const [menu,setMenu] = useState(false)
    
        return (
            <React.Fragment>
                <Dropdown className="dropdown-mega d-none d-lg-block ms-2" isOpen={menu} toggle={() => {setMenu(!menu) }}>
                    <DropdownToggle tag="button" type="button" caret className="btn header-item waves-effect">
                        {props.t('Mega Menu')}{" "}
                        <i className="mdi mdi-chevron-down"></i>
                    </DropdownToggle>
                    <DropdownMenu className="dropdown-megamenu">
                        <Row>
                            <Col sm={8}>

                                <Row>
                                    <Col md={4}>
                                        <h5 className="font-size-14 mt-0">{props.t('UI Components')}</h5>
                                        <ul className="list-unstyled megamenu-list">
                                            <li>
                                                <Link to="#">{props.t('Lightbox')}</Link>
                                            </li>
                                            <li>
                                                <Link to="#">{props.t('Range Slider')}</Link>
                                            </li>
                                            <li>
                                                <Link to="#">{props.t('Rating')}</Link>
                                            </li>
                                            <li>
                                                <Link to="#">{props.t('Forms')}</Link>
                                            </li>
                                            <li>
                                                <Link to="#">{props.t('Tables')}</Link>
                                            </li>
                                            <li>
                                                <Link to="#">{props.t('Charts')}</Link>
                                            </li>
                                        </ul>
                                    </Col>

                                    <Col md={4}>
                                        <h5 className="font-size-14 mt-0">{this.props.t('Applications')}</h5>
                                        <ul className="list-unstyled megamenu-list">
                                            <li>
                                                <Link to="#">{props.t('Ecommerce')}</Link>
                                            </li>
                                            <li>
                                                <Link to="#">{props.t('Calendar')}</Link>
                                            </li>
                                            <li>
                                                <Link to="#">{props.t('Email')}</Link>
                                            </li>
                                            <li>
                                                <Link to="#">{props.t('Projects')}</Link>
                                            </li>
                                            <li>
                                                <Link to="#">{props.t('Tasks')}</Link>
                                            </li>
                                            <li>
                                                <Link to="#">{props.t('Contacts')}</Link>
                                            </li>
                                        </ul>
                                    </Col>

                                    <Col md={4}>
                                        <h5 className="font-size-14 mt-0">{props.t('Extra Pages')}</h5>
                                        <ul className="list-unstyled megamenu-list">
                                            <li>
                                                <Link to="#">{props.t('Light Sidebar')}</Link>
                                            </li>
                                            <li>
                                                <Link to="#">{props.t('Compact Sidebar')}</Link>
                                            </li>
                                            <li>
                                                <Link to="#">{props.t('Horizontal layout')}</Link>
                                            </li>
                                            <li>
                                                <Link to="#">{props.t('Maintenance')}</Link>
                                            </li>
                                            <li>
                                                <Link to="#">{props.t('Coming Soon')}</Link>
                                            </li>
                                            <li>
                                                <Link to="#">{props.t('Timeline')}</Link>
                                            </li>
                                            <li>
                                                <Link to="#">{props.t('FAQs')}</Link>
                                            </li>

                                        </ul>
                                    </Col>
                                </Row>
                            </Col>
                            <Col sm={4}>
                                <Row>
                                    <Col sm={6}>
                                        <h5 className="font-size-14 mt-0">{props.t('UI Components')}</h5>
                                        <ul className="list-unstyled megamenu-list">
                                            <li>
                                                <Link to="#">{props.t('Lightbox')}</Link>
                                            </li>
                                            <li>
                                                <Link to="#">{props.t('Range Slider')}</Link>
                                            </li>
                                            <li>
                                                <Link to="#">{props.t('Rating')}</Link>
                                            </li>
                                            <li>
                                                <Link to="#">{props.t('Forms')}</Link>
                                            </li>
                                            <li>
                                                <Link to="#">{props.t('Tables')}</Link>
                                            </li>
                                            <li>
                                                <Link to="#">{props.t('Charts')}</Link>
                                            </li>
                                        </ul>
                                    </Col>

                                    <Col sm={5}>
                                        <div>
                                            <img src={megamenuImg} alt="" className="img-fluid mx-auto d-block" />
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>

                    </DropdownMenu>
                </Dropdown>
            </React.Fragment>
        );
    }


export default withNamespaces()(MegaMenu);
import React, { Component } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

//i18n
import { withNamespaces } from "react-i18next";

// users
import avatar2 from '../../../assets/images/users/avatar-2.jpg';

import {drfGetHospitalListById} from "../../../drfServer";

class ProfileMenu extends Component {

    constructor(props) {
        super(props);
        this.state = {
            menu: false,
            profileImage:""
        };
        this.toggle = this.toggle.bind(this);
    }


    toggle() {
        this.setState(prevState => ({
            menu: !prevState.menu
        }));
    }

    async componentDidMount (){
      const access = JSON.parse(localStorage.getItem("access_token"));
      const id = JSON.parse(localStorage.getItem("client_id"));
      const options = {
        headers:{
            'Authorization': `Bearer ${access}`
        }
      };
     try{
        const response = await drfGetHospitalListById(id,options);
        console.log(response);
        const data = await response.data;
        console.log(data);
        this.setState({profileImage:data.profile_image});
     }
     
     
     catch (error) {
        throw new Error("Something went wrong");
     }
    
    }

   
    render() {

        let username = "Admin";
        if (localStorage.getItem("authUser")) {
            const obj = JSON.parse(localStorage.getItem("authUser"));
            const uNm = obj.email.split("@")[0];
            username = uNm.charAt(0).toUpperCase() + uNm.slice(1);
        }
        const {profileImage} = this.state
        

        return (
            <React.Fragment>
                <Dropdown isOpen={this.state.menu} toggle={this.toggle} className="d-inline-block user-dropdown">
                    <DropdownToggle tag="button" className="btn header-item waves-effect" id="page-header-user-dropdown">
                        <img className="rounded-circle header-profile-user me-1" src={profileImage} alt="Header Avatar" />
                        <span className="d-none d-xl-inline-block ms-1 text-transform">{username}</span>
                        <i className="mdi mdi-chevron-down d-none ms-1 d-xl-inline-block"></i>
                    </DropdownToggle>
                    <DropdownMenu className="dropdown-menu-end">
                        <DropdownItem href="/hprofile"><i className="ri-user-line align-middle me-1"></i> {this.props.t('Profile')}</DropdownItem>
                        <DropdownItem href="/change-password"><i className=" ri-key-2-line align-middle me-1"></i> {this.props.t('Change Password')}</DropdownItem>
                        {/* <DropdownItem divider /> */}
                        <DropdownItem className="text-danger" href="/logout"><i className="ri-shut-down-line align-middle me-1 text-danger"></i> {this.props.t('Logout')}</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </React.Fragment>
        );
    }
}

export default withNamespaces()(ProfileMenu);

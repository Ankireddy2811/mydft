import React, { Component } from "react";
import { Container, Row, Col } from "reactstrap";
import { toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS file for styling
//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';

//Import Components
import FeedbackAdd from "./FeedbackAdd"
import Counter1 from "./Counter1";
import Counter2 from "./Counter2";
import RevenueAnalytics from "./RevenueAnalytics";
import SalesAnalytics from "./SalesAnalytics";
import EarningReports from "./EarningReports";
import Sources from "./Sources";
import RecentlyActivity from "./RecentlyActivity";
import RevenueByLocations from "./RevenueByLocations";
import ChatBox from "./ChatBox";
import Appointments from "./Appointments";
class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            breadcrumbItems : [
                { title : "orionqo", link : "/" },
                { title : "Dashboard", link : "#" },
            ],
            reports : [
                { icon : "ri-stack-line", title : "Number of Sales", value : "1452", rate : "2.4%", desc : "From previous period" },
                { icon : "ri-store-2-line", title : "Sales Revenue", value : "$ 38452", rate : "2.4%", desc : "From previous period" },
                { icon : "ri-briefcase-4-line", title : "Average Price", value : "$ 15.4", rate : "2.4%", desc : "From previous period" },
            ]
        }
    }

    render() {
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid>

                    <Breadcrumbs title="Dashboard" breadcrumbItems={this.state.breadcrumbItems} />
                        <Row>
                            <Col xl={12}>
                                <Row>
                                    <Counter1 reports={this.state.reports} />
                                </Row>
                                <Row>
                                    <Counter2 reports={this.state.reports} />
                                </Row>
                                {/* revenue Analytics */}
                               {/* <RevenueAnalytics />*/}
                               <Row>
                               <Appointments/>
                               </Row>
                            </Col>

                           {/* <Col xl={4}>
                                {/* sales Analytics */}
                               {/* <SalesAnalytics/>

                                {/* earning reports */}
                             { /* { <EarningReports/>}
                            </Col> 
                            */}
                        </Row>
                        
                      { /* <Row>
                            {/* sources */}
                        {/*    <Sources/>

                            {/* recent activity */}
                         {/*  <RecentlyActivity/>

                            {/* revenue by locations */}
                           {/*} <RevenueByLocations/>
                        </Row>

                      {/*  <Row>
                            {/* chat box */}
                           {/* <ChatBox/>

                            {/* latest transactions */}
                          {/*  <LatestTransactions/>
                       {/* </Row>*/}
                             <FeedbackAdd /> {/* Add the FeedbackPopup component */}
                    </Container> 
               
                 </div>
            </React.Fragment>
        );
    }
}

export default Dashboard;

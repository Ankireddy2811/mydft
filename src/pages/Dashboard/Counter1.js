import React, { Component } from 'react';
import { Col, Card, CardBody } from "reactstrap";

class Counter1 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataArray: [],
            client_id: "",
            access_token: "",
        };
    }

    async componentDidMount() {
        const access = JSON.parse(localStorage.getItem('access_token'));
        const id = JSON.parse(localStorage.getItem('client_id'));
        if (access) {
            this.setState({ access_token: access });
            this.setState({ client_id: id });
        }

        const apiUrls = [
            {
                url: "/Patient/counter/",
                body: { client_id: id }
            },
            {
                url: "/Doctor/counter/",
                body: { client_id: id }
            },
            {
                url: "/Appointment/counter/",
                body: { client_id: id }
            }
        ];

        try {
            const responses = await Promise.all(
                apiUrls.map(({ url, body }) => {
                    return fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${access}`,
                        },
                        body: JSON.stringify(body)
                    });
                })
            );

            const jsonDataArray = await Promise.all(responses.map(response => response.json()));
            this.setState({ dataArray: jsonDataArray });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    render() {
        const { dataArray } = this.state;
        const reports = [
            { title: "Total Patients", icon: "mdi mdi-account", rate: "10%" },
            { title: "Total Doctors", icon: "mdi mdi-stethoscope", rate: "5%" },
            { title: "Total Appointments", icon: "mdi mdi-calendar-clock", rate: "15%" }
        ];

        return (
            <React.Fragment>
                {reports.map((report, index) => (
                    <Col md={4} key={index}>
                        <Card>
                            <CardBody>
                                <div className="d-flex">
                                    <div className="flex-1 overflow-hidden">
                                        <p className="text-truncate font-size-14 mb-2">{report.title}</p>
                                        <h4 className="mb-0">{dataArray[index]?.total_count} </h4>
                                    </div>
                                    <div className="text-primary">
                                        <i className={report.icon + " font-size-24"}></i>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                ))}
            </React.Fragment>
        );
    }
}

export default Counter1;

import React, { useState } from 'react';
import { Card, CardBody, Row, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import ReactApexChart from 'react-apexcharts';
import "./dashboard.scss";

const EarningReports = () => {
    const [menu, setMenu] = useState(false);

    const [chartData1] = useState({
        series: [72],
        options: {
            chart: {
                sparkline: {
                    enabled: true
                }
            },
            dataLabels: {
                enabled: false
            },
            colors: ['#5664d2'],
            stroke: {
                lineCap: 'round'
            },
            plotOptions: {
                radialBar: {
                    hollow: {
                        margin: 0,
                        size: '70%'
                    },
                    track: {
                        margin: 0,
                    },
                    dataLabels: {
                        show: false
                    }
                }
            }
        }
    });

    const [chartData2] = useState({
        series: [65],
        options: {
            chart: {
                sparkline: {
                    enabled: true
                }
            },
            dataLabels: {
                enabled: false
            },
            colors: ['#1cbb8c'],
            stroke: {
                lineCap: 'round'
            },
            plotOptions: {
                radialBar: {
                    hollow: {
                        margin: 0,
                        size: '70%'
                    },
                    track: {
                        margin: 0,
                    },
                    dataLabels: {
                        show: false
                    }
                }
            }
        }
    });

    return (
        <Card>
            <CardBody>
                <Dropdown className="float-end" isOpen={menu} toggle={() => setMenu(!menu)}>
                    <DropdownToggle tag="i" className="arrow-none card-drop">
                        <i className="mdi mdi-dots-vertical"></i>
                    </DropdownToggle>
                    <DropdownMenu className="dropdown-menu-end">
                        <DropdownItem href="">Sales Report</DropdownItem>
                        <DropdownItem href="">Export Report</DropdownItem>
                        <DropdownItem href="">Profit</DropdownItem>
                        <DropdownItem href="">Action</DropdownItem>
                    </DropdownMenu>
                </Dropdown>

                <h4 className="card-title mb-4">Earning Reports</h4>
                <div className="text-center">
                    <Row>
                        <Col sm={6}>
                            <div>
                                <div className="mb-3">
                                    <div id="radialchart-1" className="apex-charts">
                                        <ReactApexChart options={chartData1.options} series={chartData1.series} type="radialBar" height="60" />
                                    </div>
                                </div>

                                <p className="text-muted text-truncate mb-2">Weekly Earnings</p>
                                <h5 className='mb-0'>$2,523</h5>
                            </div>
                        </Col>

                        <Col sm={6}>
                            <div className="mt-5 mt-sm-0">
                                <div className="mb-3">
                                    <div id="radialchart-2" className="apex-charts">
                                        <ReactApexChart options={chartData2.options} series={chartData2.series} type="radialBar" height="60" />
                                    </div>
                                </div>

                                <p className="text-muted text-truncate mb-2">Monthly Earnings</p>
                                <h5 className='mb-0'>$11,235</h5>
                            </div>
                        </Col>
                    </Row>
                </div>
            </CardBody>
        </Card>
    );
};

export default EarningReports;

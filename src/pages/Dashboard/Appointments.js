import React, { Component } from "react";
import { Row, Col, Card, CardBody, Container } from "reactstrap";
import { FaEdit,FaTimes,FaTimesCircle } from 'react-icons/fa';
import { withRouter } from "react-router-dom";
import Breadcrumbs from '../../components/Common/Breadcrumb';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import { CSVLink } from 'react-csv';
import * as XLSX from 'xlsx';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { toast } from 'react-toastify'; // Import toast from react-toastify
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS file for styling

class Appointments extends Component {
    constructor(props) {
        super(props);
        this.state = {
            breadcrumbItems: [
                { title: "Tables", link: "#" },
                { title: "Responsive Table", link: "#" },
            ],
            data: null,
            loading: true,
            error: null,
            currentPage: 1,
            appointmentsPerPage: 5,
            exportData: [],
            exportDropdownOpen: false,
            client_id:"",
            sortOrder: 'asc', // Initial sorting order
            sortField: 'appointment_id', // Initial sorting field
            sortDirection: 'asc', // Initial sorting direction
            sortedColumn: 'appointment_id', // Initial sorted column
            searchQuery: "", // State for search query
            access_token:"",
        };
    }

   
      componentDidMount() {
        const access = JSON.parse(localStorage.getItem('access_token'));
        const id = JSON.parse(localStorage.getItem('client_id'));
        if (access) {
          this.setState({ access_token: access });
          console.log("hello" + this.state.access_token);
          this.setState({ client_id: id }, () => {
            this.getAppointments();
          });
        }
      }
      
    getAppointments = async () => {
        const acces = this.state.access_token;

        try {
            const {
                client_id,access_token,

                 
               } = this.state;
           
            const response = await fetch(`/Appointment/All/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", // Set the content type to JSON
                    'Authorization': `Bearer ${access_token}`,                },

                body: JSON.stringify({client_id}),
            });
            if (!response.ok) {
                throw new Error("Network response was not ok.");
            }
            const data = await response.json();
            console.log("Response data:", data);

            this.setState({ data, loading: false });
        } catch (error) {
            this.setState({ error: 'Error fetching data', loading: false });
        }
    };

    handleEdit = (appointment) => {
        this.props.history.push(`/edit-appointment/${appointment.appointment_id}`, { appointment });
    };

    handleCancelAppointment = async (appointment_id) => {
        const {
            client_id,access_token,

             
           } = this.state;
       
        const confirmDelete = window.confirm("Cancel this appointment?\nYou won't be able to revert this!");

        if (confirmDelete) {
            try {
                const response = await fetch(`/Appointment/cancelled/`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",'Authorization': `Bearer ${access_token}`,
                    },
                    body: JSON.stringify({appointment_id,client_id,}),

                });

                if (!response.ok) {
                    throw new Error("Cancellation failed");
                }

                this.getAppointments();
                alert("The appointment has been cancelled.");
            } catch (error) {
                console.error('Cancelled failed:', error);
                alert("Cancelled failed");
            }
        }
    };

    handlePageChange = (newPage) => {
        this.setState({
            currentPage: newPage,
        });
    };

    

    

    toggleExportDropdown = () => {
        this.setState((prevState) => ({
            exportDropdownOpen: !prevState.exportDropdownOpen,
        }));
    };

    renderPagination = () => {
        const { data, currentPage, appointmentsPerPage } = this.state;
        const totalPages = Math.ceil(data.length / appointmentsPerPage);

        if (totalPages <= 1) {
            return null;
        }

        const paginationItems = [];
        for (let i = 1; i <= totalPages; i++) {
            paginationItems.push(
                <li key={i} className={`page-item${currentPage === i ? ' active' : ''}`}>
                    <a className="page-link" href="#" onClick={() => this.handlePageChange(i)}>
                        {i}
                    </a>
                </li>
            );
        }

        return (
            <ul className="pagination justify-content-center">
                {paginationItems}
            </ul>
        );
    };

    render() {
        const { data, loading, error, currentPage, appointmentsPerPage } = this.state;

        if (loading) {
            return <div>Loading...</div>;
        }

        if (error) {
            return <div>{error}</div>;
        }

        const indexOfLastAppointments = currentPage * appointmentsPerPage;
        const indexOfFirstAppointments = indexOfLastAppointments - appointmentsPerPage;
        const currentAppointments = data?.slice(indexOfFirstAppointments, indexOfLastAppointments);

        const columns = [
            { dataField: 'appointment_id', text: 'A.P ID', sort: true },
            { dataField: 'patient_id', text: 'Patient ID', sort: true },
            { dataField: 'patient__first_name', text: 'Patient Name', formatter: (cell, row) => `${cell} ${row.patient__last_name}` },

            { dataField: 'doctor_id', text: 'Doctor ID', sort: true },
            { dataField: 'doctor__first_name', text: 'Doctor Name', formatter: (cell, row) => `${cell} ${row.doctor__last_name}` },

            { dataField: 'appointment_date', text: 'Date', sort: true },
            { dataField: 'start_time', text: 'Start Time', sort: true },
            { dataField: 'end_time', text: 'End Time', sort: true },
            { dataField: 'status', text: 'Status', sort: true },

           
        ];

        return (
            <React.Fragment>
                    <Container fluid>
                        <h5>Appointments</h5>
                        <Row>
                            <Col>
                                <Card>
                                    <CardBody>
                                        
                                        <div className="table-responsive">
                                        <BootstrapTable
                                            keyField="appointment_id"
                                            data={currentAppointments}
                                            columns={columns}
                                           // pagination={paginationFactory()}
                                        />
                                        </div>
                                        {this.renderPagination()}
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                <CSVLink
                    data={this.state.exportData}
                    filename={"appointments.csv"}
                    className="hidden"
                    ref={(r) => (this.csvLink = r)}
                    target="_blank"
                />
            </React.Fragment>
        );
    }
}

export default withRouter(Appointments);
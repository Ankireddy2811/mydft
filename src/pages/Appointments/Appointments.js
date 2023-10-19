import React, { Component } from "react";
import { Row, Col, Card, CardBody, Container } from "reactstrap";
import { FaEdit,FaTimes,FaTimesCircle } from 'react-icons/fa';
import { withRouter } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS file for styling
import Breadcrumbs from '../../components/Common/Breadcrumb';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import { CSVLink } from 'react-csv';
import * as XLSX from 'xlsx';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

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
            appointmentsPerPage: 10,
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
        const { client_id, access_token } = this.state;
      
        try {
          const result = await Swal.fire({
            title: 'Cancel Appointment',
            text: "Are you sure you want to cancel this appointment? You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, cancel it!',
            cancelButtonText: 'No, keep it',
            reverseButtons: true,
          });
      
          if (result.isConfirmed) {
            const response = await axios.put(
              `/Appointment/cancelled/`,
              {
                appointment_id,
                client_id,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                  'Authorization': `Bearer ${access_token}`,
                },
              }
            );
      
            if (response.status === 200) {
              Swal.fire(
                'Cancelled!',
                'The appointment has been cancelled.',
                'success'
              );
              this.getAppointments();
            } else {
              throw new Error("Cancellation failed");
            }
          } 
        } catch (error) {
          console.error('Cancellation failed:', error);
          toast.error("Cancellation failed");
        }
      };
      

    handlePageChange = (newPage) => {
        this.setState({
            currentPage: newPage,
        });
    };

    prepareExportData = () => {
        const { data } = this.state;
        const exportData = data.map((appointment) => ({
            'Appointment ID': appointment.appointment_id,
            'Patient ID': appointment.patient_id,
            'Patient Name': `${appointment.patient__first_name} ${appointment.patient__last_name}`,
            'Doctor ID': appointment.doctor_id,
            'Doctor Name': `${appointment.doctor__first_name} ${appointment.doctor__last_name}`,
            'Date': appointment.appointment_date,
            'Start Time': appointment.start_time,
            'End Time': appointment.end_time,
            'Status': appointment.status,
        }));
        return exportData;
    };

    handleCSVExport = () => {
        const exportData = this.prepareExportData();
        this.setState({ exportData }, () => {
            this.csvLink.link.click();
        });
    };

    handleExcelExport = () => {
        const exportData = this.prepareExportData();
        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Appointments');
        XLSX.writeFile(wb, 'appointments.xlsx');
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

            {
                dataField: 'actions',
                text: 'Actions',
                formatter: (cell, row) => (
                    <>
                        <FaEdit
                            style={{ color: "purple" }}
                            className="cursor-pointer"
                            onClick={() => this.handleEdit(row)}
                            data-toggle="tooltip" // Enable Bootstrap tooltip
                            title="Edit" // Set the tooltip text
                        />
                        <FaTimes
                            style={{ color: "red" }}
                            className="cursor-pointer mx-2"
                            onClick={() => this.handleCancelAppointment(row.appointment_id)}
                            data-toggle="tooltip" // Enable Bootstrap tooltip
                            title="Cancel" // Set the tooltip text
                        />
                    </>
                ),
            },
        ];

        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid>
                        <Breadcrumbs title="Appointments" breadcrumbItems={this.state.breadcrumbItems} />
                        <Row>
                            <Col xs={12}>
                                <Card>
                                    <CardBody>
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <Dropdown isOpen={this.state.exportDropdownOpen} toggle={this.toggleExportDropdown}>
                                                <DropdownToggle caret>
                                                    Export
                                                </DropdownToggle>
                                                <DropdownMenu>
                                                    <DropdownItem onClick={this.handleCSVExport}>Export as CSV</DropdownItem>
                                                    <DropdownItem onClick={this.handleExcelExport}>Export as Excel</DropdownItem>
                                                </DropdownMenu>
                                            </Dropdown>
                                        </div>
                                        <div className="table-responsive">
                                        <BootstrapTable
                                            keyField="appointment_id"
                                            data={currentAppointments}
                                            columns={columns}
                                            pagination={paginationFactory()}
                                        />
                                        </div>
                                        {this.renderPagination()}
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </div>
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
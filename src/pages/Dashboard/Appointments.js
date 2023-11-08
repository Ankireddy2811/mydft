import React, { useState,useEffect } from "react";
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
import {drfDeleteAppointment,drfGetAllAppointmentDetails} from "../../drfServer";

const Appointments = (props) => {
    
        const [breadcrumbItems] = useState([
            { title: 'Tables', link: '#' },
            { title: 'Responsive Table', link: '#' },
          ]);
        
        const [data, setData] = useState(null);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);
        const [currentPage, setCurrentPage] = useState(1);
        const [appointmentsPerPage] = useState(10);
        const [sortOrder, setSortOrder] = useState('asc');
        const [sortField, setSortField] = useState('appointment_id');
        const [sortDirection, setSortDirection] = useState('asc');
        const [sortedColumn, setSortedColumn] = useState('appointment_id');
        const [exportData, setExportData] = useState([]);
        const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
        const [client_id,setClientId] = useState('');
        const [access_token, setAccessToken] = useState('');
        const [csvLink, setCsvLink] = useState(null);
   

    useEffect(() => {
        const access = JSON.parse(localStorage.getItem('access_token'));
        const id = JSON.parse(localStorage.getItem('client_id'));
        if (access) {
            setAccessToken(access);
            setClientId(id);
            getAppointments(id,access);
        }
    }, [client_id, access_token]);

   
    const getAppointments = async (client_id,access_token) => {
       
        const headersPart = {
            headers: {
                "Content-Type": "application/json", // Set the content type to JSON
                'Authorization': `Bearer ${access_token}`, 
            }
        }

        try {
            const response = await drfGetAllAppointmentDetails({client_id},headersPart);
            if (response.status === 200) {
                const data = await response.data;
                setData(data);
                setLoading(false);
            }
            else{
                throw new Error("Network response was not ok.");
            }
           
        } catch (error) {
            setError('Error fetching data');
            setLoading(false);
        }
    };

    const handleEdit = (appointment) => {
        props.history.push(`/edit-appointment/${appointment.appointment_id}`, { appointment });
    };

    const handleCancelAppointment = async (appointment_id) => {

        const headersPart = {
            headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${access_token}`,
        }
    }
      
        const requestFormData = {appointment_id,client_id}
       
        const confirmDelete = window.confirm("Cancel this appointment?\nYou won't be able to revert this!");

        if (confirmDelete) {
            try {
                const response = await drfDeleteAppointment(requestFormData,headersPart);

                if (!response.ok) {
                    throw new Error("Cancellation failed");
                }

                await getAppointments();
                toast.success("The appointment has been cancelled.");
            } catch (error) {
                console.error('Cancelled failed:', error);
                toast.error("Cancelled failed");
            }
        }
    };
    
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };
   

    const toggleExportDropdown = () => {
        setExportDropdownOpen(!exportDropdownOpen);
    };

    const renderPagination = () => {
      
        
        if(!data){
            return null;
        }
        const totalPages = Math.ceil(data.length / appointmentsPerPage);

        if (totalPages <= 1) {
            return null;
        }

        const paginationItems = [];
        for (let i = 1; i <= totalPages; i++) {
            paginationItems.push(
                <li key={i} className={`page-item${currentPage === i ? ' active' : ''}`}>
                    <a className="page-link" href="#" onClick={() => handlePageChange(i)}>
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

        const indexOfLastAppointments = currentPage * appointmentsPerPage;
        const indexOfFirstAppointments = indexOfLastAppointments - appointmentsPerPage;
        const currentAppointments = data?.slice(indexOfFirstAppointments, indexOfLastAppointments) || [];

        const columns = [
            { dataField: 'appointment_id', text: 'Appointment ID', sort: true },
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
                                        {renderPagination()}
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                <CSVLink
                    data={exportData}
                    filename={"appointments.csv"}
                    className="hidden"
                    ref={(r) => setCsvLink(r)}
                    target="_blank"
                />
            </React.Fragment>
        );
    
}

export default withRouter(Appointments);
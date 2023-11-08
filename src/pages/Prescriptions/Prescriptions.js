import React, { useState, useEffect } from "react";
import { Row, Col, Card, CardBody, Container } from "reactstrap";
import { FaEdit, FaTrashAlt, FaEllipsisV } from 'react-icons/fa';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import { CSVLink } from 'react-csv';
import * as XLSX from 'xlsx';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import Swal from "sweetalert2";
import { toast } from 'react-toastify'; // Import toast from react-toastify
// import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS file for styling
import { drfDeletePrescriptions,drfGetPrescriptions } from "../../drfServer";


const Prescriptions = (props) => {
    const [breadcrumbItems] = useState([
        { title: "Tables", link: "#" },
        { title: "Responsive Table", link: "#" },
    ]);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [prescriptionPerPage] = useState(10);
    const [exportData, setExportData] = useState([]);
    const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
    const [client_id, setClientId] = useState("");
    const [access_token, setAccessToken] = useState("");
    const [csvLink, setCsvLink] = useState(null);

    useEffect(() => {
        const access = JSON.parse(localStorage.getItem('access_token'));
        const id = JSON.parse(localStorage.getItem('client_id'));
        if (access) {
            setAccessToken(access);
            setClientId(id);
            getAllPrescriptions(id, access);
        }
    }, []);

    const handleEdit = (prescription_id) => {
        props.history.replace(`/edit-prescription/${prescription_id}`);
    };

    const getAllPrescriptions = async (client_id, access) => {
        const headersPart = {
            headers: { "Content-Type": "application/json", 'Authorization': `Bearer ${access}` }
        }

        try {
            const response = await drfGetPrescriptions({client_id}, headersPart);
            const fetchedData = response.data;
            setData(fetchedData);
            setLoading(false);
        } catch (error) {
            setError('Error fetching data');
            setLoading(false);
        }
    };
    
    const handleDeletePrescriptions = async (prescription_id) => {
        try {
          const result = await Swal.fire({
            title: 'Are you sure?',
            text: "Delete this prescription?\nYou won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
            reverseButtons: true,
          });
      
          if (result.isConfirmed) {
            await deletePrescription(prescription_id, client_id, access_token);
            Swal.fire( 'Deleted!', 'Your file has been deleted.', 'success')
          } 
        } catch (error) {
          console.error('Deletion failed:', error);
          toast.error('Deletion failed');
        }
      };
      
      const deletePrescription = async (prescription_id, client_id, access_token) => {
        const requestFormData =  { prescription_id, client_id };
        const headersPart =  {
            headers: {
              "Content-Type": "application/json",
              'Authorization': `Bearer ${access_token}`,
            },
          }
        
        try {
          const response = await drfDeletePrescriptions(requestFormData,headersPart);
      
          if (response.status === 204) {
            await getAllPrescriptions();
            toast.success('The prescription has been deleted.');
          } else {
            throw new Error('Deletion failed');
          }
        } catch (error) {
          console.error('Deletion failed:', error);
          toast.error('Deletion failed');
        }
      };
      
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const prepareExportData = () => {
        
        const exportData = data.map((prescription) => ({
            'Prescription ID': prescription.prescription_id,
            'Prescription Date': prescription.prescription_date,
            'Notes': prescription.notes,
            'Patient ID': prescription.patient_id,
            'Doctor ID': prescription.doctor_id,
            'Created At': prescription.created_at,
            'Updated At': prescription.updated_at,
        }));
        return exportData;
    };

    const handleCSVExport = () => {
        const exportData =prepareExportData();
        setExportData(exportData);
        csvLink.link.click();
        
    };

    const handleExcelExport = () => {
        const exportData = prepareExportData();
        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Prescriptions');
        XLSX.writeFile(wb, 'prescriptions.xlsx');
    };

    const toggleExportDropdown = () => {
        setExportDropdownOpen(!exportDropdownOpen);
    };

    const renderPagination = () => {
        if (!data){
            return null;
        }
        const totalPages = Math.ceil(data.length / prescriptionPerPage);

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

    const indexOfLastPrescription = currentPage * prescriptionPerPage;
    const indexOfFirstPrescription = indexOfLastPrescription - prescriptionPerPage;
    const currentPrescription = data.slice(indexOfFirstPrescription, indexOfLastPrescription) ||[];

        const columns = [
            { dataField: 'prescription_id', text: 'Prescription ID', sort: true },
            { dataField: 'prescription_date', text: 'Prescription Date', sort: true },
            { dataField: 'notes', text: 'Notes', sort: true },
            { dataField: 'patient', text: 'Patient ID', sort: true },
            { dataField: 'doctor', text: 'Doctor ID', sort: true },
            { dataField: 'created_at', text: 'Created At', sort: true },
            { dataField: 'updated_at', text: 'Updated At', sort: true },
            {
                dataField: 'actions', text: 'Actions', formatter: (cell, row) => (
                    <>
                        <FaEdit style={{ color: "purple" }} className="cursor-pointer mx-2" onClick={() => handleEdit(row.prescription_id)} />
                        <FaTrashAlt style={{ color: "red" }} className="cursor-pointer mx-2" onClick={() => handleDeletePrescriptions(row.prescription_id)} />
                    </>
                )
            },
        ];
    
    return (
        <React.Fragment>
        <div className="page-content">
            <Container fluid>
                <Breadcrumbs title="PRESCRIPTIONS LIST" breadcrumbItems={breadcrumbItems} />
                <Row>
                    <Col xs={12}>
                        <Card>
                            <CardBody>
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <Dropdown isOpen={exportDropdownOpen} toggle={toggleExportDropdown}>
                                        <DropdownToggle caret>
                                            Export
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            <DropdownItem onClick={handleCSVExport}>Export as CSV</DropdownItem>
                                            <DropdownItem onClick={handleExcelExport}>Export as Excel</DropdownItem>
                                        </DropdownMenu>
                                    </Dropdown>
                                </div>
                                <div className="table-responsive">
                                    <BootstrapTable
                                        keyField="prescription_id"
                                        data={currentPrescription}
                                        columns={columns}
                                        pagination={paginationFactory()}
                                    />
                                </div>
                                {renderPagination()}
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
  
        <CSVLink
            data={exportData}
            filename={"prescriptions.csv"}
            className="hidden"
            ref={(r) => setCsvLink(r)} // Set the ref with the setter function
            target="_blank"
        />
    </React.Fragment>
    );
};

export default Prescriptions;

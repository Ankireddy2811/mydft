import React, { useState,useEffect} from "react";
import { Row, Col, Card, CardBody, Container } from "reactstrap";
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { toast } from 'react-toastify';
//import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS file for stylingimport { CSVLink } from 'react-csv';
import * as XLSX from 'xlsx';
import { CSVLink } from 'react-csv';
import { Table, Column, Filter as TableFilter } from 'react-filterable-table';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import { drfGetBedDetails,drfDeleteBed } from "../../drfServer";

const ListBed = (props) => {
    const [breadcrumbItems] = useState([
        { title: "Tables", link: "#" },
        { title: "Responsive Table", link: "#" },
    ]);

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [bedsPerPage] = useState(10);
    const [exportData, setExportData] = useState([]);
    const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [client_id, setClientId] = useState("");
    const [access_token, setAccessToken] = useState("");
    const [csvLink, setCsvLink] = useState(null);

    useEffect(() => {
        const id = JSON.parse(localStorage.getItem('client_id'));
        const access = JSON.parse(localStorage.getItem('access_token'));
        setClientId(id);
        setAccessToken(access);
        getAllBeds();
    }, []);

    const togglePopover = () => {
        setPopoverOpen(!popoverOpen);
    };

    const handleEdit = (bed_id, department_id) => {
        props.history.replace(`/edit-bed/${bed_id}/${department_id}`);
    };

    const getAllBeds = async () => {
        try {
            const headersPart = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`
                }
            }
            const response = await drfGetBedDetails({ client_id }, headersPart);
            const responseData = response.data.Data;
            setData(responseData);
            setLoading(false);
        } catch (error) {
            setError('Error fetching data');
            setLoading(false);
        }
    }

    const handleDeleteBed = async (bed_id, department_id) => {
        const confirmDelete = window.confirm("Delete this bed?\nYou won't be able to revert this!");

        if (confirmDelete) {
            const headersPart = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`
                }
            }
            const requestFormData = {
                client_id,
                department_id,
                bed_id
            }

            try {
                const response = await drfDeleteBed(requestFormData, headersPart);

                if (!response.ok) {
                    throw new Error("Deletion failed");
                }

                getAllBeds();
                toast.success("The bed has been deleted.");
            } catch (error) {
                console.error('Deletion failed:', error);
                toast.error("Deletion failed");
            }
        }
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const prepareExportData = () => {
        const exportData = data.map((bed) => ({
            'Bed ID': bed.bed_id,
            'Bed Number': bed.bed_number,
            'Department ID': bed.department_id,
            'Occupied': bed.is_occupied ? 'Yes' : 'No',
            'Created At': bed.created_at,
            'Updated At': bed.updated_at,
        }));

        return exportData;
    };

    const handleCSVExport = () => {
        const exportData = prepareExportData();
        setExportData(exportData);
        csvLink.link.click();
    };

    const handleExcelExport = () => {
        const exportData = prepareExportData();
        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Beds');
        XLSX.writeFile(wb, 'beds.xlsx');
    };

    const toggleExportDropdown = () => {
        setExportDropdownOpen(!exportDropdownOpen);
    };

    const renderPagination = () => {
      

        if (!data) {
            return null; // or return some default value for pagination
        }

        const totalPages = Math.ceil(data.length / bedsPerPage);

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

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const currentBeds = data?.slice((currentPage - 1) * bedsPerPage, currentPage * bedsPerPage) || [];

    return (
        <>
        <div className="page-content">
            <Container fluid>
                <Breadcrumbs title="BEDS LIST" breadcrumbItems={breadcrumbItems} />
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
                                    <Table
                                        id="beds-table"
                                        className="table table-bordered"
                                        data={currentBeds}
                                    >
                                        <Column
                                            id="bed_id"
                                            header="Bed ID"
                                            cell={(row) => row.bed_id}
                                            sortable
                                        />
                                        <Column
                                            id="bed_number"
                                            header="Bed Number"
                                            cell={(row) => row.bed_number}
                                            sortable
                                        />
                                        <Column
                                            id="department_id"
                                            header="Department ID"
                                            cell={(row) => row.department_id}
                                            sortable
                                        />
                                        <Column
                                            id="is_occupied"
                                            header="Occupied"
                                            cell={(row) => row.is_occupied ? 'Yes' : 'No'}
                                            sortable
                                        />
                                        <Column
                                            id="created_at"
                                            header="Created At"
                                            cell={(row) => row.created_at}
                                            sortable
                                        />
                                        <Column
                                            id="updated_at"
                                            header="Updated At"
                                            cell={(row) => row.updated_at}
                                            sortable
                                        />
                                        <Column
                                            id="actions"
                                            header="Actions"
                                            cell={(row) => (
                                                <div>
                                                    <FaEdit style={{ color: "purple" }} className="cursor-pointer mx-2" onClick={() => handleEdit(row.bed_id, row.department_id)} />
                                                    <FaTrashAlt style={{ color: "red" }} className="cursor-pointer mx-2" onClick={() => handleDeleteBed(row.bed_id, row.department_id)} />
                                                </div>
                                            )}
                                        />
                                    </Table>
                                </div>
                                {renderPagination()}
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
        <div>
        <CSVLink
            data={exportData}
            filename={"beds.csv"}
            className="hidden"
            ref={(r) => setCsvLink(r)} // Set the ref with the setter function
            target="_blank"
        />
    </div>
    </>
    )
};

export default ListBed;
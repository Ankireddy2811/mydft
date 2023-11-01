import React, { Component } from "react";
import { Row, Col, Card, CardBody, Container } from "reactstrap";
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS file for stylingimport { CSVLink } from 'react-csv';
import * as XLSX from 'xlsx';
import { CSVLink } from 'react-csv';


import { Table, Column, Filter as TableFilter } from 'react-filterable-table';

import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
//import 'react-filterable-table/dist/react-filterable-table.css'; // Import the CSS file for react-filterable-table
import { drfGetBedDetails,drfDeleteBed } from "../../drfServer";
class ListBed extends Component {
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
            bedsPerPage: 10,
            exportData: [],
            popoverOpen: false,
            client_id: "",
            access_token:""
        };
    }

    componentDidMount() {
        const id = JSON.parse(localStorage.getItem('client_id'));
        const access = JSON.parse(localStorage.getItem('access_token'),);
        this.setState({ client_id: id ,access_token: access,}, () => {
            this.getAllBeds();
        });
    }

    togglePopover = () => {
        this.setState((prevState) => ({
            popoverOpen: !prevState.popoverOpen,
        }));
    };

    handleEdit = (bed_id, department_id) => {
        this.props.history.push(`/edit-bed/${bed_id}/${department_id}`);
    };

    
    getAllBeds = async () => {
        try {
            const { client_id,access_token } = this.state;
            const headersPart = {
                headers : {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`
                  }
            }
            const response = await drfGetBedDetails({ client_id },headersPart);

            const data = response.data.Data;
            this.setState({ data: data, loading: false });
        } catch (error) {
            this.setState({ error: 'Error fetching data'})
        }
    }
        

    /* getAllBeds = async () => {
        try {
            const { client_id,access_token } = this.state; // Destructure client_id and access_token
            
         
            const payload = { client_id};
            console.log(payload)
            const options = {
                method:"POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${access_token}`,
                  },
                body:JSON.stringify(payload)
    
            }
             const response = await fetch(`https://www.iyrajewels.com/Bed/detail/`,options)
             // console.log(response)
            
            console.log(response)
            const data = response.data.Data;
            console.log(data)
            this.setState({ data: data, loading: false });
        } catch (error) {
            this.setState({ error: 'Error fetching data', loading: false });
        }
    };  */ 

    handleDeleteBed = async (bed_id, department_id) => {
        const confirmDelete = window.confirm("Delete this bed?\nYou won't be able to revert this!");
        const {
            client_id,access_token
        } = this.state;
        if (confirmDelete) {
            const headersPart = {
                headers : {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`
                  }
            }
            const formData = {
                client_id, department_id, bed_id
            }
            try {
                

                const response = await drfDeleteBed(formData,headersPart); 

                if (!response.ok) {
                    throw new Error("Deletion failed");
                }

                this.getAllBeds();
                alert("The bed has been deleted.");
            } catch (error) {
                console.error('Deletion failed:', error);
                alert("Deletion failed");
            }
        }
    };

    handlePageChange = (newPage) => {
        this.setState({
            currentPage: newPage,
        });
    };

    prepareExportData = () => {
        const { data } = this.state;
        const exportData = data.map((bed) => ({
            'Bed ID': bed.bed_id,
            'Bed Number': bed.bed_number,
            'Department ID': bed.department_id,
            'Occupied': bed.is_occupied,
            'Created At': bed.created_at,
            'Updated At': bed.updated_at,
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
        XLSX.utils.book_append_sheet(wb, ws, 'Beds');
        XLSX.writeFile(wb, 'beds.xlsx');
    };

    toggleExportDropdown = () => {
        this.setState((prevState) => ({
            exportDropdownOpen: !prevState.exportDropdownOpen,
        }));
    };

    renderPagination = () => {
        const { data, currentPage, bedsPerPage } = this.state;
        const totalPages = Math.ceil(data.length / bedsPerPage);

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
        const { data, loading, error, exportData, currentPage, bedsPerPage } = this.state;

        if (loading) {
            return <div>Loading...</div>;
        }

        if (error) {
            return <div>{error}</div>;
        }

        const currentBeds = data?.slice((currentPage - 1) * bedsPerPage, currentPage * bedsPerPage);

        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid>
                        <Breadcrumbs title="BEDS LIST" breadcrumbItems={this.state.breadcrumbItems} />
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
                                                            <FaEdit style={{ color: "purple" }} className="cursor-pointer mx-2" onClick={() => this.handleEdit(row.bed_id, row.department_id)} />
                                                            <FaTrashAlt style={{ color: "red" }} className="cursor-pointer mx-2" onClick={() => this.handleDeleteBed(row.bed_id, row.department_id)} />
                                                        </div>
                                                    )}
                                                />
                                            </Table>
                                        </div>
                                        {this.renderPagination()}
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </div>
                <CSVLink
                    data={exportData}
                    filename={"beds.csv"}
                    className="hidden"
                    ref={(r) => (this.csvLink = r)}
                    target="_blank"
                />
            </React.Fragment>
        );
    }
}

export default ListBed;

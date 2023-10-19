import React, { Component } from "react";
import { Row, Col, Card, CardBody, Container } from "reactstrap";
import { FaEdit, FaTrashAlt, FaEllipsisV } from 'react-icons/fa';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import BootstrapTable from 'react-bootstrap-table-next';
import { toast } from 'react-toastify';
import axios from 'axios';
import Swal from "sweetalert2";
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS file for styling
import paginationFactory from 'react-bootstrap-table2-paginator';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import { CSVLink } from 'react-csv';
import * as XLSX from 'xlsx';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
// import { drfBedData } from "../../drfServer";

class Beds extends Component {
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
            popoverOpen: false, // New state property to control popover visibility
            client_id: "",
            access_token:"",
            sortOrder: 'asc', // Initial sorting order
            searchQuery: "", // State for search query
            sortField: 'patient_id', // Initial sorting field
            sortDirection: 'asc', // Initial sorting direction
            sortedColumn: 'patient_id', // Initial sorted column
        };
    }

    // componentDidMount() {
    //     this.getAllBeds();
    // }
    componentDidMount() {

        // Retrieve client_id from localStorage
        const access = JSON.parse(localStorage.getItem('access_token'),);
        const id = JSON.parse(localStorage.getItem('client_id'));
        if (access && id) {
          this.setState({ client_id: id, access_token: access, }, () => {
            this.getAllBeds();
          });
}
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
            const { client_id, access_token } = this.state; // Destructure client_id and access_token
            
         
            const payload = { client_id};
            console.log(payload)
            const options = {
                method:"POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${access_token}`,
                  },
                body:JSON.stringify(payload)
    
            }
             const response = await fetch(`https://www.iyrajewels.com/Bed/detail/`,options)
    
            const data = response.data.Data; // No need to await here, response.data is already a Promise
            this.setState({ data, loading: false }); // You can use object shorthand here
        } catch (error) {
            this.setState({ error: 'Error fetching data', loading: false });
        }
    };
    
    handleDeleteBed = async (bed_id, department_id) => {
        const { client_id, access_token } = this.state;
      
        try {
          const result = await Swal.fire({
            title: 'Are you sure?',
            text: "Delete this bed?\nYou won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
            reverseButtons: true,
          });
      
          if (result.isConfirmed) {
            await this.deleteBed(bed_id, department_id, client_id, access_token);
            Swal.fire('Deleted!', 'Your file has been deleted.', 'success');

          }
        } catch (error) {
          console.error('Deletion failed:', error);
          toast.error('Deletion failed');
        }
      };
      
      deleteBed = async (bed_id, department_id, client_id, access_token) => {
        try {
        const apiUrl = "https://www.iyrajewels.com/Bed/deleteBy/"
        const payload = {bed_id, department_id, client_id};
        const options = {
            method:"POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${access_token}`,
              },
            body:JSON.stringify(payload)

        }

        const response = await fetch(apiUrl,options)
       
        await this.getAllBeds();

         
        } catch (error) {
          console.error('Deletion failed:', error);
          toast.error('Deletion failed');
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
            // Trigger CSV download
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
        const { data, loading, error, currentPage, bedsPerPage } = this.state;

        if (loading) {
            return <div>Loading...</div>;
        }

        if (error) {
            return <div>{error}</div>;
        }

        const indexOfLastBed = currentPage * bedsPerPage;
        const indexOfFirstBed = indexOfLastBed - bedsPerPage;
        const currentBed = data?.slice(indexOfFirstBed, indexOfLastBed);

        const columns = [
            { dataField: 'bed_id', text: 'Bed ID', sort: true },
            { dataField: 'bed_number', text: 'Bed Number', sort: true },
            { dataField: 'department_id', text: 'Department ID', sort: true },
            { dataField: 'is_occupied', text: 'Occupied' },
            { dataField: 'created_at', text: 'Created At', sort: true },
            { dataField: 'updated_at', text: 'Updated At', sort: true },
            {
                dataField: 'actions', text: 'Actions', formatter: (cell, row) => (
                    <>
                        <FaEdit style={{ color: "purple" }} className="cursor-pointer mx-2" onClick={() => this.handleEdit(row.bed_id, row.department_id)} />
                        <FaTrashAlt style={{ color: "red" }} className="cursor-pointer mx-2" onClick={() => this.handleDeleteBed(row.bed_id, row.department_id)} />
                    </>
                )
            },
        ];

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
                                            <BootstrapTable
                                                keyField="bed_id"
                                                data={currentBed}
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
                    filename={"beds.csv"}
                    className="hidden"
                    ref={(r) => (this.csvLink = r)}
                    target="_blank"
                />
            </React.Fragment>
        );
    }
}

export default Beds;

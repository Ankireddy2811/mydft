import React, { Component } from "react";
import BootstrapTable from 'react-bootstrap-table-next';
import { toast } from 'react-toastify'; // Import toast from react-toastify
import axios from 'axios';
import Swal from 'sweetalert2'; // Import sweetalert2
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS file for styling//import paginationFactory from 'react-bootstrap-table2-paginator';
import { Row, Col, Card, CardBody, Container } from "reactstrap";
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import Breadcrumbs from '../../components/Common/Breadcrumb';
//import { Tooltip as ReactTooltip } from 'react-tooltip';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import { CSVLink } from 'react-csv';
import * as XLSX from 'xlsx';
import ReactTooltip from 'react-tooltip';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { withRouter } from 'react-router-dom';

class Hospitals extends Component {
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
            access_token:"",
            client_id:"",
            filterText: '', // New state for the filter input
            currentPage: 1,
            hospitalsPerPage: 10,
            sortOrder: 'asc', // Initial sorting order
            sortField: 'client_id', // Initial sorting field
            sortDirection: 'asc', // Initial sorting direction
            sortedColumn: 'client_id', // Initial sorted column
            exportData: [], // Initialize with an empty array for export
            exportDropdownOpen: false, // Initialize dropdown state as closed
            searchQuery: "", // State for search query
            access_token:"",
        };
    }

    componentDidMount() {
        const access = JSON.parse(localStorage.getItem('access_token'));
        if (access) {
          this.setState({ access_token: access },()=>{this.getAllHospitals();
          });
          //console.log("hello" + this.state.access_token);
        }
    }
      
    handleEdit = (client_id) => {
        this.props.history.push(`/edit-hospital/${client_id}`);
    };

    getAllHospitals = async () => {
        try {
            const acces = this.state.access_token;
            const response = await fetch("/Hospital/list/", {
                headers: {
                    'Authorization': `Bearer ${acces}`
                }
            });

            if (!response.ok) {
                throw new Error("Network response was not ok.");
            }

            const data = await response.json();
            const sortedData = this.state.sortOrder === 'asc'
                ? data.sort((a, b) => a.client_id - b.client_id)
                : data.sort((a, b) => b.client_id - a.client_id);

            this.setState({ data: sortedData, loading: false });
        } catch (error) {
            console.error(error);
            this.setState({ error: 'Error fetching data', loading: false });
        }
    };
    // Define the deleteHospital function separately
deleteHospital = async (client_id, access_token) => {
    const response = await fetch(`/Hospital/delete/${client_id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${access_token}`,
      },
    });
  
    
  
    this.getAllHospitals();
  };
  
  // Now, the handleDeleteHospital function
  handleDeleteHospital = async (client_id) => {
    const { access_token } = this.state;
  
    try {
      const result = await Swal.fire({
        title: 'Delete Hospital',
        text: "Are you sure you want to delete this hospital? You won't be able to revert this action!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel',
        reverseButtons: true,
      });
  
      if (result.isConfirmed) {
        await this.deleteHospital(client_id, access_token);
        Swal.fire('Deleted!', 'The hospital has been deleted.', 'success');
      }
    } catch (error) {
      console.error('Deletion failed:', error);
      Swal.fire('Error', 'Deletion failed', 'error');
    }
  };
  
    handlePageChange = (newPage) => {
        this.setState({
            currentPage: newPage,
        });
    };

    prepareExportData = () => {
        const { data } = this.state;
        const exportData = data.map((hospital) => ({
            'Client ID': hospital.client_id,
            'Hospital Name': hospital.hospital_name,
            'Name': hospital.name,
            'Owner Name':hospital.owner_name,
            'Email': hospital.email,
            'Phone No.': hospital.phone,
            'User Type': hospital.user_type,
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
        XLSX.utils.book_append_sheet(wb, ws, 'Hospitals');
        XLSX.writeFile(wb, 'hospital.xlsx');
    };

    toggleExportDropdown = () => {
        this.setState((prevState) => ({
            exportDropdownOpen: !prevState.exportDropdownOpen,
        }));
    };

    // Method to handle search input change
    handleSearchChange = (event) => {
        this.setState({ searchQuery: event.target.value });
    };

    handleSortChange = (field) => {
        this.setState((prevState) => ({
            sortField: field,
            sortDirection:
                prevState.sortField === field
                    ? prevState.sortDirection === 'asc'
                        ? 'desc'
                        : 'asc'
                    : 'asc',
        }));
    };

    renderPagination = () => {
        const { data, currentPage, hospitalsPerPage } = this.state;
        const totalPages = Math.ceil(data.length / hospitalsPerPage);

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
        const { loading, error, filterText,data, currentPage, hospitalsPerPage, sortOrder, sortField, sortDirection, searchQuery,client_id } = this.state;
        // const filteredData = this.filterData();

        if (loading) {
            return <div>Loading...</div>;
        }

        if (error) {
            return <div>{error}</div>;
        }
        
        const indexOfLastHospital = currentPage * hospitalsPerPage;
        const indexOfFirstHospital = indexOfLastHospital - hospitalsPerPage;
        const filteredHospitals = data.filter((hospital) => {
            const hospitalNameMatch = hospital.hospital_name.toLowerCase().includes(searchQuery.toLowerCase());
            const ownerName = hospital.owner_name.toLowerCase().includes(searchQuery.toLowerCase());
            const emailMatch = hospital.email.toLowerCase().includes(searchQuery.toLowerCase());
            const phoneMatch = hospital.phone.toLowerCase().includes(searchQuery.toLowerCase());
           

            // Return true if at least one condition is met
            return (
                hospitalNameMatch ||
                ownerName ||
                emailMatch ||
                phoneMatch
                // Add more conditions here for additional fields to filter by
            );
        });
        const currentHospitals = filteredHospitals.slice(indexOfFirstHospital, indexOfLastHospital);

        const columns = [
            {
                dataField: 'client_id',
                text: 'Hospital ID',
                sort: true, // Enable sorting
                sortCaret: (order, column) => {
                    return order === this.state.sortOrder ? "↑" : "↓";
                },
            },
            {
                dataField: 'hospital_name',
                text: 'Hospital Name',
                sort: true, // Enable sorting
                sortCaret: (order, column) => {
                    return order === this.state.sortOrder ? "↑" : "↓";
                },
            },
            {
                dataField: 'owner_name',
                text: 'Owner Name',
                sort: true, // Enable sorting
                sortCaret: (order, column) => {
                    return order === this.state.sortOrder ? "↑" : "↓";
                },
            },
            {
                dataField: 'email',
                text: 'Email ID',
                sort: true, // Enable sorting
                sortCaret: (order, column) => {
                    return order === this.state.sortOrder ? "↑" : "↓";
                },
            },
            {
                dataField: 'phone',
                text: 'Phone No.',
                sort: true, // Enable sorting
                sortCaret: (order, column) => {
                    return order === this.state.sortOrder ? "↑" : "↓";
                },
            },
          
            {
                dataField: 'city',
                text: 'City',
                sort: true, // Enable sorting
                sortCaret: (order, column) => {
                    return order === this.state.sortOrder ? "↑" : "↓";
                },
            },
            {
                dataField: 'address',
                text: 'Address',
                sort: true, // Enable sorting
                sortCaret: (order, column) => {
                    return order === this.state.sortOrder ? "↑" : "↓";
                },
            },
            {
                dataField: 'actions',
                text: 'Actions',
                formatter: (cellContent, row) => (
                    <>
                        <FaEdit
                            style={{ color: "purple" }}
                            className="cursor-pointer mx-2"
                            onClick={() => this.handleEdit(row.client_id)}
                        />
                        <FaTrashAlt
                            style={{ color: "red" }}
                            className="cursor-pointer mx-2"
                            onClick={() => this.handleDeleteHospital(row.client_id)}
                        />
                    </>
                ),
            },
        ];


        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid>
                        <Breadcrumbs title="HOSPITALS LIST" breadcrumbItems={this.state.breadcrumbItems} />
                        <Row>
                            <Col xs={12}>
                                <Card>
                                    <CardBody>
                                    <div className="d-flex justify-content-between mb-2">
                                            <div className="d-flex align-items-center">
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
                                            <div className="d-flex align-items-center">
                                                <input
                                                    type="text"
                                                    placeholder="Search Hospitals"
                                                    value={searchQuery}
                                                    onChange={this.handleSearchChange}
                                                    className="form-control"
                                                />
                                            </div>
                                        </div>
                                        <div className="table-responsive">
                                           <BootstrapTable
                                            keyField={(row)=>row.client_id}
                                            data={currentHospitals}
                                            columns={columns}
                                            defaultSorted={[
                                                {
                                                    dataField: sortField,
                                                    order: sortDirection,
                                                },
                                            ]}
                                            // pagination={paginationFactory()}
                                            // filter={filterFactory()}
                                            striped
                                            sort={true}
                                                sortCaret={(order, column) => {
                                                    return order === this.state.sortOrder ? "↑" : "↓";
                                                }}
                                                onSort={this.handleSort}
                                        >
                                            
                                        </BootstrapTable>
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
                    filename={"doctors.csv"}
                    className="hidden"
                    ref={(r) => (this.csvLink = r)}
                    target="_blank"
                />
               
            </React.Fragment>
        );
    }
}

export default withRouter(Hospitals);

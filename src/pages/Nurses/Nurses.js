import React, { Component } from "react";
import { Row, Col, Card, CardBody, Container } from "reactstrap";
import { FaEdit, FaTrashAlt, FaEllipsisV } from 'react-icons/fa';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import BootstrapTable from 'react-bootstrap-table-next';
import Swal from "sweetalert2";
import { toast } from 'react-toastify'; // Import toast from react-toastify
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS file for styling
import paginationFactory from 'react-bootstrap-table2-paginator';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import { CSVLink } from 'react-csv';
import * as XLSX from 'xlsx';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
class Nurses extends Component {
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
            nursesPerPage: 10,
            exportData: [], // Initialize with an empty array for export
            exportDropdownOpen: false, // Initialize dropdown state as closed
            client_id:"",
            searchQuery: "", // State for search query
            sortField: 'patient_id', // Initial sorting field
            sortDirection: 'asc', // Initial sorting direction
            sortedColumn: 'patient_id', // Initial sorted column
            access_token:"",
        };
    }

    // componentDidMount() {
    //     this.getAllNurses();
    // }
    componentDidMount() {
        // const { sortOrder } = this.state; // You're not using client_id from state, so no need to destructure it here.
       
        const access = JSON.parse(localStorage.getItem('access_token'));
        const id = JSON.parse(localStorage.getItem('client_id'));
        if (access) {
          this.setState({ access_token: access });
         // console.log("hello" + this.state.access_token);
          this.setState({ client_id: id }, () => {
            this.getAllNurses();
          });
}


       }

    handleEdit = (nurse_id) => {
        this.props.history.push(`/edit-nurse/${nurse_id}`);
    };

    // getAllNurses = async () => {
    //     try {
    //         const response = await fetch("http://194.163.40.231:8080/Nurse/details");
    //         if (!response.ok) {
    //             throw new Error("Network response was not ok.");
    //         }
    //         const data = await response.json();
    //         this.setState({ data: data, loading: false });
    //         console.log(data);
    //     } catch (error) {
    //         this.setState({ error: 'Error fetching data', loading: false });
    //     }
    // };
    getAllNurses = async () => {
        const acces = this.state.access_token;

        try {
            const { client_id,sortOrder } = this.state;

            const response = await axios.post(
                `/Nurse/details/`,
                { client_id },
                {
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${acces}`,

                    },
                }
            );
    
            if (response.status !== 200) {
                throw new Error("Network response was not ok.");
            }
    
            const data = await response.data;
            const sortedData = sortOrder === 'asc'
            ? data.sort((a, b) => a.nurse_id - b.nurset_id)
            : data.sort((a, b) => b.nurse_id - a.nurse_id);
            this.setState({ data: sortedData, loading: false });
        } catch (error) {
            console.error("Error fetching data:", error);
            this.setState({ error: 'Error fetching data', loading: false });
        }
    };

    handleDeleteNurse = async (nurse_id) => {
        const { client_id, access_token } = this.state;
      
        try {
          const result = await Swal.fire({
            title: 'Are you sure?',
            text: "Delete this nurse?\nYou won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
            reverseButtons: true,
          });
      
          if (result.isConfirmed) {
            await this.deleteNurse(nurse_id, client_id, access_token);
            Swal.fire(
                'Deleted!',
                'Your file has been deleted.',
                'success'
              )
          } 
        } catch (error) {
          console.error('Deletion failed:', error);
          toast.error('Deletion failed');
        }
      };
      
      deleteNurse = async (nurse_id, client_id, access_token) => {
        try {
          const response = await axios.post(
            `/Nurse/delete-By/`,
            { nurse_id, client_id },
            {
              headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${access_token}`,
              },
            }
          );
          await this.getAllNurses();

          
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
        const exportData = data.map((nurse) => ({
            'Nurse ID': nurse.nurse_id,
            'Nurse Name': `${nurse.first_name} ${nurse.last_name}`,
            'Phone No.': nurse.contact_number,
            'Gender': nurse.gender,
            'D.O.B': nurse.date_of_birth,
            'Created At': nurse.created_at,
            'Updated At': nurse.updated_at,
            'Department': nurse.department,
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
        XLSX.utils.book_append_sheet(wb, ws, 'Nurses');
        XLSX.writeFile(wb, 'nurses.xlsx');
    };

    toggleExportDropdown = () => {
        this.setState((prevState) => ({
            exportDropdownOpen: !prevState.exportDropdownOpen,
        }));
    };
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
        const { data, currentPage, nursesPerPage } = this.state;
        const totalPages = Math.ceil(data.length / nursesPerPage);

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
        const { data, loading, error, currentPage, nursesPerPage,sortOrder, sortField, sortDirection, searchQuery } = this.state;
        
        if (loading) {
            return <div>Loading...</div>;
        }

        if (error) {
            return <div>{error}</div>;
        }

        const indexOfLastNurse = currentPage * nursesPerPage;
        const indexOfFirstNurse = indexOfLastNurse - nursesPerPage;
        const currentNurses = data?.slice(indexOfFirstNurse, indexOfLastNurse);

        const columns = [
            { dataField: 'nurse_id', text: 'Nurse ID', sort: true },
            { dataField: 'first_name', text: 'Nurse Name', formatter: (cell, row) => `${cell} ${row.last_name}` },
            { dataField: 'contact_number', text: 'Phone No.', sort: true },
            { dataField: 'gender', text: 'Gender' },
            { dataField: 'date_of_birth', text: 'D.O.B' },
            { dataField: 'created_at', text: 'Created At' },
            { dataField: 'updated_at', text: 'Updated At' },
            { dataField: 'department', text: 'Department' },
            {
                dataField: 'actions', text: 'Actions', formatter: (cell, row) => (
                    <>
                        <FaEdit style={{ color: "purple" }} className="cursor-pointer mx-2" onClick={() => this.handleEdit(row.nurse_id)} />
                        <FaTrashAlt style={{ color: "red" }} className="cursor-pointer mx-2" onClick={() => this.handleDeleteNurse(row.nurse_id)} />
                    </>
                )
            },
        ];

        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid>
                        <Breadcrumbs title="NURSES LIST" breadcrumbItems={this.state.breadcrumbItems} />
                        <Row>
                            <Col xs={12}>
                                <Card>
                                    <CardBody>
                                        <div className="d-flex justify-content-between align-items-center">
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
                                        <div className="table-responsive"> {/* Add this wrapper div */}
                                            <BootstrapTable
                                                keyField="nurse_id"
                                                data={currentNurses}
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
                    filename={"nurses.csv"}
                    className="hidden"
                    ref={(r) => (this.csvLink = r)}
                    target="_blank"
                />
            </React.Fragment>
        );
    }
}

export default Nurses;

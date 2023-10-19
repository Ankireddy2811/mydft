import React, { Component } from "react";
import { Row, Col, Card, CardBody, Container } from "reactstrap";
import { FaEdit, FaTrashAlt, FaEllipsisV } from 'react-icons/fa';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import Swal from "sweetalert2";
import { toast } from 'react-toastify'; // Import toast from react-toastify
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS file for styling
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import { CSVLink } from 'react-csv';
import * as XLSX from 'xlsx';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
class LabTest extends Component {
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
            labPerPage: 10,
            exportData: [],
            exportDropdownOpen: false,
            client_id:"",
            access_token:"",
            sortOrder: 'asc', // Initial sorting order
            sortField: 'doctor_id', // Initial sorting field
            sortDirection: 'asc', // Initial sorting direction
            sortedColumn: 'doctor_id', // Initial sorted column
            searchQuery: "", // State for search query

        };
    }

    // componentDidMount() {
    //     this.getAllLabTest();
    // }
    componentDidMount() {
        // const { sortOrder } = this.state; // You're not using client_id from state, so no need to destructure it here.
       
        const access = JSON.parse(localStorage.getItem('access_token'));
        const id = JSON.parse(localStorage.getItem('client_id'));
        if (access) {
          this.setState({ access_token: access });
          console.log("hello" + this.state.access_token);
          this.setState({ client_id: id }, () => {
            this.getAllLabTest();
          });
}

        
       }
    handleEdit = (lab_test_id) => {
        this.props.history.push(`/edit-lab-test/${lab_test_id}`);
    };

    
    getAllLabTest = async () => {
        const acces = this.state.access_token;

        try {
          const { client_id} = this.state;
          const response = await axios.post(`/LabTest/details/`, { client_id }, {
            headers: {
              "Content-Type": "application/json", // Set the content type to JSON,
              'Authorization': `Bearer ${acces}`,

            },
          });
      
        //   if (response.status !== 200) {
        //     throw new Error("Network response was not ok.");
        //   }
      
          const data = response.data;
      
          
      
          this.setState({ data: data, loading: false });
        } catch (error) {
          this.setState({ error: 'Error fetching data', loading: false });
        }
      };

      handleDeleteLabTest = async (lab_test_id) => {
        const { client_id, access_token } = this.state;
      
        try {
          const result = await Swal.fire({
            title: 'Are you sure?',
            text: "Delete this lab test?\nYou won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
            reverseButtons: true,
          });
      
          if (result.isConfirmed) {
            await this.deleteLabTest(lab_test_id, client_id, access_token);
            Swal.fire('Deleted!', 'Your file has been deleted.', 'success');

          } 
        } catch (error) {
          console.error('Deletion failed:', error);
          toast.error('Deletion failed');
        }
      };
      
      deleteLabTest = async (lab_test_id, client_id, access_token) => {
        try {
          const response = await axios.post(
            `/LabTest/delete-By/`,
            { lab_test_id, client_id },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${access_token}`,
              },
            }
          );
          await this.getAllLabTest();

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
        const exportData = data.map((lab) => ({
            'Lab Test ID': lab.lab_test_id,
            'Patient ID': lab.patient_id,
            'Doctor ID': lab.doctor_id,
            'Test Name': lab.test_name,
            'Test Date': lab.test_date,
            'Results': lab.results,
            'Created At': lab.created_at,
            'Updated At': lab.updated_at,
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
        XLSX.utils.book_append_sheet(wb, ws, 'LabTests');
        XLSX.writeFile(wb, 'lab_tests.xlsx');
    };

    toggleExportDropdown = () => {
        this.setState((prevState) => ({
            exportDropdownOpen: !prevState.exportDropdownOpen,
        }));
    };

    renderPagination = () => {
        const { data, currentPage, labPerPage } = this.state;
        const totalPages = Math.ceil(data.length / labPerPage);

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
        const { data, loading, error, currentPage, labPerPage } = this.state;

        if (loading) {
            return <div>Loading...</div>;
        }

        if (error) {
            return <div>{error}</div>;
        }

        const indexOfLastLab = currentPage * labPerPage;
        const indexOfFirstLab = indexOfLastLab - labPerPage;
        const currentLab = data?.slice(indexOfFirstLab, indexOfLastLab);

        const columns = [
            { dataField: 'lab_test_id', text: 'Lab Test ID', sort: true },
            { dataField: 'patient_id', text: 'Patient ID' },
            { dataField: 'doctor_id', text: 'Doctor ID' },
            { dataField: 'test_name', text: 'Test Name' },
            { dataField: 'test_date', text: 'Test Date' },
            { dataField: 'results', text: 'Results' },
            { dataField: 'created_at', text: 'Created At' },
            { dataField: 'updated_at', text: 'Updated At' },
            {
                dataField: 'actions', text: 'Actions', formatter: (cell, row) => (
                    <>
                        <FaEdit style={{ color: "purple" }} className="cursor-pointer mx-2" onClick={() => this.handleEdit(row.lab_test_id)} />
                        <FaTrashAlt style={{ color: "red" }} className="cursor-pointer mx-2" onClick={() => this.handleDeleteLabTest(row.lab_test_id)} />
                    </>
                )
            },
        ];

        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid>
                        <Breadcrumbs title="LAB TEST LIST" breadcrumbItems={this.state.breadcrumbItems} />
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
                                                keyField="lab_test_id"
                                                data={currentLab}
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
                    filename={"lab_tests.csv"}
                    className="hidden"
                    ref={(r) => (this.csvLink = r)}
                    target="_blank"
                />
            </React.Fragment>
        );
    }
}

export default LabTest;

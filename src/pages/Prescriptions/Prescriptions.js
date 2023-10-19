import React, { Component } from "react";
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
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS file for styling
class Prescriptions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            breadcrumbItems: [
                { title: "Tables", link: "#" },
                { title: "Responsive Table", link: "#" },
            ],
            data: [],
            loading: true,
            error: null,
            currentPage: 1,
            prescriptionPerPage: 10,
            exportData: [],
            exportDropdownOpen: false,
            client_id:"",
            access_token:"",
        };
    }

    // componentDidMount() {
    //     this.getAllPrescriptions();
    // }
    componentDidMount() {
        // const { sortOrder } = this.state; // You're not using client_id from state, so no need to destructure it here.
        const access = JSON.parse(localStorage.getItem('access_token'));
        const id = JSON.parse(localStorage.getItem('client_id'));
        if (access) {
          this.setState({ access_token: access });
          console.log("hello" + this.state.access_token);
          this.setState({ client_id: id }, () => {
            this.getAllPrescriptions();
          });
}
       }

    handleEdit = (prescription_id) => {
        this.props.history.push(`/edit-prescription/${prescription_id}`);
    };

    getAllPrescriptions = async () => {
        // try {
        //     const response = await fetch("http://194.163.40.231:8080/Prescription/list/");
        //     if (!response.ok) {
        //         throw new Error("Network response was not ok.");
        //     }
        //     const data = await response.json();
        //     this.setState({ data, loading: false });
        //     console.log(data);
        // } catch (error) {
        //     this.setState({ error: 'Error fetching data', loading: false });
        // }
        const acces = this.state.access_token;

        try {
            const { client_id } = this.state;
            const response = await axios.post(
                `/Prescription/details/`,
                { client_id }, // Wrap client_id in an object
                {
                    headers: { "Content-Type": "application/json",'Authorization': `Bearer ${acces}`
                },
                }
            );
    
            
    
            const data = response.data; // No need to await here, response.data is already a Promise
            this.setState({ data: data, loading: false });
           // console.log(data);
        } catch (error) {
            this.setState({ error: 'Error fetching data', loading: false });
        }
    };

    handleDeletePrescriptions = async (prescription_id) => {
        const { client_id, access_token } = this.state;
      
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
            await this.deletePrescription(prescription_id, client_id, access_token);
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
      
      deletePrescription = async (prescription_id, client_id, access_token) => {
        try {
          const response = await axios.post(
            `/Prescription/delete-By/`,
            { prescription_id, client_id },
            {
              headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${access_token}`,
              },
            }
          );
      
          if (response.status === 200) {
            await this.getAllPrescriptions();
            toast.success('The prescription has been deleted.');
          } else {
            throw new Error('Deletion failed');
          }
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
        XLSX.utils.book_append_sheet(wb, ws, 'Prescriptions');
        XLSX.writeFile(wb, 'prescriptions.xlsx');
    };

    toggleExportDropdown = () => {
        this.setState((prevState) => ({
            exportDropdownOpen: !prevState.exportDropdownOpen,
        }));
    };

    renderPagination = () => {
        const { data, currentPage, prescriptionPerPage } = this.state;
        const totalPages = Math.ceil(data.length / prescriptionPerPage);

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
        const { data, loading, error, currentPage, prescriptionPerPage } = this.state;

        if (loading) {
            return <div>Loading...</div>;
        }

        if (error) {
            return <div>{error}</div>;
        }

        const indexOfLastPrescription = currentPage * prescriptionPerPage;
        const indexOfFirstPrescription = indexOfLastPrescription - prescriptionPerPage;
        const currentPrescription = data.slice(indexOfFirstPrescription, indexOfLastPrescription);

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
                        <FaEdit style={{ color: "purple" }} className="cursor-pointer mx-2" onClick={() => this.handleEdit(row.prescription_id)} />
                        <FaTrashAlt style={{ color: "red" }} className="cursor-pointer mx-2" onClick={() => this.handleDeletePrescriptions(row.prescription_id)} />
                    </>
                )
            },
        ];

        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid>
                        <Breadcrumbs title="PRESCRIPTIONS LIST" breadcrumbItems={this.state.breadcrumbItems} />
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
                                                keyField="prescription_id"
                                                data={currentPrescription}
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
                    filename={"prescriptions.csv"}
                    className="hidden"
                    ref={(r) => (this.csvLink = r)}
                    target="_blank"
                />
            </React.Fragment>
        );
    }
}

export default Prescriptions;
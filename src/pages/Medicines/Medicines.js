import React, { Component } from "react";
import { Row, Col, Card, CardBody, Container } from "reactstrap";
import { FaEdit, FaTrashAlt, FaEllipsisV } from 'react-icons/fa';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import Swal from "sweetalert2";
import { toast } from 'react-toastify'; // Import toast from react-toastify
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS file for styling
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import { CSVLink } from 'react-csv';
import * as XLSX from 'xlsx';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
class Medicines extends Component {
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
            medicinesPerPage: 10,
            exportData: [], // Initialize with an empty array for export
            exportDropdownOpen: false, // Initialize dropdown state as closed
            client_id:"",
            access_token:"",
        };
    }

    // componentDidMount() {
    //     this.getAllMedicines();
    // }
    componentDidMount() {
        const access = JSON.parse(localStorage.getItem('access_token'));
        const id = JSON.parse(localStorage.getItem('client_id'));
        if (access) {
          this.setState({ access_token: access });
          console.log("hello" + this.state.access_token);
          this.setState({ client_id: id }, () => {
            this.getAllMedicines();
          });
}
       }

    handleEdit = (medicine_id) => {
        this.props.history.push(`/edit-medicine/${medicine_id}`);
    };

    getAllMedicines = async () => {
        const acces = this.state.access_token;

        try {
            const { client_id} = this.state;
            const response = await axios.post(`/Medicine/details/`, { client_id }, {
              headers: {
                "Content-Type": "application/json", // Set the content type to JSON
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

    handleDeleteMedicine = async (medicine_id) => {
        const { client_id, access_token } = this.state;
      
        try {
          const result = await Swal.fire({
            title: 'Delete Medicine',
            text: "Are you sure you want to delete this medicine? You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it',
            reverseButtons: true,
          });
      
          if (result.isConfirmed) {
            await axios.post(
              `/Medicine/delete-By/`,
              { medicine_id, client_id },
              {
                headers: {
                  "Content-Type": "application/json",
                  'Authorization': `Bearer ${access_token}`,
                },
              }
            );
      
            Swal.fire(
              'Deleted!',
              'The medicine has been deleted.',
              'success'
            );
      
            this.getAllMedicines();
          }
        } catch (error) {
          console.error('Deletion failed:', error);
          toast.error("Deletion failed");
        }
      };
      
    handlePageChange = (newPage) => {
        this.setState({
            currentPage: newPage,
        });
    };

    prepareExportData = () => {
        const { data } = this.state;
        const exportData = data.map((medicine) => ({
            'Medicine Id': medicine.medicine_id,
            'Medicine Name': medicine.medicine_name,
            'Manufacturer': medicine.manufacturer,
            'Unit Price': medicine.unit_price,
            'Stock Quantity': medicine.stock_quantity,
            'Created At': medicine.created_at,
            'Updated At': medicine.updated_at,
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
        XLSX.utils.book_append_sheet(wb, ws, 'Medicines');
        XLSX.writeFile(wb, 'medicines.xlsx');
    };

    toggleExportDropdown = () => {
        this.setState((prevState) => ({
            exportDropdownOpen: !prevState.exportDropdownOpen,
        }));
    };

    renderPagination = () => {
        const { data, currentPage, medicinesPerPage } = this.state;
        const totalPages = Math.ceil(data.length / medicinesPerPage);

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
        const { data, loading, error, currentPage, medicinesPerPage } = this.state;

        if (loading) {
            return <div>Loading...</div>;
        }

        if (error) {
            return <div>{error}</div>;
        }

        const indexOfLastMedicine = currentPage * medicinesPerPage;
        const indexOfFirstMedicine = indexOfLastMedicine - medicinesPerPage;
        const currentMedicines = data?.slice(indexOfFirstMedicine, indexOfLastMedicine);

        const columns = [
            { dataField: 'medicine_id', text: 'Medicine Id', sort: true },
            { dataField: 'medicine_name', text: 'Medicine Name' },
            { dataField: 'manufacturer', text: 'Manufacturer', sort: true },
            { dataField: 'unit_price', text: 'Unit Price' },
            { dataField: 'stock_quantity', text: 'Stock Quantity' },
            { dataField: 'created_at', text: 'Created At' },
            { dataField: 'updated_at', text: 'Updated At' },
            {
                dataField: 'actions', text: 'Actions', formatter: (cell, row) => (
                    <>
                        <FaEdit style={{ color: "purple" }} className="cursor-pointer mx-2" onClick={() => this.handleEdit(row.medicine_id)} />
                        <FaTrashAlt style={{ color: "red" }} className="cursor-pointer mx-2" onClick={() => this.handleDeleteMedicine(row.medicine_id)} />
                    </>
                )
            },
        ];

        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid>
                        <Breadcrumbs title="MEDICINES LIST" breadcrumbItems={this.state.breadcrumbItems} />
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
                                        <div className="table-responsive"> {/* Add this wrapper div */}
                                            <BootstrapTable
                                                keyField="medicine_id"
                                                data={currentMedicines}
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
                    filename={"medicines.csv"}
                    className="hidden"
                    ref={(r) => (this.csvLink = r)}
                    target="_blank"
                />
            </React.Fragment>
        );
    }
}

export default Medicines;

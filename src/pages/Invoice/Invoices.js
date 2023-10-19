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
import { toast } from 'react-toastify'; // Import toast from react-toastify
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS file for styling
import Swal from "sweetalert2";
class Invoices extends Component {
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
            invoicesPerPage: 10,
            exportData: [],
            exportDropdownOpen: false,
            client_id: "",
            searchQuery: "", // Add searchQuery state
            sortField: 'invoice_id', // Add sortField state
            sortDirection: 'asc', // Add sortDirection state
            sortOrder: 'asc', // Initial sorting order
            sortedColumn: 'invoice_id', // Initial sorted column
            access_token:"",
        };
    }

    // componentDidMount() {
    //     this.getAllInvoices();
    // }
    componentDidMount() {
        // const { sortOrder } = this.state; // You're not using client_id from state, so no need to destructure it here.
        const access = JSON.parse(localStorage.getItem('access_token'));
        const id = JSON.parse(localStorage.getItem('client_id'));
        if (access) {
          this.setState({ access_token: access });
          //console.log("hello" + this.state.access_token);
          this.setState({ client_id: id }, () => {
            this.getAllInvoices();
          });
       
       }
    }
    handleEdit = (invoice_id) => {
        this.props.history.push(`/edit-invoice/${invoice_id}`);
    };

   
    getAllInvoices = async () => {
        const acces = this.state.access_token;

        try {
          const { client_id,sortOrder} = this.state;
          const response = await axios.post(`/Invoice/details/`, { client_id }, {
            headers: {
              "Content-Type": "application/json", // Set the content type to JSON
              'Authorization': `Bearer ${acces}`,
            },
          });
      
     
      
          const data = response.data;
          const sortedData = sortOrder === 'asc'
                ? data.sort((a, b) => a.invoice_id - b.invoice_id)
                : data.sort((a, b) => b.invoice_id - a.invoice_id);
          
      
          this.setState({ data: sortedData, loading: false });
        } catch (error) {
          this.setState({ error: 'Error fetching data', loading: false });
        }
      };

      handleDeleteInvoice = async (invoice_id) => {
        const { client_id, access_token } = this.state;
      
        try {
          const result = await Swal.fire({
            title: 'Are you sure?',
            text: "Delete this invoice?\nYou won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
            reverseButtons: true,
          });
      
          if (result.isConfirmed) {
            await this.deleteInvoice(invoice_id, client_id, access_token);
            Swal.fire('Deleted!', 'Your file has been deleted.', 'success');

          } 
        } catch (error) {
          console.error('Deletion failed:', error);
          toast.error('Deletion failed');
        }
      };
      
      deleteInvoice = async (invoice_id, client_id, access_token) => {
        try {
          const response = await axios.post(
            `/Invoice/delete-By/`,
            { invoice_id, client_id },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${access_token}`,
              },
            }
          );
          await this.getAllInvoices();

          
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
    handleSearchChange = (event) => {
        this.setState({ searchQuery: event.target.value });
    };

    // Add a method to handle sort change
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
    

    prepareExportData = () => {
        const { data, searchQuery, sortField, sortDirection } = this.state;
        const filteredData = data.filter((invoice) => {
            // Add your filtering logic here based on searchQuery
            return (
                invoice.invoice_id.toString().includes(searchQuery) ||
                invoice.patient_id.toString().includes(searchQuery) ||
                invoice.invoice_date.includes(searchQuery) ||
                invoice.total_amount.toString().includes(searchQuery)
            );
        });

        // Sort the filtered data based on sortField and sortDirection
        const sortedData = filteredData.sort((a, b) => {
            const aValue = a[sortField];
            const bValue = b[sortField];
            if (sortDirection === 'asc') {
                return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
            } else {
                return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
            }
        });

        const exportData = sortedData.map((invoice) => ({
            'Invoice Id': invoice.invoice_id,
            'Patient ID': invoice.patient_id,
            'Invoice Date': invoice.invoice_date,
            'Total Amount': invoice.total_amount,
            'Created At': invoice.created_at,
            'Updated At': invoice.updated_at,
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
        XLSX.utils.book_append_sheet(wb, ws, 'Invoices');
        XLSX.writeFile(wb, 'invoices.xlsx');
    };

    toggleExportDropdown = () => {
        this.setState((prevState) => ({
            exportDropdownOpen: !prevState.exportDropdownOpen,
        }));
    };
    
    renderPagination = () => {
        const { data, currentPage, invoicesPerPage } = this.state;
        const totalPages = Math.ceil(data.length / invoicesPerPage);

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
        const { data, loading, error, currentPage, invoicesPerPage, searchQuery, sortField, sortDirection } = this.state;

        if (loading) {
            return <div>Loading...</div>;
        }

        if (error) {
            return <div>{error}</div>;
        }

        const indexOfLastInvoice = currentPage * invoicesPerPage;
        const indexOfFirstInvoice = indexOfLastInvoice - invoicesPerPage;
         // Filter the data based on the searchQuery
         const filteredInvoices = data.filter((invoice) => {
            const invoiceIdMatch = invoice.invoice_id === Number(searchQuery);
    const patientIdMatch = invoice.patient_id === Number(searchQuery);
            const invoiceDateMatch = invoice.invoice_date.toLowerCase().includes(searchQuery.toLowerCase());
            const invoiceTotalAmountMatch = invoice.total_amount.toLowerCase().includes(searchQuery.toLowerCase());

            // Return true if at least one condition is met
            return (
                invoiceIdMatch || patientIdMatch || invoiceDateMatch || invoiceTotalAmountMatch
                // Add more conditions here for additional fields to filter by
            );
        });
        const currentInvoices = filteredInvoices.slice(indexOfFirstInvoice, indexOfLastInvoice);

        const columns = [
            { dataField: 'invoice_id', text: 'Invoice Id', sort: true, sortCaret: (order) => order === 'asc' ? <>&uarr;</> : <>&darr;</>, onClick: () => this.handleSortChange('invoice_id') },
            { dataField: 'patient_id', text: 'Patient ID', sort: true, sortCaret: (order) => order === 'asc' ? <>&uarr;</> : <>&darr;</>, onClick: () => this.handleSortChange('patient_id') },
            { dataField: 'invoice_date', text: 'Invoice Date', sort: true, sortCaret: (order) => order === 'asc' ? <>&uarr;</> : <>&darr;</>, onClick: () => this.handleSortChange('invoice_date') },
            { dataField: 'total_amount', text: 'Total Amount', sort: true, sortCaret: (order) => order === 'asc' ? <>&uarr;</> : <>&darr;</>, onClick: () => this.handleSortChange('total_amount') },
            {
                dataField: 'actions', text: 'Actions', formatter: (cell, row) => (
                    <>
                        <FaEdit style={{ color: "purple" }} className="cursor-pointer mx-2" onClick={() => this.handleEdit(row.invoice_id)} />
                        <FaTrashAlt style={{ color: "red" }} className="cursor-pointer mx-2" onClick={() => this.handleDeleteInvoice(row.invoice_id)} />
                    </>
                )
            },
        ];

        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid>
                        <Breadcrumbs title="INVOICES LIST" breadcrumbItems={this.state.breadcrumbItems} />
                        <Row>
                            <Col xs={12}>
                                <Card>
                                    <CardBody>
                                        <div className="d-flex justify-content-between mb-2">
                                        <div className="d-flex align-items-center mb-3">
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
                                                placeholder="Search Invoices"
                                                value={searchQuery}
                                                onChange={this.handleSearchChange}
                                                className="form-control ml-2"
                                            />
                                            </div>
                                        </div>
                                        <div className="table-responsive">
                                            <BootstrapTable
                                                keyField="invoice_id"
                                                data={currentInvoices}
                                                columns={columns}
                                               // pagination={paginationFactory()}
                                               defaultSorted={[
                                                {
                                                    dataField: sortField,
                                                    order: sortDirection,
                                                },
                                            ]}
                                            striped
                                            sort={true}
                                            sortCaret={(order, column) => {
                                                return order === this.state.sortOrder ? "↑" : "↓";
                                            }}
                                            onSort={this.handleSort}
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
                    filename={"invoices.csv"}
                    className="hidden"
                    ref={(r) => (this.csvLink = r)}
                    target="_blank"
                />
            </React.Fragment>
        );
    }
}

export default Invoices;
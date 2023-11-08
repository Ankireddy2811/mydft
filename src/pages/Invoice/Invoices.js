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
import { toast } from 'react-toastify'; // Import toast from react-toastify
// import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS file for styling
import Swal from "sweetalert2";
import { drfDeleteInvoice,drfGetInvoiceDetails } from "../../drfServer";

const Invoices = (props) => {
    const [breadcrumbItems] = useState([
        { title: "Tables", link: "#" },
        { title: "Responsive Table", link: "#" },
    ]);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [invoicesPerPage] = useState(10);
    const [exportData, setExportData] = useState([]);
    const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
    const [client_id, setClientId] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortField, setSortField] = useState('invoice_id');
    const [sortDirection, setSortDirection] = useState('asc');
    const [sortOrder, setSortOrder] = useState('asc');
    const [access_token, setAccessToken] = useState("");
    const [csvLink, setCsvLink] = useState(null);

    useEffect(() => {
        const access = JSON.parse(localStorage.getItem('access_token'));
        const id = JSON.parse(localStorage.getItem('client_id'));
        if (access) {
            setAccessToken(access);
            setClientId(id);
            getAllInvoices(id, access)
        }
    }, []);

    const handleEdit = (invoice_id) => {
        props.history.push(`/edit-invoice/${invoice_id}`);
    };

    const getAllInvoices = async (client_id, access_token) => {
        try {
            const headersPart = {
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${access_token}`,
                },
            };

            const response = await drfGetInvoiceDetails({ client_id }, headersPart);

            const data = response.data;
            const sortedData = sortOrder === 'asc'
                ? data.sort((a, b) => a.invoice_id - b.invoice_id)
                : data.sort((a, b) => b.invoice_id - a.invoice_id);

            setData(sortedData);
            setLoading(false);
        } catch (error) {
            setError('Error fetching data');
            setLoading(false);
        }
    };

    const handleDeleteInvoice = async (invoice_id) => {
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
                await deleteInvoice(invoice_id, client_id, access_token);
                Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
            }
        } catch (error) {
            console.error('Deletion failed:', error);
            toast.error('Deletion failed');
        }
    };

    const deleteInvoice = async (invoice_id, client_id, access_token) => {
        const headersPart = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${access_token}`,
            },
        };

        const formData = {
            invoice_id,
            client_id,
        };
        try {
            await drfDeleteInvoice(formData, headersPart);
            await getAllInvoices(client_id, access_token);
            toast.success('The Invoice has been deleted.');
        } catch (error) {
            console.error('Deletion failed:', error);
            toast.error('Deletion failed');

        }
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
      };

      // Add a method to handle sort change
   

    const handleSortChange = (field) => {
        setSortField(field);
        setSortDirection(
            sortField === field
                ? sortDirection === 'asc' ? 'desc' : 'asc'
                : 'asc'
        );
    };

    const prepareExportData = () => {
        // Logic for preparing data for export
        // It should filter, sort, and format data for CSV or Excel
        
        const exportData = data.map(invoice => ({
            'Invoice Id': invoice.invoice_id,
            'Patient ID': invoice.patient_id,
            'Invoice Date': invoice.invoice_date,
            'Total Amount': invoice.total_amount,
            // Add more fields if needed
        }));
        return exportData;
    };

    const handleCSVExport = () => {
        const exportData = prepareExportData();
        setExportData(exportData);
        csvLink.link.click(); 
    };

    const handleExcelExport = () => {
        const exportData =  prepareExportData();
        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Invoices');
        XLSX.writeFile(wb, 'invoices.xlsx');
    };

    const toggleExportDropdown = () => {
        setExportDropdownOpen(!exportDropdownOpen);
    };

    
    // Method to handle search input change
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

   

    const handleSort = (field) => {
        setSortField(field);
        setSortDirection(
            sortField === field
                ? sortDirection === 'asc' ? 'desc' : 'asc'
                : 'asc'
        );
    }; 
    

    const renderPagination = () => {
        
         if (!data) {
             return null; // or return some default value for pagination
         }
     
         const totalPages = Math.ceil(data.length / invoicesPerPage);
 
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
        }
 
         const indexOfLastInvoice = currentPage * invoicesPerPage;
         const indexOfFirstInvoice = indexOfLastInvoice - invoicesPerPage;
          // Filter the data based on the searchQuery
          const filteredInvoices = data ? data.filter((invoice) => {
             const invoiceIdMatch = invoice.invoice_id === Number(searchQuery);
             const patientIdMatch = invoice.patient_id === Number(searchQuery);
             const invoiceDateMatch = invoice.invoice_date.toLowerCase().includes(searchQuery.toLowerCase());
             const invoiceTotalAmountMatch = invoice.total_amount.toLowerCase().includes(searchQuery.toLowerCase());
 
             // Return true if at least one condition is met
             return (
                 invoiceIdMatch || patientIdMatch || invoiceDateMatch || invoiceTotalAmountMatch
                 // Add more conditions here for additional fields to filter by
             );
         }):[];
         const currentInvoices = filteredInvoices.slice(indexOfFirstInvoice, indexOfLastInvoice);
 
         const columns = [
             { dataField: 'invoice_id', text: 'Invoice ID', sort: true, sortCaret: (order) => order === 'asc' ? <>&uarr;</> : <>&darr;</>, onClick: () => handleSortChange('invoice_id') },
             { dataField: 'patient_id', text: 'Patient ID', sort: true, sortCaret: (order) => order === 'asc' ? <>&uarr;</> : <>&darr;</>, onClick: () => handleSortChange('patient_id') },
             { dataField: 'invoice_date', text: 'Invoice Date', sort: true, sortCaret: (order) => order === 'asc' ? <>&uarr;</> : <>&darr;</>, onClick: () => handleSortChange('invoice_date') },
             { dataField: 'total_amount', text: 'Total Amount', sort: true, sortCaret: (order) => order === 'asc' ? <>&uarr;</> : <>&darr;</>, onClick: () =>handleSortChange('total_amount') },
             {
                 dataField: 'actions', text: 'Actions', formatter: (cell, row) => (
                     <>
                         <FaEdit style={{ color: "purple" }} className="cursor-pointer mx-2" onClick={() => handleEdit(row.invoice_id)} />
                         <FaTrashAlt style={{ color: "red" }} className="cursor-pointer mx-2" onClick={() => handleDeleteInvoice(row.invoice_id)} />
                     </>
                 )
             },
         ];
 
 

    return (
        <React.Fragment>
                <div className="page-content">
                    <Container fluid>
                        <Breadcrumbs title="INVOICES LIST" breadcrumbItems={breadcrumbItems} />
                        <Row>
                            <Col xs={12}>
                                <Card>
                                    <CardBody>
                                        <div className="d-flex justify-content-between mb-2">
                                        <div className="d-flex align-items-center mb-3">
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
                                           <div className="d-flex align-items-center">
                                            <input
                                                type="text"
                                                placeholder="Search Invoices"
                                                value={searchQuery}
                                                onChange={handleSearchChange}
                                                className="form-control ml-2"
                                            />
                                            </div>
                                        </div>
                                        <div className="table-responsive">
                                            <BootstrapTable
                                                keyField="invoice_id"
                                                data={currentInvoices}
                                                columns={columns}
                                                pagination={paginationFactory()}
                                                defaultSorted={[
                                                {
                                                    dataField: sortField,
                                                    order: sortDirection,
                                                },
                                            ]}
                                            striped
                                            sort={true}
                                            sortCaret={(order, column) => {
                                                return order === sortOrder ? "↑" : "↓";
                                            }}
                                            onSort={handleSort}
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
                    filename={"invoices.csv"}
                    className="hidden"
                    ref={(r) => setCsvLink(r)} // Set the ref with the setter function
                    target="_blank"
                />
            </React.Fragment>
    );
};

export default Invoices;
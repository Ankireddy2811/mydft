import React, { Component } from "react";
import { Row, Col, Card, CardBody, Container } from "reactstrap";
import { FaEdit, FaTrashAlt, FaEllipsisV } from 'react-icons/fa';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import BootstrapTable from 'react-bootstrap-table-next';
import Swal from 'sweetalert2';

import { toast } from 'react-toastify'; // Import toast from react-toastify
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS file for styling
import paginationFactory from 'react-bootstrap-table2-paginator';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import { CSVLink } from 'react-csv';
import * as XLSX from 'xlsx';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
class Payments extends Component {
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
            paymentPerPage: 10,
            exportData: [],
            exportDropdownOpen: false,
            client_id:"",
            access_token:"",
        };
    }

    // componentDidMount() {
    //     this.getAllPayments();
    // }
    componentDidMount() {
        // const { sortOrder } = this.state; // You're not using client_id from state, so no need to destructure it here.
       
         // Retrieve client_id from localStorage
         const access = JSON.parse(localStorage.getItem('access_token'));
         const id = JSON.parse(localStorage.getItem('client_id'));
         if (access) {
           this.setState({ access_token: access });
           console.log("hello" + this.state.access_token);
           this.setState({ client_id: id }, () => {
             this.getAllPayments();
           });
 }

       }

    handleEdit = (payment_id) => {
        this.props.history.push(`/edit-payment/${payment_id}`);
    };

    // getAllPayments = async () => {
    //     try {
    //         const {client_id}=this.state;
    //         const response = await axios.post(`http://194.163.40.231:8080/Payment/details/`,{client_id},
    //         {
    //             headers: {"Content-Type": "application/json",},
    //         });
    //         if (!response.ok) {
    //             throw new Error("Network response was not ok.");
    //         }
    //         const data = await response.data;
    //         this.setState({ data: data, loading: false });
    //         console.log(data);
    //     } catch (error) {
    //         this.setState({ error: 'Error fetching data', loading: false });
    //     }
    // };
    getAllPayments = async () => {
        const acces = this.state.access_token;

        try {
            const { client_id } = this.state;
            const response = await axios.post(
                `/Payment/details/`,
                { client_id }, // Wrap client_id in an object
                {
                    headers: { "Content-Type": "application/json",'Authorization': `Bearer ${acces}`
                },
                    
                }
            );
    
            if (response.status !== 200) {
                throw new Error("Network response was not ok.");
            }
    
            const data = response.data; // No need to await here, response.data is already a Promise
            this.setState({ data: data, loading: false });
           // console.log(data);
        } catch (error) {
            this.setState({ error: 'Error fetching data', loading: false });
        }
    };
    

    handleDeletePayment = async (payment_id) => {
        const { client_id, access_token } = this.state;
      
        try {
          const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
            reverseButtons: true,
          });
      
          if (result.isConfirmed) {
            await this.deletePayment(payment_id, client_id, access_token);
            Swal.fire(
              'Deleted!',
              'The payment has been deleted.',
              'success'
            );
          }
        } catch (error) {
          console.error('Deletion failed:', error);
          toast.error('Deletion failed');
        }
      };
      
      deletePayment = async (payment_id, client_id, access_token) => {
        try {
          const response = await fetch(`/Payment/delete-By/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              'Authorization': `Bearer ${access_token}`,
            },
            body: JSON.stringify({ payment_id, client_id }),
          });
      
          if (!response.ok) {
            throw new Error("Deletion failed");
          }
      
          await this.getAllPayments();
        } catch (error) {
          console.error('Deletion failed:', error);
          throw error; // Optionally, rethrow the error to handle it in the calling function
        }
      };
      
    handlePageChange = (newPage) => {
        this.setState({
            currentPage: newPage,
        });
    };

    prepareExportData = () => {
        const { data } = this.state;
        const exportData = data.map((payment) => ({
            'Payment ID': payment.payment_id,
            'Invoice ID': payment.invoice_id,
            'Payment Date': payment.payment_date,
            'Amount': payment.amount,
            'Created At': payment.created_at,
            'Updated At': payment.updated_at,
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
        XLSX.utils.book_append_sheet(wb, ws, 'Payments');
        XLSX.writeFile(wb, 'payments.xlsx');
    };

    toggleExportDropdown = () => {
        this.setState((prevState) => ({
            exportDropdownOpen: !prevState.exportDropdownOpen,
        }));
    };

    renderPagination = () => {
        const { data, currentPage, paymentPerPage } = this.state;
        const totalPages = Math.ceil(data.length / paymentPerPage);

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
        const { data, loading, error, currentPage, paymentPerPage } = this.state;

        if (loading) {
            return <div>Loading...</div>;
        }

        if (error) {
            return <div>{error}</div>;
        }

        const indexOfLastPayment = currentPage * paymentPerPage;
        const indexOfFirstPayment = indexOfLastPayment - paymentPerPage;
        const currentPayments = data?.slice(indexOfFirstPayment, indexOfLastPayment);

        const columns = [
            { dataField: 'payment_id', text: 'Payment ID', sort: true },
            { dataField: 'invoice_id', text: 'Invoice ID' },
            { dataField: 'payment_date', text: 'Payment Date' },
            { dataField: 'amount', text: 'Amount' },
            { dataField: 'created_at', text: 'Created At' },
            { dataField: 'updated_at', text: 'Updated At' },
            {
                dataField: 'actions', text: 'Actions', formatter: (cell, row) => (
                    <>
                        <FaEdit style={{ color: "purple" }} className="cursor-pointer mx-2" onClick={() => this.handleEdit(row.payment_id)} />
                        <FaTrashAlt style={{ color: "red" }} className="cursor-pointer mx-2" onClick={() => this.handleDeletePayment(row.payment_id)} />
                    </>
                )
            },
        ];

        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid>
                        <Breadcrumbs title="PAYMENTS LIST" breadcrumbItems={this.state.breadcrumbItems} />
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
                                                keyField="payment_id"
                                                data={currentPayments}
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
                    filename={"payments.csv"}
                    className="hidden"
                    ref={(r) => (this.csvLink = r)}
                    target="_blank"
                />
            </React.Fragment>
        );
    }
}

export default Payments;

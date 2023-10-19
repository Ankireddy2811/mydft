import React, { Component } from "react";
import { Row, Col, Card, CardBody, Container } from "reactstrap";
import { FaEdit, FaTrashAlt, FaEllipsisV } from 'react-icons/fa';
import { withRouter } from "react-router-dom";
import { toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS file for styling
import Swal from 'sweetalert2'; // Import sweetalert2
import Breadcrumbs from '../../components/Common/Breadcrumb';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import { CSVLink } from 'react-csv';
import * as XLSX from 'xlsx';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

class Departments extends Component {
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
            showAddForm: false,
            showEditForm: false,
            selectedDepartment: null,
            newDepartment_id: '',
            newDepartment_name: '',
            department_name: '',
            department_id: '',
            client: "",
            currentPage: 1,
            departmentsPerPage: 10,
            exportData: [],
            exportDropdownOpen: false,
            client_id: "",
            access_token:"",
        };
    }

    // componentDidMount() {
    //     this.getDepartments();
    // }
    componentDidMount() {
        // const { sortOrder } = this.state; // You're not using client_id from state, so no need to destructure it here.
        const access = JSON.parse(localStorage.getItem('access_token'));
        const id = JSON.parse(localStorage.getItem('client_id'));
        if (access) {
          this.setState({ access_token: access });
          //console.log("hello" + this.state.access_token);
          this.setState({ client_id: id }, () => {
            this.getDepartments();
          });
}
       
    }

    getDepartments = async () => {
        const acces = this.state.access_token;

        try {
            const { client_id } = this.state;
            const response = await axios.post(`/Department/details/`, { client_id }, {
                headers: {
                    "Content-Type": "application/json", // Set the content type to JSON
                    'Authorization': `Bearer ${acces}`,

                },
            });


            const data = await response.data.Data
            this.setState({ data: data, loading: false });
        } catch (error) {
            console.error("Error fetching data:", error);
            this.setState({ error: "Error fetching data", loading: false });
        }
    };

    handleEdit = (p) => {
        this.setState({
            department_id: p.department_id,
            newDepartment_name: p.department_name,
            showEditForm: true,
        });
    };

    submitEdit = async (e, department_id) => {
        e.preventDefault();
        console.log("Editing department_id:", department_id);
        const {
            newDepartment_name,
            showEditForm,
            access_token,

            client_id,
        } = this.state;
        const formData = {
            department_name: newDepartment_name,
            department_id,
            client_id,
            
            
        };
        try {
            const response = await fetch(`/Department/Updated/`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`,

                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();

            if (response.ok && data.message) {
                toast.success(data.message);
                this.getDepartments();
                this.setState({ showEditForm: false, department_name: "", newDepartmentName: "" })
            } else {
                // Handle error message
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    handleAddDepartment = async (e) => {
        e.preventDefault();

        const { department_name, client_id,access_token,
        } = this.state;
        const client = "";
        try {
            const response = await fetch(`/Department/add/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${access_token}`,

                },
                body: JSON.stringify({
                    department_name,
                    client: client_id,
                }),
            });

            if (!response.ok) {
                throw new Error("Addition failed");
            }

            this.setState({
                showAddForm: false,
                department_name: "",
            });

            this.getDepartments(); // Refresh the table data
            toast.success("The department has been added.");
        } catch (error) {
            console.error('Addition failed:', error);
            toast.error("Addition failed");
        }
    };

    handleDeleteDepartment = async (id) => {
        const { client_id, access_token } = this.state;
      
        try {
          const result = await Swal.fire({
            title: 'Delete Department',
            text: "Are you sure you want to delete this department? You won't be able to revert this action!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel',
            reverseButtons: true,
          });
      
          if (result.isConfirmed) {
            await this.deleteDepartment(id, client_id, access_token);
            Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
            
          }
            
        } catch (error) {
          console.error('Deletion failed:', error);
          Swal.fire('Error', 'Deletion failed', 'error');
        }
      };
      deleteDepartment = async (id, client_id, access_token) => {
        const response = await axios.post(
            `/Department/deleteBy/`,
            { department_id: id, client_id },
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${access_token}`,
              },
            }
          );
    
          this.getDepartments();
            Swal.fire('Deleted!', 'The department has been deleted.', 'success');
      };
    

    handlePageChange = (newPage) => {
        this.setState({
            currentPage: newPage,
        });
    };

    prepareExportData = () => {
        const { data } = this.state;
        const exportData = data.map((department) => ({
            'Department ID': department.department_id,
            'Department Name': department.department_name,
            'Created At': department.created_at,
            'Updated At': department.updated_at,
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
        XLSX.utils.book_append_sheet(wb, ws, 'Departments');
        XLSX.writeFile(wb, 'departments.xlsx');
    };

    toggleExportDropdown = () => {
        this.setState((prevState) => ({
            exportDropdownOpen: !prevState.exportDropdownOpen,
        }));
    };

    renderPagination = () => {
        const { data, currentPage, departmentsPerPage } = this.state;
        const totalPages = Math.ceil(data.length / departmentsPerPage);

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
        const { data, loading, error, showAddForm, showEditForm, department_id, department_name, newDepartment_name } = this.state;

        if (loading) {
            return <div>Loading...</div>;
        }

        if (error) {
            return <div>{error}</div>;
        }

        const indexOfLastDepartments = this.state.currentPage * this.state.departmentsPerPage;
        const indexOfFirstDepartments = indexOfLastDepartments - this.state.departmentsPerPage;
        const currentDepartments = data?.slice(indexOfFirstDepartments, indexOfLastDepartments);

        const columns = [
            { dataField: 'department_id', text: 'Department ID', sort: true },
            { dataField: 'department_name', text: 'Department Name', sort: true },
            { dataField: 'created_at', text: 'Created At', sort: true },
            { dataField: 'updated_at', text: 'Updated At', sort: true },
            {
                dataField: 'actions', text: 'Actions', formatter: (cell, row) => (
                    <>
                        <FaEdit style={{ color: "purple" }} className="cursor-pointer" onClick={() => this.handleEdit(row)} />
                        <FaTrashAlt style={{ color: "red" }} className="cursor-pointer mx-2" onClick={() => this.handleDeleteDepartment(row.department_id)} />
                    </>
                )
            },
        ];
        const paginationOptions = {
            sizePerPage: 10, // Number of rows to display per page
            sizePerPageList: [10, 20, 30], // Options for the user to select the number of rows per page
        };

        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid>
                        <div className="mb-3 d-flex align-items-center">
                            <h5 className="mx-3">Departments</h5>
                            <button
                                className="btn btn-secondary mb-1 "
                                style={{ borderRadius: "25px", }}
                                onClick={() => this.setState({ showAddForm: true })}
                            >
                                Add Department
                            </button>
                            <div className="mx-2 d-flex">
                                <Dropdown isOpen={this.state.exportDropdownOpen} toggle={this.toggleExportDropdown}>
                                    <DropdownToggle color="primary" style={{ borderRadius: "25px" }}>
                                        Export
                                    </DropdownToggle>
                                    <DropdownMenu right>
                                        <DropdownItem onClick={this.handleCSVExport}>Export as CSV</DropdownItem>
                                        <DropdownItem onClick={this.handleExcelExport}>Export as Excel</DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </div>
                        </div>
                        <Row>
                            <Col xs={12}>
                                <Card>
                                    <CardBody>
                                        <div className="table-rep-plugin">
                                            {showAddForm && (
                                                <div className="mb-3">
                                                    <h5>Add New Department</h5>
                                                    <form onSubmit={this.handleAddDepartment}>
                                                        {/* Add Department Form */}
                                                        <div className="mb-2">
                                                            {/* Input fields for adding a department */}
                                                            <div className="form-group">
                                                                <label htmlFor="department_name">Department Name</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    id="department_name"
                                                                    placeholder="Enter department name"
                                                                    value={this.state.department_name}
                                                                    onChange={(e) => this.setState({ department_name: e.target.value })}
                                                                    required
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="mb-2">
                                                            <Row className="justify-content-center align-items-center">
                                                                <Col md="12">
                                                                    <button
                                                                        type="submit"
                                                                        className="btn btn-primary"
                                                                        style={{ borderRadius: "25px", minWidth: "4rem", maxWidth: "6rem", width: "4.5rem" }}
                                                                    >
                                                                        Add
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-success mx-2"
                                                                        style={{ borderRadius: "25px" }}
                                                                        onClick={() => this.setState({ showAddForm: false })}
                                                                    >
                                                                        Cancel
                                                                    </button>
                                                                </Col>
                                                            </Row>
                                                        </div>
                                                    </form>
                                                </div>
                                            )}
                                            {showEditForm && (
                                                <div className="mb-3">
                                                    <h5>Edit Department</h5>
                                                    <form onSubmit={(e) => this.submitEdit(e, department_id)}>
                                                        {/* Edit Department Form */}
                                                        <div className="mb-2">
                                                            {/* Input fields for editing a department */}
                                                            <div className="form-group">
                                                                <label htmlFor="newDepartment_name">Edit Department Name</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    id="newDepartment_name"
                                                                    placeholder="Enter new department name"
                                                                    value={this.state.newDepartment_name}
                                                                    onChange={(e) => this.setState({ newDepartment_name: e.target.value })}
                                                                    required
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="mb-2">
                                                            <Row className="justify-content-center align-items-center">
                                                                <Col md="12">
                                                                    <button
                                                                        type="submit"
                                                                        className="btn btn-primary"
                                                                        style={{ borderRadius: "25px", minWidth: "4rem", maxWidth: "6rem", width: "4.5rem" }}
                                                                    >
                                                                        Save
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-success mx-2"
                                                                        onClick={() => this.setState({ showEditForm: false })}
                                                                        style={{ borderRadius: "25px" }}
                                                                    >
                                                                        Cancel
                                                                    </button>
                                                                </Col>
                                                            </Row>
                                                        </div>
                                                    </form>
                                                </div>
                                            )}
                                            <div className="table-responsive mb-0" data-pattern="priority-columns">
                                                <BootstrapTable
                                                    keyField="department_id"
                                                    data={currentDepartments}
                                                    columns={columns}
                                                    pagination={paginationFactory(paginationOptions)}
                                                    striped
                                                    condensed
                                                />
                                            </div>
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
                    filename={"departments.csv"}
                    className="hidden"
                    ref={(r) => (this.csvLink = r)}
                    target="_blank"
                />
            </React.Fragment>
        );
    }
}

export default withRouter(Departments);
// import React, { Component } from "react";
// import BootstrapTable from 'react-bootstrap-table-next';
// import paginationFactory from 'react-bootstrap-table2-paginator';
// import ToolkitProvider, { CSVExport } from 'react-bootstrap-table2-toolkit';
// import * as XLSX from 'xlsx';
// import { FaEdit, FaTrashAlt, FaEllipsisV } from 'react-icons/fa';
// import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

// class Departments extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             data: [],
//             loading: true,
//             error: null,
//             showAddForm: false,
//             showEditForm: false,
//             selectedDepartment: null,
//             newDepartment_id: '',
//             newDepartment_name: '',
//             department_name: '',
//             department_id: '',
//             client: "HID00004",
//             currentPage: 1,
//             departmentsPerPage: 10,
//             exportData: [],
//             exportDropdownOpen: false,
//         };
//     }

//     componentDidMount() {
//         this.getDepartments();
//     }

//     getDepartments = async () => {
//         try {
//             const response = await fetch(
//                 `http://194.163.40.231:8080/Department/list/`
//             );
//             if (!response.ok) {
//                 throw new Error("Network response was not ok.");
//             }
//             const data = await response.json();
//             this.setState({ data, loading: false });
//         } catch (error) {
//             console.error("Error fetching data:", error);
//             this.setState({ error: "Error fetching data", loading: false });
//         }
//     }

//     handleExcelExport = () => {
//         const { data } = this.state;
//         const exportData = data.map((department) => ({
//             'Department ID': department.department_id,
//             'Department Name': department.department_name,
//             'Created At': department.created_at,
//             'Updated At': department.updated_at,
//         }));

//         const ws = XLSX.utils.json_to_sheet(exportData);
//         const wb = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(wb, ws, 'Departments');
//         XLSX.writeFile(wb, 'departments.xlsx');
//     };

//     render() {
//         const { data, loading, error } = this.state;

//         const columns = [
//             { dataField: 'department_id', text: 'Department ID', sort: true },
//             { dataField: 'department_name', text: 'Department Name', sort: true },
//             { dataField: 'created_at', text: 'Created At', sort: true },
//             { dataField: 'updated_at', text: 'Updated At', sort: true },
//             {
//                 dataField: 'actions', text: 'Actions', formatter: (cell, row) => (
//                     <>
//                         <FaEdit style={{ color: "purple" }} className="cursor-pointer" onClick={() => this.handleEdit(row)} />
//                         <FaTrashAlt style={{ color: "red" }} className="cursor-pointer mx-2" onClick={() => this.handleDeleteDepartment(row.department_id)} />
//                     </>
//                 )
//             },
//         ];

//         const paginationOptions = {
//             sizePerPage: 10,
//             sizePerPageList: [10, 20, 30],
//         };

//         const { ExportCSVButton } = CSVExport;

//         if (loading) {
//             return <div>Loading...</div>;
//         }

//         if (error) {
//             return <div>{error}</div>;
//         }

//         return (
//             <React.Fragment>
//                 <div className="page-content">
//                     <div className="container-fluid">
//                         <div className="mb-3 d-flex align-items-center">
//                             <h5 className="mx-3">Departments</h5>
//                             <button
//                                 className="btn btn-secondary mb-1"
//                                 style={{ borderRadius: "25px" }}
//                             >
//                                 Add Department
//                             </button>
//                             <div className="mx-2 d-flex">
//                                 <Dropdown isOpen={this.state.exportDropdownOpen} toggle={this.toggleExportDropdown}>
//                                     <DropdownToggle color="primary" style={{ borderRadius: "25px" }}>
//                                         Export
//                                     </DropdownToggle>
//                                     <DropdownMenu right>
//                                         <DropdownItem onClick={this.handleCSVExport}>Export as CSV</DropdownItem>
//                                         <DropdownItem onClick={this.handleExcelExport}>Export as Excel</DropdownItem>
//                                     </DropdownMenu>
//                                 </Dropdown>
//                             </div>
//                         </div>
//                         <div className="row">
//                             <div className="col-12">
//                                 {/* Your additional content */}
//                                 <p>This is some additional content you can include.</p>
//                                 <p>Feel free to add more elements, text, or components here.</p>
//                             </div>
//                         </div>
//                         <div className="row">
//                             <div className="col-12">
//                                 <div className="table-responsive mb-0" data-pattern="priority-columns">
//                                     <ToolkitProvider
//                                         keyField="department_id"
//                                         data={data}
//                                         columns={columns}
//                                         exportCSV={{ onlyExportFiltered: true, exportAll: false }}
//                                     >
//                                         {props => (
//                                             <>
//                                                 <BootstrapTable
//                                                     {...props.baseProps}
//                                                     pagination={paginationFactory(paginationOptions)}
//                                                     striped
//                                                     condensed
//                                                 />
//                                                 <ExportCSVButton className="btn btn-primary mr-2" {...props.csvProps}>Export to CSV</ExportCSVButton>
//                                                 <button
//                                                     className="btn btn-primary"
//                                                     onClick={this.handleExcelExport}
//                                                 >
//                                                     Export to Excel
//                                                 </button>
//                                             </>
//                                         )}
//                                     </ToolkitProvider>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </React.Fragment>
//         );
//     }
// }

// export default Departments;

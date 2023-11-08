import React, { useState,useEffect } from "react";
import { Row, Col, Card, CardBody, Container } from "reactstrap";
import { FaEdit, FaTrashAlt, FaEllipsisV } from 'react-icons/fa';
import { withRouter } from "react-router-dom";
import { toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css'; // Import the CSS file for styling
import Swal from 'sweetalert2'; // Import sweetalert2
import Breadcrumbs from '../../components/Common/Breadcrumb';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import { CSVLink } from 'react-csv';
import * as XLSX from 'xlsx';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { drfAddDepartment,drfGetDepartmentDetails,drfUpdateDepartment,drfDeleteDepartment, } from "../../drfServer";

const Departments = () =>{
    
    const [breadcrumbItems] = useState([
                { title: "Tables", link: "#" },
                { title: "Responsive Table", link: "#" },
            ])

            const [data, setData] = useState(null);
            const [loading, setLoading] = useState(true);
            const [error, setError] = useState(null);
            const [currentPage, setCurrentPage] = useState(1);
            const [departmentsPerPage] = useState(10);
          
            const [exportData, setExportData] = useState([]);
            const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
            const [client_id, setClientID] = useState('');
           
            const [access_token, setAccessToken] = useState('');
            const [showAddForm, setShowAddForm] = useState(false);
            const [showEditForm, setShowEditForm] = useState(false);
          
            const [newDepartment_name, setNewDepartmentName] = useState('');
            const [department_name, setDepartmentName] = useState('');
            const [department_id, setDepartmentId] = useState('');
            const [csvLink, setCsvLink] = useState(null);
          
        
    

        useEffect(() => {
            const access = JSON.parse(localStorage.getItem('access_token'));
            const id = JSON.parse(localStorage.getItem('client_id'));
            if (access) {
                setAccessToken(access);
                setClientID(id);
                getDepartments(id,access);
            }
        }, []);
    

    const getDepartments = async (client_id,access_token) => {
        
        const headersPart = {
            headers: {
                "Content-Type": "application/json", // Set the content type to JSON
                'Authorization': `Bearer ${access_token}`,

            },
        }
        try {
           
            const response = await drfGetDepartmentDetails({ client_id },headersPart);

            if (response.status !== 200) {
                throw new Error("Network response was not ok.");
            }
            const data = await response.data.Data
            setData(data);
            setLoading(false);

            
        } catch (error) {
            setError('Error fetching data');
            setLoading(false);
        }
    };

    const handleEdit = (p) => {
        setDepartmentId(p.department_id)
        setNewDepartmentName(p.department_name)
        setShowEditForm(true)

    };

    const submitEdit = async (e, department_id) => {
        e.preventDefault();
       
        
        const requestFormData = {
            department_name: newDepartment_name,
            department_id,
            client_id,
        };

        const headersPart ={ 
            headers:
          {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`,

          }
        }
        try {
            const response = await drfUpdateDepartment(requestFormData,headersPart);
            const data = await response.data;

            if (data.message) {
                
                await getDepartments();
                toast.success(data.message);
                setNewDepartmentName("")
                setDepartmentName("")
                setShowEditForm(false)
               
            } else {
                toast.error(data.message || "An error occurred while processing your request.");
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("An error occurred while processing your request.");
        }
    };

    const handleAddDepartment = async (e) => {
        e.preventDefault();

        const requestFormData = {
            department_name,
            client:client_id,
            
            
        };
        const headersPart ={ 
            headers:
          {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`,

          }
        }
        
        try {
            const response = await drfAddDepartment(requestFormData,headersPart);

            if (response.status === 200){
                toast.success("The department has been added.");
                await getDepartments(); // Refresh the table data
                setShowAddForm(false);
                setDepartmentName("")
            }
           
           
               
        } catch (error) {
            console.error('Addition failed:', error);
            toast.error("Addition failed");
        }
    };

    const handleDeleteDepartment = async (id) => {
       
      
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
            await deleteDepartment(id, client_id, access_token);
            Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
            
          }
            
        } catch (error) {
          console.error('Deletion failed:', error);
          Swal.fire('Error', 'Deletion failed', 'error');
        }
      };

      const deleteDepartment = async (id, client_id, access_token) => {
        const requestFormData = {
            department_id:id,
            client_id
        }
        const headersPart ={ 
            headers:
          {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`,

          }
        }

        try{
            const response = await drfDeleteDepartment(requestFormData,headersPart);
            console.log(response)
            await getDepartments();
            Swal.fire('Deleted!', 'The department has been deleted.', 'success');
           
        }
        catch(error){
            toast.error(error);
        }
       
        
      };
    

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
      };


    const prepareExportData = () => {
      
        const exportData = data.map((department) => ({
            'Department ID': department.department_id,
            'Department Name': department.department_name,
            'Created At': department.created_at,
            'Updated At': department.updated_at,
        }));
        return exportData;
    };

    const handleCSVExport = () => {
        const exportData = prepareExportData();
        setExportData(exportData);
        csvLink.link.click();
        
    };

    const handleExcelExport = () => {
        const exportData = prepareExportData();
        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Departments');
        XLSX.writeFile(wb, 'departments.xlsx');
    };

    const toggleExportDropdown = () => {
        setExportDropdownOpen(!exportDropdownOpen);
    };

    const renderPagination = () => {
       
        if (!data){
            return null;
        }
        const totalPages = Math.ceil(data.length / departmentsPerPage);

        if (totalPages <= 1) {
            return null;
        }

        const paginationItems = [];
        for (let i = 1; i <= totalPages; i++) {
            paginationItems.push(
                <li key={i} className={`page-item${currentPage === i ? ' active' : ''}`}>
                    <a className="page-link" href="#" onClick={() =>handlePageChange(i)}>
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

    
        const indexOfLastDepartments = currentPage * departmentsPerPage;
        const indexOfFirstDepartments = indexOfLastDepartments - departmentsPerPage;
        const currentDepartments = data?.slice(indexOfFirstDepartments, indexOfLastDepartments) || [];

        const columns = [
            { dataField: 'department_id', text: 'Department ID', sort: true },
            { dataField: 'department_name', text: 'Department Name', sort: true },
            { dataField: 'created_at', text: 'Created At', sort: true },
            { dataField: 'updated_at', text: 'Updated At', sort: true },
            {
                dataField: 'actions', text: 'Actions', formatter: (cell, row) => (
                    <>
                        <FaEdit style={{ color: "purple" }} className="cursor-pointer" onClick={() => handleEdit(row)} />
                        <FaTrashAlt style={{ color: "red" }} className="cursor-pointer mx-2" onClick={() => handleDeleteDepartment(row.department_id)} />
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
                                onClick={() => setShowAddForm(true)}
                            >
                                Add Department
                            </button>
                            <div className="mx-2 d-flex">
                                <Dropdown isOpen={exportDropdownOpen} toggle={toggleExportDropdown}>
                                    <DropdownToggle color="primary" style={{ borderRadius: "25px" }}>
                                        Export
                                    </DropdownToggle>
                                    <DropdownMenu right>
                                        <DropdownItem onClick={handleCSVExport}>Export as CSV</DropdownItem>
                                        <DropdownItem onClick={handleExcelExport}>Export as Excel</DropdownItem>
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
                                                    <form onSubmit={handleAddDepartment}>
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
                                                                    value={department_name}
                                                                    onChange={(e) => setDepartmentName(e.target.value)}
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
                                                                        onClick={() => setShowAddForm(false)}
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
                                                    <form onSubmit={(e) => submitEdit(e, department_id)}>
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
                                                                    value={newDepartment_name}
                                                                    onChange={(e) => setNewDepartmentName(e.target.value)}
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
                                                                        onClick={() => setShowEditForm(false)}
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

                                        {renderPagination()}
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </div>
                <CSVLink
                    data={exportData}
                    filename={"departments.csv"}
                    className="hidden"
                    ref={(r) => setCsvLink(r)} // Set the ref with the setter function
                    target="_blank"
                />
            </React.Fragment>
        );
    }


export default withRouter(Departments);
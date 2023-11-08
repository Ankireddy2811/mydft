import React, { useState, useEffect } from "react";
import { Row, Col, Card, CardBody, Container } from "reactstrap";
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import BootstrapTable from 'react-bootstrap-table-next';
import { CSVLink } from 'react-csv';
import * as XLSX from 'xlsx';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import Swal from 'sweetalert2';
import { drfDeleteDoctor, drfGetDoctorDetails } from "../../drfServer";

const Doctors = ({ history }) => {
    const [breadcrumbItems] = useState([
        { title: "Tables", link: "#" },
        { title: "Responsive Table", link: "#" },
    ]);

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [doctorsPerPage] = useState(10);
    const [sortOrder, setSortOrder] = useState('asc');
    const [sortField, setSortField] = useState('doctor_id');
    const [sortDirection, setSortDirection] = useState('asc');
    const [sortedColumn, setSortedColumn] = useState('doctor_id');
    const [exportData, setExportData] = useState([]);
    const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
    const [client_id, setClientID] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [access_token, setAccessToken] = useState("");
    const [csvLink, setCsvLink] = useState(null);
   

    useEffect(() => {
        const access = JSON.parse(localStorage.getItem('access_token'));
        const id = JSON.parse(localStorage.getItem('client_id'));
        if (access) {
            setAccessToken(access);
            setClientID(id);
            getAllDoctors();
        }
    }, [client_id, access_token, sortOrder]);

    const getAllDoctors = async () => {
       
        try {
           const headersPart = {
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${access_token}`,
                }
            };
            // console.log(client_id);
            const response = await drfGetDoctorDetails({ client_id }, headersPart);

            if (response.status !== 200) {
                throw new Error("Network response was not ok.");
            }

            const data = response.data;

            const sortedData = sortOrder === 'asc'
                ? data.Data.sort((a, b) => a.doctor_id - b.doctor_id)
                : data.Data.sort((a, b) => b.doctor_id - a.doctor_id);

            setData(sortedData);
            setLoading(false);
        } catch (error) {
            setError('Error fetching data');
            setLoading(false);
        }
    };

    const handleEdit = (doctor_id) => {
        history.push(`/edit-doctor/${doctor_id}`);
    };

    const handleDeleteDoctor = async (doctor_id) => {
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
                await deleteDoctor(doctor_id, client_id, access_token);
                Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
            }
        } catch (error) {
            console.error('Deletion failed:', error);
            toast.error('Deletion failed');
        }
    };

    const deleteDoctor = async (doctor_id, client_id, access_token) => {
        const formData = { doctor_id, client_id };
        const headersPart = {
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${access_token}`,
            },
        };
        try {
            await drfDeleteDoctor(formData, headersPart);
            await getAllDoctors();
            toast.success('The doctor has been deleted.');
        } catch (error) {
            console.error('Deletion failed:', error);
            toast.error('Deletion failed');
        }
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
      };

    const prepareExportData = () => {
      
        const exportData = data.map((doctor) => ({
            'ID': doctor.doctor_id,
            'Doctor Name': `${doctor.first_name} ${doctor.last_name}`,
            'Email': doctor.email,
            'Phone No.': doctor.contact_number,
            'Specialty': doctor.specialty,
            'Qualifications': doctor.qualifications,
            'Department': doctor.department,
            'Address': doctor.address,
            'Gender': doctor.gender,
            'D.O.B': doctor.date_of_birth,
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
        XLSX.utils.book_append_sheet(wb, ws, 'Doctors');
        XLSX.writeFile(wb, 'doctors.xlsx');
    };

    const toggleExportDropdown = () => {
        setExportDropdownOpen(!exportDropdownOpen);
    };

    // Method to handle search input change
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleSortChange = (field) => {
        setSortField(field);
        setSortDirection(
            sortField === field
                ? sortDirection === 'asc' ? 'desc' : 'asc'
                : 'asc'
        );
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
    
        const totalPages = Math.ceil(data.length / doctorsPerPage);

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

        return (
            <ul className="pagination justify-content-center">
                {paginationItems}
            </ul>
        );
    };

   
   
   
   
   
   

    const indexOfLastDoctor = currentPage * doctorsPerPage;
    const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;

        // Filter the data based on the searchQuery
        const filteredDoctors = data ? data.filter((doctor) => {
            const fullName = `${doctor.first_name} ${doctor.last_name}`;
            const fullNameMatch = fullName.toLowerCase().includes(searchQuery.toLowerCase());
            const emailMatch = doctor.email.toLowerCase().includes(searchQuery.toLowerCase());
            const contactNumberMatch = doctor.contact_number.toLowerCase().includes(searchQuery.toLowerCase());
            const departmentMatch = doctor.department.toLowerCase().includes(searchQuery.toLowerCase());
            const specialityMatch = doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase());
        
            return (
                fullNameMatch ||
                emailMatch ||
                contactNumberMatch ||
                departmentMatch ||
                specialityMatch
            );
        }) : [];
        
       const currentDoctors = filteredDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor);

       const columns = [
           {
               dataField: 'doctor_id',
               text: 'Doctor ID',
               sort: true,
               sortCaret: (order, column) => {
                   return order === sortOrder ? "↑" : "↓";
               },

           },
           {
               dataField: 'first_name',
               text: 'Doctor Name',
               formatter: (cell, row) => `${cell} ${row.last_name}`,
               sort: true,
               sortCaret: (order, column) => {
                   return order === sortOrder ? "↑" : "↓";
               },

           },
           {
               dataField: 'email',
               text: 'Email',
               sort: true,
               sortCaret: (order, column) => {
                   return order === sortOrder ? "↑" : "↓";
               },
           },
           {
               dataField: 'contact_number',
               text: 'Phone',
               sort: true,
               sortCaret: (order, column) => {
                   return order === sortOrder ? "↑" : "↓";
               },
           },
           {
               dataField: 'qualifications',
               text: 'Qualifications',
               sort: true,
               sortCaret: (order, column) => {
                   return order === sortOrder ? "↑" : "↓";
               },

           },
           {
               dataField: 'department',
               text: 'Department',
               sort: true,
               sortCaret: (order, column) => {
                   return order === sortOrder ? "↑" : "↓";
               },
           },
           {
               dataField: 'gender',
               text: 'Gender',
               sort: true,
               sortCaret: (order, column) => {
                   return order === sortOrder ? "↑" : "↓";
               },
           },
           {
               dataField: 'address',
               text: 'Address',
               sort: true,
               sortCaret: (order, column) => {
                   return order === sortOrder ? "↑" : "↓";
               },
           },

           {
               dataField: 'actions',
               text: 'Actions',
               formatter: (cell, row) => (
                   <>
                       <FaEdit style={{ color: "purple" }} className="cursor-pointer mx-2" onClick={() => handleEdit(row.doctor_id)} data-toggle="tooltip" title="Edit" />
                       <FaTrashAlt style={{ color: "red" }} className="cursor-pointer mx-2" onClick={() => handleDeleteDoctor(row.doctor_id)} data-toggle="tooltip" title="Delete" />
                   </>
               ),
           },
       ];

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumbs title="Doctor List" breadcrumbItems={breadcrumbItems} />
                    <Row>
                        <Col xs={12}>
                            <Card>
                            <CardBody>
                                        <div className="d-flex justify-content-between mb-2">
                                            <div className="d-flex align-items-center">
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
                                                    placeholder="Search Doctors"
                                                    value={searchQuery}
                                                    onChange={handleSearchChange}
                                                    className="form-control"
                                                />
                                            </div>
                                        </div>
                                        <div className="table-responsive">
                                            <BootstrapTable
                                                keyField={(row) => row.doctor_id}
                                                data={currentDoctors}
                                                columns={columns}
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
                                            // pagination={paginationFactory({
                                            //   page: currentPage,
                                            //   sizePerPage: doctorsPerPage,
                                            //   totalSize: filteredDoctors.length,
                                            //   onPageChange: this.handlePageChange,
                                            // })}
                                            />
                                        </div>
                                        {renderPagination()}
                                    </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
            {csvLink && (
                <CSVLink
                    data={exportData}
                    filename={"doctors.csv"}
                    className="hidden"
                    ref={(r) => setCsvLink(r)} // Set the ref with the setter function
                    target="_blank"
                />
            )}
           
        </React.Fragment>
    );
};

export default Doctors;  
















































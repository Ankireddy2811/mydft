import React, { Component } from "react";
import { Row, Col, Card, CardBody, Container, CardTitle } from "reactstrap";
import { FaEdit, FaTrashAlt, } from 'react-icons/fa';
import { toast } from 'react-toastify'; // Import toast from react-toastify
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS file for styling
import Breadcrumbs from '../../components/Common/Breadcrumb';
import BootstrapTable from 'react-bootstrap-table-next';
// import paginationFactory from 'react-bootstrap-table2-paginator';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import { CSVLink } from 'react-csv';
import * as XLSX from 'xlsx';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import Swal from 'sweetalert2';
import { drfDeleteDoctor,drfGetDoctorDetails } from "../../drfServer";

class Doctors extends Component {
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
            doctorsPerPage: 10,
            sortOrder: 'asc', // Initial sorting order
            sortField: 'doctor_id', // Initial sorting field
            sortDirection: 'asc', // Initial sorting direction
            sortedColumn: 'doctor_id', // Initial sorted column
            exportData: [], // Initialize with an empty array for export
            exportDropdownOpen: false, // Initialize dropdown state as closed
            client_id: "",
            searchQuery: "", // State for search query
            access_token:"",
        };
    }

    componentDidMount() {
        const access = JSON.parse(localStorage.getItem('access_token'));
        const id = JSON.parse(localStorage.getItem('client_id'));
        if (access) {
          this.setState({ access_token: access });
          console.log("hello" + this.state.access_token);
          this.setState({ client_id: id }, () => {
            this.getAllDoctors();
          });
    }
}

    handleEdit = (doctor_id) => {
        this.props.history.push(`/edit-doctor/${doctor_id}`);
    };

    getAllDoctors = async () => {
        const acces = this.state.access_token;

        try {
            const { client_id, sortOrder } = this.state;
            const headersPart = {
                headers: {
                    "Content-Type": "application/json", // Set the content type to JSON
                    'Authorization': `Bearer ${acces}`,
                },
            }
            /* const response = await axios.post(`/Doctor/details/`, { client_id }, {
                headers: {
                    "Content-Type": "application/json", // Set the content type to JSON
                    'Authorization': `Bearer ${acces}`, 
                },
            }); */

            const response = await drfGetDoctorDetails({client_id},headersPart)

            const data = response.data;

            const sortedData = sortOrder === 'asc'
                ? data.Data.sort((a, b) => a.doctor_id - b.doctor_id)
                : data.Data.sort((a, b) => b.doctor_id - a.doctor_id);

            this.setState({ data: sortedData, loading: false });
        } catch (error) {
            this.setState({ error: 'Error fetching data', loading: false });
        }
    };

    handleDeleteDoctor = async (doctor_id) => {
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
            // Perform the deletion directly without waiting for a response
            this.deleteDoctor(doctor_id, client_id,access_token);
          } 
        } catch (error) {
          console.error('Deletion failed:', error);
          toast.error('Deletion failed');
        }
      };
      
      deleteDoctor = async (doctor_id, client_id,access_token) => {
        const formData = {doctor_id,client_id}
       
        const headersPart = {
            headers: {
                "Content-Type": "application/json", // Set the content type to JSON
                'Authorization': `Bearer ${access_token}`,
            },
        }
        try {
          await drfDeleteDoctor(formData,headersPart);
         
          await this.getAllDoctors();
          toast.success('The doctor has been deleted.');
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
        XLSX.utils.book_append_sheet(wb, ws, 'Doctors');
        XLSX.writeFile(wb, 'doctors.xlsx');
    };

    toggleExportDropdown = () => {
        this.setState((prevState) => ({
            exportDropdownOpen: !prevState.exportDropdownOpen,
        }));
    };

    // Method to handle search input change
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
        const { data, currentPage, doctorsPerPage } = this.state;
        const totalPages = Math.ceil(data.length / doctorsPerPage);

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

    onViewButton = () =>{
     this.props.history.replace("/viewDoctorsList");
    }

    render() 
    {
        const { data, loading, error, currentPage, doctorsPerPage, sortOrder, sortField, sortDirection, searchQuery } = this.state;

        if (data !== null){
            for (let j=0; j < data.length;j++){
                data[j]["doctor_id"] = j+1;
            }
        }

        if (loading) {
            return <div>Loading...</div>;
        }

        if (error) {
            return <div>{error}</div>;
        }

        const indexOfLastDoctor = currentPage * doctorsPerPage;
        const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;

        // Filter the data based on the searchQuery
        const filteredDoctors = data.filter((doctor) => {
            // const firstNameMatch = doctor.first_name.toLowerCase().includes(searchQuery.toLowerCase());
            // const lastNameMatch = doctor.last_name.toLowerCase().includes(searchQuery.toLowerCase());
            const fullName = `${doctor.first_name} ${doctor.last_name}`; // Combine first name and last name
           const fullNameMatch = fullName.toLowerCase().includes(searchQuery.toLowerCase());
            const emailMatch = doctor.email.toLowerCase().includes(searchQuery.toLowerCase());
            const contactNumberMatch = doctor.contact_number.toLowerCase().includes(searchQuery.toLowerCase());
            const departmentMatch = doctor.department.toLowerCase().includes(searchQuery.toLowerCase());
            const specialityMatch = doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase());

            // Return true if at least one condition is met
            return (
                fullNameMatch ||
                emailMatch ||
                contactNumberMatch ||
                departmentMatch ||
                specialityMatch
                // Add more conditions here for additional fields to filter by
            );
        });

        const currentDoctors = filteredDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor);

        const columns = [
            {
                dataField: 'doctor_id',
                text: 'SNO',
                sort: true,
                sortCaret: (order, column) => {
                    return order === this.state.sortOrder ? "↑" : "↓";
                },

            },
            {
                dataField: 'first_name',
                text: 'Doctor Name',
                formatter: (cell, row) => `${cell} ${row.last_name}`,
                sort: true,
                sortCaret: (order, column) => {
                    return order === this.state.sortOrder ? "↑" : "↓";
                },

            },
            {
                dataField: 'email',
                text: 'Email',
                sort: true,
                sortCaret: (order, column) => {
                    return order === this.state.sortOrder ? "↑" : "↓";
                },
            },
            {
                dataField: 'contact_number',
                text: 'Phone',
                sort: true,
                sortCaret: (order, column) => {
                    return order === this.state.sortOrder ? "↑" : "↓";
                },
            },
            {
                dataField: 'qualifications',
                text: 'Qualifications',
                sort: true,
                sortCaret: (order, column) => {
                    return order === this.state.sortOrder ? "↑" : "↓";
                },

            },
            {
                dataField: 'department',
                text: 'Department',
                sort: true,
                sortCaret: (order, column) => {
                    return order === this.state.sortOrder ? "↑" : "↓";
                },
            },
            {
                dataField: 'gender',
                text: 'Gender',
                sort: true,
                sortCaret: (order, column) => {
                    return order === this.state.sortOrder ? "↑" : "↓";
                },
            },
            {
                dataField: 'address',
                text: 'Address',
                sort: true,
                sortCaret: (order, column) => {
                    return order === this.state.sortOrder ? "↑" : "↓";
                },
            },

            {
                dataField: 'actions',
                text: 'Actions',
                formatter: (cell, row) => (
                    <>
                        <FaEdit style={{ color: "purple" }} className="cursor-pointer mx-2" onClick={() => this.handleEdit(row.doctor_id)} data-toggle="tooltip" title="Edit" />
                        <FaTrashAlt style={{ color: "red" }} className="cursor-pointer mx-2" onClick={() => this.handleDeleteDoctor(row.doctor_id)} data-toggle="tooltip" title="Delete" />
                    </>
                ),
            },
        ];



        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid>
                        <Breadcrumbs title="Doctor List" breadcrumbItems={this.state.breadcrumbItems} />
                        <Row>
                            <Col xs={12}>
                                <Card>
                                    <CardBody>
                                        <div className="d-flex justify-content-between mb-2">
                                            <div className="d-flex align-items-center">
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
                                            <button style ={{border:"none",width:"80px",height:"40px",backgroundColor:"blue",color:"#ffffff",borderRadius:"8px"}} onClick={this.onViewButton}>
                                                 VIEW
                                            </button>
                                                
                                            </div>
                                            <div className="d-flex align-items-center">
                                                <input
                                                    type="text"
                                                    placeholder="Search Doctors"
                                                    value={searchQuery}
                                                    onChange={this.handleSearchChange}
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
                                                    return order === this.state.sortOrder ? "↑" : "↓";
                                                }}
                                                onSort={this.handleSort}
                                            // pagination={paginationFactory({
                                            //   page: currentPage,
                                            //   sizePerPage: doctorsPerPage,
                                            //   totalSize: filteredDoctors.length,
                                            //   onPageChange: this.handlePageChange,
                                            // })}
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
                    filename={"doctors.csv"}
                    className="hidden"
                    ref={(r) => (this.csvLink = r)}
                    target="_blank"
                />
            </React.Fragment>
        );
    }
}

export default Doctors; 





/* import React, { useState, useEffect } from "react";
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
        const access = access_token;

        try {
            const { client_id, sortOrder } = ;
            const headersPart = {
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${access}`,
                },
            };

            const response = await drfGetDoctorDetails({ client_id }, headersPart);

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
                deleteDoctor(doctor_id, client_id, access_token);
            }
        } catch (error) {
            console.error('Deletion failed:', error);
            toast.error('Deletion failed');
        }
    };

    const deleteDoctor = async (doctor_id, client_id, access_token) => {
        const formData = { doctor_id, client_id };
        try {
            await drfDeleteDoctor(formData, headersPart);
            await getAllDoctors();
            toast.success('The doctor has been deleted.');
        } catch (error) {
            console.error('Deletion failed:', error);
            toast.error('Deletion failed');
        }
    };

    const prepareExportData = () => {
        const { data } = state;
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
        this.csvLink.link.click();
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

    const renderPagination = () => {
        const { data, currentPage, doctorsPerPage } = state;
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
                                            <button style ={{border:"none",width:"80px",height:"40px",backgroundColor:"blue",color:"#ffffff",borderRadius:"8px"}} onClick={onViewButton}>
                                                 VIEW
                                            </button>
                                                
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
                    <CSVLink
                        data={exportData}
                        filename={"doctors.csv"}
                        className="hidden"
                        ref={(r) => (csvLink = r)}
                        target="_blank"
                    />
                </React.Fragment>
            );
        };
        
        export default Doctors;
        

/* import React, { useState, useEffect } from "react";
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

    useEffect(() => {
        const access = JSON.parse(localStorage.getItem('access_token'));
        const id = JSON.parse(localStorage.getItem('client_id'));
        if (access) {
            setAccessToken(access);
            setClientID(id);
            drfGetDoctorDetails({ client_id }, headersPart)
                .then(response => {
                    const data = response.data;
                    const sortedData = sortOrder === 'asc' ? data.Data.sort((a, b) => a.doctor_id - b.doctor_id) : data.Data.sort((a, b) => b.doctor_id - a.doctor_id);
                    setData(sortedData);
                    setLoading(false);
                })
                .catch(error => {
                    setError('Error fetching data');
                    setLoading(false);
                });
        }
    }, [client_id, access_token, sortOrder]);

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
                deleteDoctor(doctor_id, client_id, access_token);
            }
        } catch (error) {
            console.error('Deletion failed:', error);
            toast.error('Deletion failed');
        }
    };

    const deleteDoctor = async (doctor_id, client_id, access_token) => {
        const formData = { doctor_id, client_id };
        try {
            await drfDeleteDoctor(formData, headersPart);
            await getAllDoctors();
            toast.success('The doctor has been deleted.');
        } catch (error) {
            console.error('Deletion failed:', error);
            toast.error('Deletion failed');
        }
    };

    // Other methods...

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumbs title="Doctor List" breadcrumbItems={breadcrumbItems} />
                    <Row>
                        <Col xs={12}>
                            <Card>
                                <CardBody>
                                    // {Your UI elements }
                                /* </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
            <CSVLink
                data={exportData}
                filename={"doctors.csv"}
                className="hidden"
                ref={(r) => (this.csvLink = r)}
                target="_blank"
            />
        </React.Fragment>
    );
};

export default Doctors; */


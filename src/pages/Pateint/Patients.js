/* import React, { Component } from "react";
import { Row, Col, Card, CardBody, Container } from "reactstrap";
import { FaEdit, FaTrashAlt, FaEllipsisV } from 'react-icons/fa';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import BootstrapTable from 'react-bootstrap-table-next';
import Swal from 'sweetalert2';

import { toast } from 'react-toastify'; // Import toast from react-toastify
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS file for styling
//import paginationFactory from 'react-bootstrap-table2-paginator';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import { CSVLink } from 'react-csv';
import * as XLSX from 'xlsx';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { drfDeletePatient,drfGetPatientDetails } from "../../drfServer";
class Patients extends Component {
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
            patientsPerPage: 10,
            sortOrder: 'asc', // Initial sorting order
            exportData: [], // Initialize with an empty array for export
            exportDropdownOpen: false, // Initialize dropdown state as closed
            client_id:"",
            searchQuery: "", // State for search query
            sortField: 'patient_id', // Initial sorting field
            sortDirection: 'asc', // Initial sorting direction
            sortedColumn: 'patient_id', // Initial sorted column
        };
    }

   
    componentDidMount() {
        const access = JSON.parse(localStorage.getItem('access_token'));
        const id = JSON.parse(localStorage.getItem('client_id'));
        if (access) {
          this.setState({ access_token: access });
         // console.log("hello" + this.state.access_token);
          this.setState({ client_id: id }, () => {
            this.getAllPatients();
          });
}
      }
    handleEdit = (patient_id) => {
        this.props.history.push(`/edit-patient/${patient_id}`);
    };

    getAllPatients = async () => {
        const { client_id, sortOrder } = this.state;
        const acces = this.state.access_token;
        const headersPart = {
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${acces}`,
            }
        }
    
        try {
            const response = await drfGetPatientDetails({client_id}, headersPart);
            const data =  response.data;
            const sortedData = sortOrder === 'asc'
            ? data.Data.sort((a, b) => a.patient_id - b.patient_id)
            : data.Data.sort((a, b) => b.patient_id - a.patient_id);
            this.setState({ data: sortedData, loading: false });
        } catch (error) {
            this.setState({ error: 'Error fetching data', loading: false });
        }
    };
    
    handleDeletePatient = async (patient_id) => {
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
            await this.deletePatient(patient_id, client_id, access_token);
            Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
          }
        } catch (error) {
          console.error('Deletion failed:', error);
          toast.error('Deletion failed');
        }
      };
      
      deletePatient = async (patient_id, client_id, access_token) => {
        const headersPart = {
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${access_token}`,
            }
        }
        try {
          await drfDeletePatient({ patient_id, client_id },headersPart);
          await this.getAllPatients();
        } catch (error) {
          console.error('Deletion failed:', error);
        }
      };
      

    handlePageChange = (newPage) => {
        this.setState({
            currentPage: newPage,
        });
    };

    prepareExportData = () => {
        const { data } = this.state;
        const exportData = data.map((patient) => ({
            'Patient ID': patient.patient_id,
            'Patient Name': `${patient.first_name} ${patient.last_name}`,
            'Email': patient.email,
            'Phone No.': patient.contact_number,
            'Address': patient.address,
            'Gender': patient.gender,
            'D.O.B': patient.date_of_birth,
            'Medical History': patient.medical_history,
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
        XLSX.utils.book_append_sheet(wb, ws, 'Patients');
        XLSX.writeFile(wb, 'patients.xlsx');
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
        const { data, currentPage, patientsPerPage } = this.state;
        const totalPages = Math.ceil(data.length / patientsPerPage);

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
        const { data, loading, error, currentPage, patientsPerPage,sortOrder, sortField, sortDirection, searchQuery  } = this.state;

        /* if (data !== null){
            for (let j=0; j < data.length;j++){
                data[j]["patient_id"] = j+1;
            }
        } 

        if (loading) {
            return <div>Loading...</div>;
        }

        if (error) {
            return <div>{error}</div>;
        }

        const indexOfLastPatient = currentPage * patientsPerPage;
        const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
          // Filter the data based on the searchQuery
          const filteredPatients = data.filter((patient) => {
            // const firstNameMatch = patient.first_name.toLowerCase().includes(searchQuery.toLowerCase());
            // const lastNameMatch = patient.last_name.toLowerCase().includes(searchQuery.toLowerCase());
            const fullName = `${patient.first_name} ${patient.last_name}`; // Combine first name and last name
            const fullNameMatch = fullName.toLowerCase().includes(searchQuery.toLowerCase());
            const emailMatch = patient.email.toLowerCase().includes(searchQuery.toLowerCase());
            const contactNumberMatch = patient.contact_number.toLowerCase().includes(searchQuery.toLowerCase());
            
            // Return true if at least one condition is met
            return (
                fullNameMatch ||
                emailMatch ||
                contactNumberMatch 
                
                // Add more conditions here for additional fields to filter by
            );
        });
        const currentPatients = filteredPatients.slice(indexOfFirstPatient, indexOfLastPatient);


        const columns = [
            { dataField: 'patient_id', text: 'Patient ID', sort: true,sortCaret: (order, column) => {
                return order === this.state.sortOrder ? "↑" : "↓";
            }, },
            { dataField: 'first_name', text: 'Patient Name', formatter: (cell, row) => `${cell} ${row.last_name}`,sort: true,sortCaret: (order, column) => {
                return order === this.state.sortOrder ? "↑" : "↓";
            }, },
            { dataField: 'email', text: 'Email', sort: true,sortCaret: (order, column) => {
                return order === this.state.sortOrder ? "↑" : "↓";
            }, },
            { dataField: 'contact_number', text: 'Phone No.', sort: true,sortCaret: (order, column) => {
                return order === this.state.sortOrder ? "↑" : "↓";
            }, },
            { dataField: 'address', text: 'Address',sort: true,sortCaret: (order, column) => {
                return order === this.state.sortOrder ? "↑" : "↓";
            }, },
            { dataField: 'gender', text: 'Gender' },
            { dataField: 'date_of_birth', text: 'D.O.B',sort: true,sortCaret: (order, column) => {
                return order === this.state.sortOrder ? "↑" : "↓";
            }, },
            { dataField: 'medical_history', text: 'Medical History',sort: true,sortCaret: (order, column) => {
                return order === this.state.sortOrder ? "↑" : "↓";
            }, },
            {
                dataField: 'actions', text: 'Actions', formatter: (cell, row) => (
                    <>
                        <FaEdit style={{ color: "purple" }} className="cursor-pointer mx-2" onClick={() => this.handleEdit(row.patient_id)} />
                        <FaTrashAlt style={{ color: "red" }} className="cursor-pointer mx-2" onClick={() => this.handleDeletePatient(row.patient_id)} />
                    </>
                )
            },
        ];

        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid>
                        <Breadcrumbs title="PATIENTS LIST" breadcrumbItems={this.state.breadcrumbItems} />
                        <Row>
                            <Col xs={12}>
                                <Card>
                                    <CardBody>
                                    <div className="d-flex justify-content-between mb-2">

                                        <div className=" mb-3 mr-3">
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
                                                    placeholder="Search Patients"
                                                    value={searchQuery}
                                                    onChange={this.handleSearchChange}
                                                    className="form-control"
                                                />
                                            </div>
                                        </div>    
                                        <div className="table-responsive">
                                            <BootstrapTable
                                                keyField="patient_id"
                                                data={currentPatients}
                                                columns={columns}
                                                //pagination={paginationFactory()}
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
                    filename={"patients.csv"}
                    className="hidden"
                    ref={(r) => (this.csvLink = r)}
                    target="_blank"
                />
            </React.Fragment>
        );
    }
}

export default Patients; */

import React, { useState, useEffect } from 'react';
import { Row, Col, Card, CardBody, Container } from "reactstrap";
import { FaEdit, FaTrashAlt, FaEllipsisV } from 'react-icons/fa';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import BootstrapTable from 'react-bootstrap-table-next';
import Swal from 'sweetalert2';

import { toast } from 'react-toastify'; // Import toast from react-toastify
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS file for styling
//import paginationFactory from 'react-bootstrap-table2-paginator';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import { CSVLink } from 'react-csv';
import * as XLSX from 'xlsx';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { drfDeletePatient,drfGetPatientDetails } from "../../drfServer";

const Patients = ({ history }) => {
  const [breadcrumbItems] = useState([
    { title: 'Tables', link: '#' },
    { title: 'Responsive Table', link: '#' },
  ]);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [patientsPerPage] = useState(10);
  const [sortOrder] = useState('asc');
  const [exportData, setExportData] = useState([]);
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
  const [client_id, setClientId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [access_token, setAccessToken] = useState("");
  const [sortField, setSortField] = useState('patient_id');
  const [sortDirection, setSortDirection] = useState('asc');
  const [sortedColumn, setSortedColumn] = useState('patient_id');
  const [csvLink, setCsvLink] = useState(null);

  useEffect(() => {
    const access = JSON.parse(localStorage.getItem('access_token'));
    const id = JSON.parse(localStorage.getItem('client_id'));

    if (access) {
      setClientId(id);
      setAccessToken(access);
      getAllPatients();
    }
  }, [client_id, access_token]);

  const getAllPatients = async () => {
   
    try{
        const headersPart = {
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${access_token}`,
            }
        };
        const response = await drfGetPatientDetails({client_id}, headersPart);
        const data =  response.data;
        const sortedData = sortOrder === 'asc'
        ? data.Data.sort((a, b) => a.patient_id - b.patient_id)
        : data.Data.sort((a, b) => b.patient_id - a.patient_id);
        
        setData(sortedData);
        setLoading(false);
    }

    catch (error) {
        setError('Error fetching data');
        setLoading(false);
        
    }
  };

   const handleDeletePatient = async (patient_id) => {
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
        await this.deletePatient(patient_id, client_id, access_token);
        Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
      }
    } catch (error) {
      console.error('Deletion failed:', error);
      toast.error('Deletion failed');
    }
   };
  
  const deletePatient = async (patient_id, client_id, access_token) => {
    const requestFormData = { patient_id, client_id }
    const headersPart = {
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${access_token}`,
        }
    }
    try {
      await drfDeletePatient(requestFormData,headersPart);
      await getAllPatients();
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
   
    const exportData = data.map((patient) => ({
        'Patient ID': patient.patient_id,
        'Patient Name': `${patient.first_name} ${patient.last_name}`,
        'Email': patient.email,
        'Phone No.': patient.contact_number,
        'Address': patient.address,
        'Gender': patient.gender,
        'D.O.B': patient.date_of_birth,
        'Medical History': patient.medical_history,
    }));
    return exportData;
};

 const handleCSVExport = () => {
    const exportData = prepareExportData();
    setExportData(exportData)
        // Trigger CSV download
    csvLink.link.click(); 
};

 const handleExcelExport = () => {
    const exportData = prepareExportData();
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Patients');
    XLSX.writeFile(wb, 'patients.xlsx');
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

    const totalPages = Math.ceil(data.length / patientsPerPage);

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

   const indexOfLastPatient = currentPage * patientsPerPage;
   const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  // Filter the data based on the searchQuery
   const filteredPatients = data ?data.filter((patient) => {
    // const firstNameMatch = patient.first_name.toLowerCase().includes(searchQuery.toLowerCase());
    // const lastNameMatch = patient.last_name.toLowerCase().includes(searchQuery.toLowerCase());
    const fullName = `${patient.first_name} ${patient.last_name}`; // Combine first name and last name
    const fullNameMatch = fullName.toLowerCase().includes(searchQuery.toLowerCase());
    const emailMatch = patient.email.toLowerCase().includes(searchQuery.toLowerCase());
    const contactNumberMatch = patient.contact_number.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Return true if at least one condition is met
    return (
        fullNameMatch ||
        emailMatch ||
        contactNumberMatch 
        
        // Add more conditions here for additional fields to filter by
    );
}):[];
   const currentPatients = filteredPatients.slice(indexOfFirstPatient, indexOfLastPatient);


const columns = [
    { dataField: 'patient_id', text: 'Patient ID', sort: true,sortCaret: (order, column) => {
        return order === sortOrder ? "↑" : "↓";
    }, },
    { dataField: 'first_name', text: 'Patient Name', formatter: (cell, row) => `${cell} ${row.last_name}`,sort: true,sortCaret: (order, column) => {
        return order === sortOrder ? "↑" : "↓";
    }, },
    { dataField: 'email', text: 'Email', sort: true,sortCaret: (order, column) => {
        return order === sortOrder ? "↑" : "↓";
    }, },
    { dataField: 'contact_number', text: 'Phone No.', sort: true,sortCaret: (order, column) => {
        return order === sortOrder ? "↑" : "↓";
    }, },
    { dataField: 'address', text: 'Address',sort: true,sortCaret: (order, column) => {
        return order === sortOrder ? "↑" : "↓";
    }, },
    { dataField: 'gender', text: 'Gender' },
    { dataField: 'date_of_birth', text: 'D.O.B',sort: true,sortCaret: (order, column) => {
        return order === sortOrder ? "↑" : "↓";
    }, },
    { dataField: 'medical_history', text: 'Medical History',sort: true,sortCaret: (order, column) => {
        return order === sortOrder ? "↑" : "↓";
    }, },
    {
        dataField: 'actions', text: 'Actions', formatter: (cell, row) => (
            <>
                <FaEdit style={{ color: "purple" }} className="cursor-pointer mx-2" onClick={() => handleEdit(row.patient_id)} />
                <FaTrashAlt style={{ color: "red" }} className="cursor-pointer mx-2" onClick={() => handleDeletePatient(row.patient_id)} />
            </>
        )
    },
];



 
  const handleEdit = (patient_id) => {
    history.push(`/edit-patient/${patient_id}`);
  };

 

  return (
    <React.Fragment>
    <div className="page-content">
        <Container fluid>
            <Breadcrumbs title="PATIENTS LIST" breadcrumbItems={breadcrumbItems} />
            <Row>
                <Col xs={12}>
                    <Card>
                        <CardBody>
                        <div className="d-flex justify-content-between mb-2">

                            <div className=" mb-3 mr-3">
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
                                        placeholder="Search Patients"
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        className="form-control"
                                    />
                                </div>
                            </div>    
                            <div className="table-responsive">
                                <BootstrapTable
                                    keyField="patient_id"
                                    data={currentPatients}
                                    columns={columns}
                                    //pagination={paginationFactory()}
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
    {csvLink && (
    <CSVLink
        data={exportData}
        filename={"patients.csv"}
        className="hidden"
        ref={(r) => setCsvLink(r)} // Set the ref with the setter function
        target="_blank"
     />
    )}
    
</React.Fragment>
  );
};

export default Patients;


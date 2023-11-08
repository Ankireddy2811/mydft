import React, {useEffect,useState} from "react";
import BootstrapTable from 'react-bootstrap-table-next';
import { toast } from 'react-toastify'; // Import toast from react-toastify
// import axios from 'axios';
import Swal from 'sweetalert2'; // Import sweetalert2
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS file for styling//import paginationFactory from 'react-bootstrap-table2-paginator';
import { Row, Col, Card, CardBody, Container } from "reactstrap";
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import Breadcrumbs from '../../components/Common/Breadcrumb';
//import { Tooltip as ReactTooltip } from 'react-tooltip';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import { CSVLink } from 'react-csv';
import * as XLSX from 'xlsx';
import ReactTooltip from 'react-tooltip';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { withRouter } from 'react-router-dom';
import { drfGetHospitalDetails,drfDeleteDoctor, drfDeleteHospital} from "../../drfServer";

const Hospitals = ({ history }) => {
    const [breadcrumbItems] = useState([
        { title: "Tables", link: "#" },
        { title: "Responsive Table", link: "#" },
    ]);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [access_token, setAccessToken] = useState("");
   
    const [currentPage, setCurrentPage] = useState(1);
    const [hospitalsPerPage] = useState(10);
    const [sortOrder, setSortOrder] = useState('asc');
    const [sortField, setSortField] = useState('client_id');
    const [sortDirection, setSortDirection] = useState('asc');
   
    const [exportData, setExportData] = useState([]);
    const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [csvLink, setCsvLink] = useState(null);
   

    useEffect(() => {
        const access = JSON.parse(localStorage.getItem('access_token'));
        if (access) {
            setAccessToken(access);
            getAllHospitals();
        }
    }, []);

    const getAllHospitals = async () => {
        const acces = access_token;

        const options = {
            headers: {
                'Authorization': `Bearer ${acces}`
            }
        };

        try {
            const response = await drfGetHospitalDetails(options);

            if (response.status !== 200) {
                throw new Error("Network response was not ok.");
            }

            const responseData = await response.data;
            const sortedData = sortOrder === 'asc'
                ? responseData.sort((a, b) => a.client_id - b.client_id)
                : responseData.sort((a, b) => b.client_id - a.client_id);

            setData(sortedData);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setError('Error fetching data');
            setLoading(false);
        }
    };

    const handleEdit = (client_id) => {
        history.push(`/edit-hospital/${client_id}`);
    };

   
    // Define the deleteHospital function separately
   const deleteHospital = async (client_id, access_token) => {
    
     const headersPart = {
        headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${access_token}`,
      },
    }

    const response = await drfDeleteHospital(client_id,headersPart);
    getAllHospitals();
  };
  
  // Now, the handleDeleteHospital function
  const handleDeleteHospital = async (client_id) => {
    
    try {
      const result = await Swal.fire({
        title: 'Delete Hospital',
        text: "Are you sure you want to delete this hospital? You won't be able to revert this action!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel',
        reverseButtons: true,
      });
  
      if (result.isConfirmed) {
        await deleteHospital(client_id, access_token);
        Swal.fire('Deleted!', 'The hospital has been deleted.', 'success');
      }
    } catch (error) {
      console.error('Deletion failed:', error);
      Swal.fire('Error', 'Deletion failed', 'error');
    }
  };
  
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };


    const prepareExportData = () => {
     
        const exportData = data.map((hospital) => ({
            'Client ID': hospital.client_id,
            'Hospital Name': hospital.hospital_name,
            'Name': hospital.name,
            'Owner Name':hospital.owner_name,
            'Email': hospital.email,
            'Phone No.': hospital.phone,
            'User Type': hospital.user_type,
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
        XLSX.utils.book_append_sheet(wb, ws, 'Hospitals');
        XLSX.writeFile(wb, 'hospital.xlsx');
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
       
        if (!data){
            return null;
        }
        const totalPages = data?Math.ceil(data.length / hospitalsPerPage):0;

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

    const indexOfLastHospital = currentPage * hospitalsPerPage;
    const indexOfFirstHospital = indexOfLastHospital - hospitalsPerPage;
    const filteredHospitals = data?data.filter((hospital) => {
        const hospitalNameMatch = hospital.hospital_name.toLowerCase().includes(searchQuery.toLowerCase());
        const ownerName = hospital.owner_name.toLowerCase().includes(searchQuery.toLowerCase());
        const emailMatch = hospital.email.toLowerCase().includes(searchQuery.toLowerCase());
        const phoneMatch = hospital.phone.toLowerCase().includes(searchQuery.toLowerCase());
       

        // Return true if at least one condition is met
        return (
            hospitalNameMatch ||
            ownerName ||
            emailMatch ||
            phoneMatch
            // Add more conditions here for additional fields to filter by
        );
    }):[];

    const currentHospitals = filteredHospitals.slice(indexOfFirstHospital, indexOfLastHospital);

    const columns = [
        {
            dataField: 'client_id',
            text: 'Hospital Id',
            sort: true, // Enable sorting
            sortCaret: (order, column) => {
                return order === sortOrder ? "↑" : "↓";
            },
        },
        {
            dataField: 'hospital_name',
            text: 'Hospital Name',
            sort: true, // Enable sorting
            sortCaret: (order, column) => {
                return order === sortOrder ? "↑" : "↓";
            },
        },
        {
            dataField: 'owner_name',
            text: 'Owner Name',
            sort: true, // Enable sorting
            sortCaret: (order, column) => {
                return order === sortOrder ? "↑" : "↓";
            },
        },
        {
            dataField: 'email',
            text: 'Email ID',
            sort: true, // Enable sorting
            sortCaret: (order, column) => {
                return order === sortOrder ? "↑" : "↓";
            },
        },
        {
            dataField: 'phone',
            text: 'Phone No.',
            sort: true, // Enable sorting
            sortCaret: (order, column) => {
                return order === sortOrder ? "↑" : "↓";
            },
        },
      
        {
            dataField: 'city',
            text: 'City',
            sort: true, // Enable sorting
            sortCaret: (order, column) => {
                return order === sortOrder ? "↑" : "↓";
            },
        },
        {
            dataField: 'address',
            text: 'Address',
            sort: true, // Enable sorting
            sortCaret: (order, column) => {
                return order === sortOrder ? "↑" : "↓";
            },
        },
        {
            dataField: 'actions',
            text: 'Actions',
            formatter: (cellContent, row) => (
                <>
                    <FaEdit
                        style={{ color: "purple" }}
                        className="cursor-pointer mx-2"
                        onClick={() => handleEdit(row.client_id)}
                    />
                    <FaTrashAlt
                        style={{ color: "red" }}
                        className="cursor-pointer mx-2"
                        onClick={() => handleDeleteHospital(row.client_id)}
                    />
                </>
            ),
        },
    ];


  
        
      

        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid>
                        <Breadcrumbs title="HOSPITALS LIST" breadcrumbItems={breadcrumbItems} />
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
                                                    placeholder="Search Hospitals"
                                                    value={searchQuery}
                                                    onChange={handleSearchChange}
                                                    className="form-control"
                                                />
                                            </div>
                                        </div>
                                        <div className="table-responsive">
                                           <BootstrapTable
                                            keyField={(row)=>row.client_id}
                                            data={currentHospitals}
                                            columns={columns}
                                            defaultSorted={[
                                                {
                                                    dataField: sortField,
                                                    order: sortDirection,
                                                },
                                            ]}
                                            // pagination={paginationFactory()}
                                            // filter={filterFactory()}
                                            striped
                                            sort={true}
                                                sortCaret={(order, column) => {
                                                    return order === sortOrder ? "↑" : "↓";
                                                }}
                                                onSort={handleSort}
                                        >
                                            
                                        </BootstrapTable>
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
    }


export default withRouter(Hospitals);

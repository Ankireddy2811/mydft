import React, { useState,useEffect } from "react";
import { Row, Col, Card, CardBody, Container } from "reactstrap";
import { FaEdit, FaTrashAlt} from 'react-icons/fa';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import BootstrapTable from 'react-bootstrap-table-next';
import { toast } from 'react-toastify';
// import axios from 'axios';
import Swal from "sweetalert2";
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS file for styling
import paginationFactory from 'react-bootstrap-table2-paginator';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import { CSVLink } from 'react-csv';
import * as XLSX from 'xlsx';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { drfGetBedDetails,drfDeleteBed } from "../../drfServer";

const Beds = (props)=>{
    const [breadcrumbItems] = useState([
        { title: "Tables", link: "#" },
        { title: "Responsive Table", link: "#" },
    ]);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [bedsPerPage] = useState(10);
    const [exportData, setExportData] = useState([]);
    const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
    const [client_id, setClientId] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortField, setSortField] = useState('invoice_id');
    const [sortDirection, setSortDirection] = useState('asc');
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [sortOrder, setSortOrder] = useState('asc');
    const [access_token, setAccessToken] = useState("");
    const [csvLink, setCsvLink] = useState(null);
    

   
    useEffect(() => {
        const access = JSON.parse(localStorage.getItem('access_token'));
        const id = JSON.parse(localStorage.getItem('client_id'));
        if (access) {
            setAccessToken(access);
            setClientId(id);
            getAllBeds(id, access)
        }
    }, []);

    const togglePopover = () => {
        setPopoverOpen(!popoverOpen);
    };


    const handleEdit = (bed_id, department_id) => {
        props.history.replace(`/edit-bed/${bed_id}/${department_id}`);
    };

    
    const getAllBeds = async (client_id,access) => {
        try {
            const headersPart = {
                headers : {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access}`
                  }
            }
            const response = await drfGetBedDetails({ client_id },headersPart);

            const data = response.data.Data;
            setData(data);
            setLoading(false);
            
        } catch (error) {
            setError('Error fetching data-yfks-utm');
            setLoading(false);
            
        }
    }
        
    
    const handleDeleteBed = async (bed_id, department_id) => {
      
        try {
          const result = await Swal.fire({
            title: 'Are you sure?',
            text: "Delete this bed?\nYou won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
            reverseButtons: true,
          });
      
          if (result.isConfirmed) {
            await deleteBed(bed_id, department_id, client_id, access_token);
            Swal.fire('Deleted!', 'Your file has been deleted.', 'success');

          }
        } catch (error) {
          console.error('Deletion failed:', error);
          toast.error('Deletion failed');
        }
      };
      
      const deleteBed = async (bed_id, department_id, client_id, access_token) => {
        const headersPart = {
            headers : {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
              }
        }
        const requestFormData = {
            client_id, department_id, bed_id
        }
        try {
        
        await drfDeleteBed(requestFormData,headersPart);
        await getAllBeds(client_id,access_token);
        toast.success("The bed has been deleted.");
        

        } catch (error) {
          console.error('Deletion failed:', error);
          toast.error('Deletion failed');
        }
      };
      
   
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
      };

    const prepareExportData = () => {
       
        const exportData = data.map((bed) => ({
            'Bed ID': bed.bed_id,
            'Bed Number': bed.bed_number,
            'Department ID': bed.department_id,
            'Occupied': bed.is_occupied,
            'Created At': bed.created_at,
            'Updated At': bed.updated_at,
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
        XLSX.utils.book_append_sheet(wb, ws, 'Beds');
        XLSX.writeFile(wb, 'beds.xlsx');
    };

    const toggleExportDropdown = () => {
        setExportDropdownOpen(!exportDropdownOpen);
    };


    const renderPagination = () => {
       
        if(!data){
         return null;
        }

        const totalPages = Math.ceil(data.length / bedsPerPage);

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

   
        const indexOfLastBed = currentPage * bedsPerPage;
        const indexOfFirstBed = indexOfLastBed - bedsPerPage;
        const currentBed = data?.slice(indexOfFirstBed, indexOfLastBed) ||[];

        const columns = [
            { dataField: 'bed_id', text: 'Bed ID', sort: true },
            { dataField: 'bed_number', text: 'Bed Number', sort: true },
            { dataField: 'department_id', text: 'Department ID', sort: true },
            { dataField: 'is_occupied', text: 'Occupied' },
            { dataField: 'created_at', text: 'Created At', sort: true },
            { dataField: 'updated_at', text: 'Updated At', sort: true },
            {
                dataField: 'actions', text: 'Actions', formatter: (cell, row) => (
                    <>
                        <FaEdit style={{ color: "purple" }} className="cursor-pointer mx-2" onClick={() => handleEdit(row.bed_id, row.department_id)} />
                        <FaTrashAlt style={{ color: "red" }} className="cursor-pointer mx-2" onClick={() => handleDeleteBed(row.bed_id, row.department_id)} />
                    </>
                )
            },
        ];

        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid>
                        <Breadcrumbs title="BEDS LIST" breadcrumbItems={breadcrumbItems} />
                        <Row>
                            <Col xs={12}>
                                <Card>
                                    <CardBody>
                                        <div className="d-flex justify-content-between align-items-center mb-3">
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
                                        <div className="table-responsive">
                                            <BootstrapTable
                                                keyField="bed_id"
                                                data={currentBed}
                                                columns={columns}
                                                pagination={paginationFactory()}
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
                    filename={"beds.csv"}
                    className="hidden"
                    ref={(r) => setCsvLink(r)} // Set the ref with the setter function
                    target="_blank"
                />
            </React.Fragment>
        );
    }


export default Beds;

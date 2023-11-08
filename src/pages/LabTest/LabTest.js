import React, {useState,useEffect } from "react";
import { Row, Col, Card, CardBody, Container } from "reactstrap";
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import Swal from "sweetalert2";
import { toast } from 'react-toastify'; // Import toast from react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS file for styling
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import { CSVLink } from 'react-csv';
import * as XLSX from 'xlsx';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { drfDeleteLabTest,drfGetLabTestDetails } from "../../drfServer";

const LabTest = ({history})=>{

    const [breadcrumbItems] = useState([
        { title: "Tables", link: "#" },
        { title: "Responsive Table", link: "#" },
    ]);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [labPerPage] = useState(10);
    const [exportData, setExportData] = useState([]);
    const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
    const [client_id, setClientId] = useState("");
    const [sortOrder] = useState('asc');
   
    const [access_token, setAccessToken] = useState("");
    const [csvLink, setCsvLink] = useState(null);


    useEffect(()=>{
        const access = JSON.parse(localStorage.getItem('access_token'));
        const id = JSON.parse(localStorage.getItem('client_id'));
        if(id){
            setAccessToken(access);
            setClientId(id);
            getAllLabTest(id,access);
            
        }

    },[]); 
      
       
    const handleEdit = (lab_test_id) => {
        history.replace(`/edit-lab-test/${lab_test_id}`);
    };

    
    const getAllLabTest = async (client_id,access_token) => {
        
        const headersPart = {
            headers: {
                "Content-Type": "application/json", // Set the content type to JSON,
                'Authorization': `Bearer ${access_token}`,
  
              }
        }

        try {
         
          const response = await drfGetLabTestDetails({ client_id }, headersPart);
          const data = response.data;

          const sortedData = sortOrder === 'asc'
                ? data.sort((a, b) => a.lab_test_id - b.lab_test_id)
                : data.sort((a, b) => b.lab_test_id - a.lab_test_id);

          setData(sortedData);
          setLoading(false);
      
         
        } catch (error) {
            setError('Error fetching data');
            setLoading(false);
        }
      };

      const handleDeleteLabTest = async (lab_test_id) => {
       
        try {
          const result = await Swal.fire({
            title: 'Are you sure?',
            text: "Delete this lab test?\nYou won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
            reverseButtons: true,
          });
      
          if (result.isConfirmed) {
            await deleteLabTest(lab_test_id, client_id, access_token);
            Swal.fire('Deleted!', 'Your file has been deleted.', 'success');

          } 
        } catch (error) {
          console.error('Deletion failed:', error);
          toast.error('Deletion failed');
        }
      };
      
    const deleteLabTest = async (lab_test_id, client_id, access_token) => {
        const formData = {lab_test_id, client_id}
        const headersPart = {
            headers: {
              "Content-Type": "application/json",
              'Authorization': `Bearer ${access_token}`,
            },
          }
        try {
          await drfDeleteLabTest(formData,headersPart);
          await getAllLabTest();
          toast.success('The Invoice has been deleted.');

        } catch (error) {
          console.error('Deletion failed:', error);
          toast.error('Deletion failed');
        }
      };
      

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
      };


    const prepareExportData = () => {
        
        const exportData = data.map((lab) => ({
            'Lab Test ID': lab.lab_test_id,
            'Patient ID': lab.patient_id,
            'Doctor ID': lab.doctor_id,
            'Test Name': lab.test_name,
            'Test Date': lab.test_date,
            'Results': lab.results,
            'Created At': lab.created_at,
            'Updated At': lab.updated_at,
        }));
        return exportData;
    };

   


    const handleCSVExport = () => {
        const exportData = prepareExportData();
        setExportData(exportData);
        // Trigger CSV download
        csvLink.link.click();
    };

    const handleExcelExport = () => {
        const exportData = prepareExportData();
        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'LabTests');
        XLSX.writeFile(wb, 'lab_tests.xlsx');
    };

    
    const toggleExportDropdown = () => {
        setExportDropdownOpen(!exportDropdownOpen);
    };

    
    

    const renderPagination = () => {
        
        if (!data){
            return null;
        }

        const totalPages = Math.ceil(data.length / labPerPage);

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



    const indexOfLastLab = currentPage * labPerPage;
    const indexOfFirstLab = indexOfLastLab - labPerPage;
    const currentLab = data?.slice(indexOfFirstLab, indexOfLastLab) || [];

    const columns = [
        { dataField: 'lab_test_id', text: 'Lab Test ID', sort: true },
        { dataField: 'patient_id', text: 'Patient ID' },
        { dataField: 'doctor_id', text: 'Doctor ID' },
        { dataField: 'test_name', text: 'Test Name' },
        { dataField: 'test_date', text: 'Test Date' },
        { dataField: 'results', text: 'Results' },
        { dataField: 'created_at', text: 'Created At' },
        { dataField: 'updated_at', text: 'Updated At' },
        {
            dataField: 'actions', text: 'Actions', formatter: (cell, row) => (
                <>
                    <FaEdit style={{ color: "purple" }} className="cursor-pointer mx-2" onClick={() => handleEdit(row.lab_test_id)} />
                    <FaTrashAlt style={{ color: "red" }} className="cursor-pointer mx-2" onClick={() => handleDeleteLabTest(row.lab_test_id)} />
                </>
            )
        },
    ];

   

        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid>
                        <Breadcrumbs title="LAB TEST LIST" breadcrumbItems={breadcrumbItems} />
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
                                                keyField="lab_test_id"
                                                data={currentLab}
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
                    filename={"lab_tests.csv"}
                    className="hidden"
                    ref={(r) => setCsvLink(r)} // Set the ref with the setter function
                    target="_blank"
                />
            </React.Fragment>
        );
    }


export default LabTest;

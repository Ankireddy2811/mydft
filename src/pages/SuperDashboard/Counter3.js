import React, { useState,useEffect } from 'react';
import { Col, Card, CardBody } from 'reactstrap';
import {drfGetHospitalDetails} from "../../drfServer"
//import { setSubmitFailed } from 'redux-form';

const Counter3 = ()=>{
 
    const [state,setState] = useState({
      hospitalList: [],
      client_id: '',
      access_token: '',
      isLoading: true, // Add a loading state
    });
  

  useEffect(()=>{

    const fetchData = async()=>{
    const access = JSON.parse(localStorage.getItem('access_token'));
    setState(prevState=>({...prevState,access_token:access}));
    const headersPart = {
       headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access}`,
    }
  }
    try {
      const hospitalResponse = await drfGetHospitalDetails(headersPart);

      if (hospitalResponse.ok) {
        const hospitalData = await hospitalResponse.data;
        setState(prevState=>({ ...prevState,hospitalList: hospitalData, isLoading: false })); // Update isLoading and hospitalList
      }
    
    } catch (error) {
      console.error('Error fetching hospital data:', error);
      setState(prevState=>({ ...prevState,isLoading: false }));  // set isLoading to false in case of an error
    }
    }
  fetchData();

  },[]);
  
   
   


 
    const { hospitalList, isLoading } = state;
    const hospitalCount = hospitalList.length;

    const reports = [
      { title: 'Total Hospitals', icon: 'mdi mdi-hospital', rate: '20%' },
    ];

    return (
      <React.Fragment>
        {isLoading ? ( // Show a loading message while data is being fetched
          <div>Loading...</div>
        ) : (
          reports.map((report, index) => (
            <Col md={4} key={index}>
              <Card>
                <CardBody>
                  <div className="d-flex">
                    <div className="flex-1 overflow-hidden">
                      <p className="text-truncate font-size-14 mb-2">{report.title}</p>
                      <h4 className="mb-0">{hospitalCount}</h4>
                    </div>
                    <div className="text-primary">
                      <i className={report.icon + ' font-size-24'}></i>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          ))
        )}
      </React.Fragment>
    );
  }



export default Counter3;

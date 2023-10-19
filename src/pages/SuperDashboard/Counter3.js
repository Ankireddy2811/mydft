import React, { Component } from 'react';
import { Col, Card, CardBody } from 'reactstrap';

class Counter3 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hospitalList: [],
      client_id: '',
      access_token: '',
      isLoading: true, // Add a loading state
    };
  }

  async componentDidMount() {
    const access = JSON.parse(localStorage.getItem('access_token'));

    if (access) {
      this.setState({ access_token: access });
    }

    try {
      const hospitalResponse = await fetch('/Hospital/list/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access}`,
        },
      });

      if (hospitalResponse.ok) {
        const hospitalData = await hospitalResponse.json();
        this.setState({ hospitalList: hospitalData, isLoading: false }); // Update isLoading and hospitalList
      }
    } catch (error) {
      console.error('Error fetching hospital data:', error);
      this.setState({ isLoading: false }); // Set isLoading to false in case of an error
    }
  }

  render() {
    const { hospitalList, isLoading } = this.state;
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
}


export default Counter3;

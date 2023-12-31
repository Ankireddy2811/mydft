/* import React, { Component } from "react";
import { Row, Col, Card, CardBody, Container } from "reactstrap";
import { withRouter } from "react-router-dom";
import Breadcrumbs from '../../components/Common/Breadcrumb';
import BootstrapTable from 'react-bootstrap-table-next';

class FeedBack extends Component {
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
            client_id: "",
            access_token: "",
        };
    }

    componentDidMount() {
        const access = JSON.parse(localStorage.getItem('access_token'));
        const id = JSON.parse(localStorage.getItem('client_id'));
        if (access) {
            this.setState({ access_token: access, client_id: id }, () => {
                this.getFeedbacks();
            });
        }
    }

    getFeedbacks = async () => {
        const { access_token, client_id } = this.state;

        try {
            const response = await fetch(`/Feedback/list/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${access_token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Network response was not ok.");
            }

            const data = await response.json();
            console.log("Response data:", data);

            this.setState({ data, loading: false });
        } catch (error) {
            this.setState({ error: 'Error fetching data', loading: false });
        }
    };

    render() {
        const { data, loading, error } = this.state;

        if (loading) {
            return <div>Loading...</div>;
        }

        if (error) {
            return <div>{error}</div>;
        }

        const columns = [
            {
                dataField: 'id',
                text: 'SNo',
                formatter: (cell, row, rowIndex) => rowIndex + 1,
                headerStyle: { width: '5%' },
            },
            { dataField: 'email', text: 'Email', sort: true },
            { dataField: 'notes', text: 'Notes' },
        ];

        return (
            <React.Fragment>
                <Container fluid>
                    <h5 className="mb-4">Client Feedbacks</h5>
                    <Row>
                        <Col>
                            <Card>
                                <CardBody>
                                    <div className="table-responsive">
                                        <BootstrapTable
                                            keyField="id"
                                            data={data}
                                            columns={columns}
                                            bootstrap4
                                            bordered={false}
                                            striped
                                            hover
                                            condensed
                                            wrapperClasses="table-responsive"
                                            classes="table table-nowrap table-hover"
                                        />
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </React.Fragment>
        );
    }
}
export default withRouter(FeedBack); */


import React, { useState, useEffect } from 'react';
import { Row, Col, Card, CardBody, Container } from 'reactstrap';
import { withRouter } from 'react-router-dom';
//import Breadcrumbs from '../../components/Common/Breadcrumb';
import BootstrapTable from 'react-bootstrap-table-next';
import {drfGetFeedback} from "../../drfServer"

const FeedBack = (props)=>{
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [client_id, setClientId] = useState('');
  const [access_token, setAccessToken] = useState('');

  useEffect(() => {
    const access = JSON.parse(localStorage.getItem('access_token'));
    const id = JSON.parse(localStorage.getItem('client_id'));

    if (access) {
      setAccessToken(access);
      setClientId(id);
      getFeedbacks(access);
    }
  }, [client_id,access_token]);

  const getFeedbacks = async (access_token) => {
    const headersPart = {
        headers: {
            'Content-Type': 'application/json',
             'Authorization': `Bearer ${access_token}`,
        },
    }
    try {
      const response = await drfGetFeedback(headersPart);

      if (!response.status === 200) {
        throw new Error('Network response was not ok.');
      }

      const responseData = await response.data;
      setData(responseData);
      setLoading(false);
    } catch (err) {
      setError('Error fetching data');
      setLoading(false);
    }
  };

  const columns = [
    {
      dataField: 'id',
      text: 'SNo',
      formatter: (cell, row, rowIndex) => rowIndex + 1,
      headerStyle: { width: '5%' },
    },
    { dataField: 'email', text: 'Email', sort: true },
    { dataField: 'notes', text: 'Notes' },
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <React.Fragment>
      <Container fluid>
        <h5 className="mb-4">Client Feedbacks</h5>
        <Row>
          <Col>
            <Card>
              <CardBody>
                <div className="table-responsive">
                  <BootstrapTable
                    keyField="id"
                    data={data}
                    columns={columns}
                    bootstrap4
                    bordered={false}
                    striped
                    hover
                    condensed
                    wrapperClasses="table-responsive"
                    classes="table table-nowrap table-hover"
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  );
}

export default withRouter(FeedBack);






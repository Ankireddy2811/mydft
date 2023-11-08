import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { drfUpdateHospital,drfGetHospitalListById} from '../../drfServer';

import 'react-toastify/dist/ReactToastify.css';
import {Row,Col,Card,CardBody,Button,Label,Input,Container,Form} from 'reactstrap';

const HProfile = () => {
  const [formData, setFormData] = useState({
    data: [], // Store fetched data here
    client_id: '',
    access_token: '',
    patientSuggestions: [], // Store patient suggestions from the API
    isEditMode: false, // Track edit mode
    editedData: {}, // Store edited data here
    hospital_name: '',
    owner_name: '',
    phone: '',
    email: '',
    password: '',
    address: '',
    city: '',
    profile_image: null,
    profile: '',
  });

  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const fetchDataFromAPI = async () => {
    const access = JSON.parse(localStorage.getItem('access_token'));
    const id = JSON.parse(localStorage.getItem('client_id'));
    if (access) {
      setFormData((prevState) => ({ ...prevState, access_token: access, client_id: id }));
      const headersPart = {
        headers: {
            Authorization: `Bearer ${access}`,
          },
      }
      try {
        const response = await drfGetHospitalListById(id,headersPart);
        console.log(response)
        const data = response.data;
        console.log(data);
        setFormData((prevState) => ({
          ...prevState,
          owner_name: data.owner_name,
          hospital_name: data.hospital_name,
          phone: data.phone,
          email: data.email,
          address: data.address,
          city: data.city,
          password: data.password,
          profile_image: data.profile_image,
        }));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  };

  useEffect(() => {
    fetchDataFromAPI();
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setFormData((prevState) => ({ ...prevState, profile: file }), () => {
      handleSubmit(e);
    });
  };

  const openImageUploadDialog = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = handleImageUpload;
    input.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { client_id, access_token, hospital_name, owner_name, phone, email, address, city, password, profile } = formData;
    const requestFormData = new FormData();
    requestFormData.append('hospital_name', hospital_name);
    requestFormData.append('owner_name', owner_name);
    requestFormData.append('phone', phone);
    requestFormData.append('email', email);
    requestFormData.append('password', password);
    requestFormData.append('address', address);
    requestFormData.append('city', city);

    if (profile) {
      requestFormData.append('profile_image', profile);
    }

    const headersPart = {
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'multipart/form-data',
      },
    };

    try {
      const response = await drfUpdateHospital(client_id, requestFormData, headersPart);
      if (response.status === 200) {
        toast.success('Profile updated successfully');
        fetchDataFromAPI();
      } else {
        toast.error('Something went wrong');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Something went wrong');
    }
  };

  const { owner_name, hospital_name, phone, email, address, city, profile_image } = formData;
  const defaultProfileImage = 'https://th.bing.com/th/id/OIP.1LRUIB2OXVePxD5hQm4fqwHaHa?pid=ImgDet&rs=1';

  return (
    <React.Fragment>
      <div className="page-content">
        <Container>
          <Row>
            <Col>
              <Card className="col-lg-4 col-md-8 col-sm-12 mx-auto">
                <CardBody>
                  <div className="text-center mb-3">
                    <img
                      src={profile_image ? profile_image : defaultProfileImage}
                      alt="Profile Image"
                      className="img-fluid rounded-circle"
                      style={{ width: '130px', height: '130px', boxShadow: '0px 2px 4px black' }}
                    />
                    <h5 className="mt-2" style={{ textShadow: '2px 2px 4px rgba(0.8, 0.8, 0.8, 0.2)' }}>
                      Profile Image
                    </h5>
                  </div>
                  <Row>
                    <Col md="12">
                      <div className="text-center">
                        <Button color="primary" onClick={openImageUploadDialog}>
                          Change Your Avatar
                        </Button>
                      </div>
                    </Col>
                  </Row>
                  <Form className="needs-validation" method="post" id="tooltipForm" onSubmit={handleSubmit}>
                    <Row>
                      <Col md="12">
                        <div className="mb-3 position-relative">
                          <Label className="form-label" htmlFor="validationTooltip01">
                            Hospital Name
                          </Label>
                          <Input
                            type="text"
                            className="form-control"
                            id="validationTooltip01"
                            value={hospital_name}
                            name="hospital_name"
                            placeholder="Hospital Name"
                            onChange={handleChange}
                            required
                          />
                          <div className="valid-tooltip">Looks good!</div>
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="12">
                        <div className="mb-3 position-relative">
                          <Label className="form-label" htmlFor="validationTooltip01">
                            Owner Name
                          </Label>
                          <Input
                            type="text"
                            className="form-control"
                            id="validationTooltip01"
                            value={owner_name}
                            name="owner_name"
                            placeholder="Owner Name"
                            onChange={handleChange}
                            required
                          />
                          <div className="valid-tooltip">Looks good!</div>
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="12">
                        <div className="mb-3 position-relative">
                          <Label className="form-label" htmlFor="validationTooltip02">
                            Phone Number
                          </Label>
                          <Input
                            type="text"
                            className="form-control"
                            id="validationTooltip02"
                            value={phone}
                            name="phone"
                            placeholder="Phone Number"
                            onChange={handleChange}
                            required
                          />
                          <div className="valid-tooltip">Looks good!</div>
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="6">
                        <div className="mb-3 position-relative">
                          <Label className="form-label" htmlFor="validationTooltip02">
                            Email
                          </Label>
                          <Input
                            type="text"
                            className="form-control"
                            id="validationTooltip02"
                            value={email}
                            name="email"
                            placeholder="Email"
                            onChange={handleChange}
                            required
                          />
                          <div className="valid-tooltip">Looks good!</div>
                        </div>
                      </Col>

                      <Col md="6">
                        <div className="mb-3 position-relative">
                          <Label className="form-label" htmlFor="validationTooltip04">
                            City
                          </Label>
                          <Input
                            type="text"
                            className="form-control"
                            id="validationTooltip04"
                            value={city}
                            name="city"
                            placeholder="City"
                            onChange={handleChange}
                            required
                          />
                          <div className="valid-tooltip">Looks good!</div>
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="12">
                        <div className="mb-3 position-relative">
                          <Label className="form-label" htmlFor="validationTooltip04">
                            Address
                          </Label>
                          <Input
                            type="text"
                            className="form-control"
                            id="validationTooltip04"
                            value={address}
                            name="address"
                            placeholder="Address"
                            onChange={handleChange}
                            required
                          />
                          <div className="valid-tooltip">Looks good!</div>
                        </div>
                      </Col>
                    </Row>
                    <Col md="12" className="text-center">
                      <Button color="primary" type="submit">
                        Update Profile
                      </Button>
                    </Col>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default HProfile;

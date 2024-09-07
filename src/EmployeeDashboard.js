import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import './EmployeeDashboard.css';

const EmployeeDashboard = () => {
  const [formData, setFormData] = useState({
    userId: '',
    firstName: '',
    lastName: '',
    departmentId: '',
    projectId: '',
    reasonForTravel: '',
    fromDate: '',
    toDate: '',
    fromLocation: '',
    toLocation: '',
    travelRequestId: null,
  });

  const [projects, setProjects] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [travelRequests, setTravelRequests] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    axios.get('https://localhost:7075/api/Project')
      .then(response => setProjects(response.data))
      .catch(error => console.error('Error fetching projects:', error));

    axios.get('https://localhost:7075/api/Department')
      .then(response => setDepartments(response.data))
      .catch(error => console.error('Error fetching departments:', error));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userid;

      setFormData(prevState => ({
        ...prevState,
        userId: userId,
        firstName: decodedToken.firstname,
        lastName: decodedToken.lastname,
        departmentId: decodedToken.departmentid
      }));

      axios.get(`https://localhost:7075/api/TravelRequest/user/${userId}`)
        .then(response => setTravelRequests(response.data))
        .catch(error => console.error('Error fetching travel requests:', error));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prevState => {
      const newFormData = { ...prevState, [name]: value };

      const fromDate = new Date(newFormData.fromDate);
      const toDate = new Date(newFormData.toDate);
      const currentDate = new Date();

      if (name === "fromDate" && fromDate <= currentDate) {
        alert("From Date must be greater than the current date.");
        newFormData.fromDate = ""; 
      }

      if (name === "toDate" && toDate <= fromDate) {
        alert("To Date must be greater than From Date.");
        newFormData.toDate = ""; 
      }

      return newFormData;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const requestData = {
      userId: formData.userId,
      projectId: formData.projectId,
      departmentId: formData.departmentId,
      reasonForTravel: formData.reasonForTravel,
      fromDate: formData.fromDate,
      toDate: formData.toDate,
      fromLocation: formData.fromLocation,
      toLocation: formData.toLocation
    };

    if (isEditing) {
      axios.put(`https://localhost:7075/api/TravelRequest/${formData.travelRequestId}`, requestData)
        .then(response => {
          alert('Travel Request updated successfully!');
          setShowForm(false);
          setIsEditing(false);
          refetchTravelRequests();
        })
        .catch(error => {
          console.error('Error updating travel request!', error);
        });
    } else {
      axios.post('https://localhost:7075/api/TravelRequest', requestData)
        .then(response => {
          alert('Travel Request submitted successfully!');
          setShowForm(false);
          refetchTravelRequests();
        })
        .catch(error => {
          console.error('There was an error submitting the travel request!', error);
        });
    }
  };

  const refetchTravelRequests = () => {
    axios.get(`https://localhost:7075/api/TravelRequest/user/${formData.userId}`)
      .then(response => setTravelRequests(response.data))
      .catch(error => console.error('Error fetching travel requests:', error));
  };

  const handleEdit = (request) => {
    setFormData({
      userId: formData.userId,
      firstName: formData.firstName,
      lastName: formData.lastName,
      departmentId: formData.departmentId,
      projectId: request.projectId,
      reasonForTravel: request.reasonForTravel,
      fromDate: new Date(request.fromDate).toISOString().substring(0, 10),
      toDate: new Date(request.toDate).toISOString().substring(0, 10),
      fromLocation: request.fromLocation,
      toLocation: request.toLocation,
      travelRequestId: request.travelRequestId
    });
    setIsEditing(true);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setIsEditing(false);
  };

  return (
    <div className="container">
      {!showForm && (
        <button className="button" onClick={() => setShowForm(true)}>
          {isEditing ? "Edit Travel Request" : "Create New Travel Request"}
        </button>
      )}

      {showForm && (
        <div className="form-container">
          <h2 className="title">{isEditing ? "Edit Travel Request" : "Travel Request Form"}</h2>
          <form className="form" onSubmit={handleSubmit}>
            <label>
              User ID:
              <input
                type="number"
                name="userId"
                value={formData.userId}
                readOnly
                className="input"
              />
            </label>

            <label>
              First Name:
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                readOnly
                className="input"
              />
            </label>

            <label>
              Last Name:
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                readOnly
                className="input"
              />
            </label>

            <label>
              Department:
              <select
                name="departmentId"
                value={formData.departmentId}
                readOnly
                disabled
                className="select"
              >
                <option value="">Select a department</option>
                {departments.map(department => (
                  <option key={department.departmentId} value={department.departmentId}>
                    {department.departmentName}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Project:
              <select
                name="projectId"
                value={formData.projectId}
                onChange={handleChange}
                required
                className="select"
              >
                <option value="">Select a project</option>
                {projects.map(project => (
                  <option key={project.projectId} value={project.projectId}>
                    {project.projectName}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Reason for Travel:
              <textarea
                name="reasonForTravel"
                value={formData.reasonForTravel}
                onChange={handleChange}
                required
                className="textarea"
              />
            </label>

            <label>
              From Date:
              <input
                type="date"
                name="fromDate"
                value={formData.fromDate}
                onChange={handleChange}
                required
                className="input"
              />
            </label>

            <label>
              To Date:
              <input
                type="date"
                name="toDate"
                value={formData.toDate}
                onChange={handleChange}
                required
                className="input"
              />
            </label>

            <label>
              From Location:
              <input
                type="text"
                name="fromLocation"
                value={formData.fromLocation}
                onChange={handleChange}
                required
                className="input"
              />
            </label>

            <label>
              To Location:
              <input
                type="text"
                name="toLocation"
                value={formData.toLocation}
                onChange={handleChange}
                required
                className="input"
              />
            </label>

            <button type="submit" className="button">
              {isEditing ? "Update Request" : "Submit Request"}
            </button>
            <button type="button" onClick={handleCloseForm} className="close-button">
              Close
            </button>
          </form>
        </div>
      )}

      <div className="history-container">
        <h2>Travel Request History</h2>
        {travelRequests.map(request => (
          <div className="history-item" key={request.travelRequestId}>
            <p>Travel Request ID: {request.travelRequestId}</p>
            <p>Reason for Travel: {request.reasonForTravel}</p>
            <p>From Date: {new Date(request.fromDate).toLocaleDateString()}</p>
            <p>To Date: {new Date(request.toDate).toLocaleDateString()}</p>
            <p>From Location: {request.fromLocation}</p>
            <p>To Location: {request.toLocation}</p>
            <button className="button" onClick={() => handleEdit(request)}>Edit</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeDashboard;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

// UserForm Component
const UserForm = ({ user, handleInputChange, buttonText, onSubmit, onClose, roles, departments, managers }) => (
  <form
    className="user-form"
    onSubmit={(e) => {
      e.preventDefault();
      onSubmit();
    }}
  >
    <input
      type="email"
      value={user.email || ''}
      onChange={(e) => handleInputChange(e, 'email')}
      placeholder="Email"
      required
    />
    <input
      type="text"
      value={user.firstName || ''}
      onChange={(e) => handleInputChange(e, 'firstName')}
      placeholder="First Name"
      required
    />
    <input
      type="text"
      value={user.lastName || ''}
      onChange={(e) => handleInputChange(e, 'lastName')}
      placeholder="Last Name"
    />
    <input
      type="text"
      value={user.address || ''}
      onChange={(e) => handleInputChange(e, 'address')}
      placeholder="Address"
    />
    <input
      type="password"
      value={user.password || ''}
      onChange={(e) => handleInputChange(e, 'password')}
      placeholder="Password"
    />
    <input
      type="tel"
      value={user.mobileNum || ''}
      onChange={(e) => handleInputChange(e, 'mobileNum')}
      placeholder="Mobile Number"
      required
    />
    <select
      value={user.departmentId || ''}
      onChange={(e) => handleInputChange(e, 'departmentId')}
    >
      <option value="">Select Department</option>
      {departments.map(dept => (
        <option key={dept.departmentId} value={dept.departmentId}>
          {dept.departmentName}
        </option>
      ))}
    </select>
    <select
      value={user.roleId || ''}
      onChange={(e) => handleInputChange(e, 'roleId')}
    >
      <option value="">Select Role</option>
      {roles.map(role => (
        <option key={role.roleId} value={role.roleId}>
          {role.roleName}
        </option>
      ))}
    </select>
    {user.roleId !== 'Manager' && (
      <select
        value={user.managerId || ''}
        onChange={(e) => handleInputChange(e, 'managerId')}
      >
        <option value="">Select Manager</option>
        {managers.map(manager => (
          <option key={manager.userId} value={manager.userId}>
            {manager.firstName} {manager.lastName}
          </option>
        ))}
      </select>
    )}
    <button type="submit" className="submit-button">{buttonText}</button>
    {onClose && (
      <button type="button" className="close-button" onClick={onClose}>
        Close
      </button>
    )}
  </form>
);
<br></br> 



// UserTable Component
const UserTable = ({ users, deleteUser, editUser }) => (
  <table className="user-table">
    <thead>
      <tr>
        <th>User ID</th>
        <th>Email</th>
        <th>First Name</th>
        <th>Last Name</th>
        <th>Department</th>
        <th>Manager Name</th>
        <th>Role</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {users.map(user => (
        <tr key={user.userId}>
          <td>{user.userId}</td>
          <td>{user.email}</td>
          <td>{user.firstName}</td>
          <td>{user.lastName}</td>
          <td>{user.department?.departmentName || 'N/A'}</td>
          <td>{user.manager ? `${user.manager.firstName} ${user.manager.lastName}` : 'N/A'}</td>
          <td>{user.role?.roleName || 'N/A'}</td>
          <td>
            <div className="button-container">
             <td> <button className="edit-button" onClick={() => editUser(user)}>Edit</button>
              <button className="delete-button" onClick={() => deleteUser(user.userId)}>Delete</button></td>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);


function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [managers, setManagers] = useState([]);
  const [newUser, setNewUser] = useState({ email: '', roleId: '', firstName: '', lastName: '', departmentId: '', managerId: '', address: '', mobileNum: '', password: '' });
  const [editMode, setEditMode] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, rolesResponse, departmentsResponse, managersResponse] = await Promise.all([
          axios.get('https://localhost:7075/api/User/users'),
          axios.get('https://localhost:7075/api/Role'),
          axios.get('https://localhost:7075/api/Department'),
          axios.get('https://localhost:7075/api/User/managers')
        ]);
        setUsers(usersResponse.data.reverse());
        setRoles(rolesResponse.data);
        setDepartments(departmentsResponse.data);
        setManagers(managersResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setMessage('Failed to fetch data.');
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e, field) => {
    setNewUser(prev => ({ ...prev, [field]: e.target.value }));
  };

  const addUser = async () => {
    if (!newUser.email || !newUser.roleId) {
      setMessage('Please fill in all required fields.');
      return;
    }

    try {
      const response = await axios.post('https://localhost:7075/api/User/users', newUser);
      const addedUser = response.data;
      setUsers(prevUsers => [addedUser, ...prevUsers]);
      setNewUser({ email: '', roleId: '', firstName: '', lastName: '', departmentId: '', managerId: '', address: '', mobileNum: '', password: '' });
      setShowAddForm(false);  // Hide form after adding user
      setMessage('User added successfully.');
      window.location.reload();
    } catch (error) {
      console.error('Error adding user:', error.response?.data || error.message);
      setMessage('Failed to add user. Please try again.');
    }
  };

  const deleteUser = async (userId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`https://localhost:7075/api/User/users/${userId}`);
      setUsers(users.filter(user => user.userId !== userId));
      setMessage('User deleted successfully.');
    } catch (error) {
      console.error('Error deleting user:', error);
      setMessage('Failed to delete user. Please try again.');
    }
  };

  const editUser = (user) => {
    setNewUser(user);
    setEditMode(true);
    setShowAddForm(true);
  };

  const updateUser = async () => {
    if (!newUser.email || !newUser.roleId || !newUser.departmentId || !newUser.address || !newUser.mobileNum || !newUser.password) {
      setMessage('Please fill in all required fields.');
      return;
    }

    const payload = {
      userId: newUser.userId,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      roleId: newUser.roleId,
      departmentId: newUser.departmentId,
      managerId: newUser.managerId || null,
      address: newUser.address,
      mobileNum: newUser.mobileNum,
      password: newUser.password,
    };

    try {
      await axios.put(`https://localhost:7075/api/User/users/${newUser.userId}`, payload);
      setUsers((prevUsers) => prevUsers.map(user => user.userId === newUser.userId ? newUser : user));
      setNewUser({ email: '', roleId: '', firstName: '', lastName: '', departmentId: '', managerId: '', address: '', mobileNum: '', password: '' });
      setShowAddForm(false);
      setEditMode(false);
      setMessage('User updated successfully.');
    } catch (error) {
      console.error('Error updating user:', error);
      setMessage('Failed to update user. Please try again.');
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="message">{message}</div>
      
      {/* Show the "Add User" button only when the form is not visible */}
      {!showAddForm && (
        <div className="add-user-button">
          <button onClick={() => setShowAddForm(true)}>Add User</button> <br></br> <br></br>
        </div>
      )}
      
      {/* Render the form when showAddForm is true */}
      {showAddForm && (
        <UserForm
          user={newUser}
          handleInputChange={handleInputChange}
          buttonText={editMode ? "Update User" : "Add User"}
          onSubmit={editMode ? updateUser : addUser}
          onClose={() => setShowAddForm(false)}  // Hide the form when closed
          roles={roles}
          departments={departments}
          managers={managers}
        />
      )}

      <UserTable users={users} deleteUser={deleteUser} editUser={editUser} />
    </div>
  );
}

export default AdminDashboard;

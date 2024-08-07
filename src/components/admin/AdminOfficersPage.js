import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './AdminNavbar';

const AdminOfficersPage = () => {
  const [officers, setOfficers] = useState([]);
  const [newOfficer, setNewOfficer] = useState({ name: '', post: '', email: '' });
  const [editingOfficer, setEditingOfficer] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchOfficers = async () => {
    try {
      const response = await axios.get('/api/admin/officers');
      setOfficers(response.data.officers);
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
  };

  useEffect(() => {
    fetchOfficers();
  }, []);

  const handleAddOfficer = async () => {
    try {
      await axios.post('/api/admin/addOfficer', newOfficer);
      fetchOfficers();
      setNewOfficer({ name: '', post: '', email: '',number: '',});
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
  };

  const handleUpdateOfficer = async () => {
    try {
      await axios.put(`/api/admin/updateOfficer/${editingOfficer._id}`, editingOfficer);
      fetchOfficers();
      setEditingOfficer(null);
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
  };

  const handleDeleteOfficer = async (officerId) => {
    try {
      await axios.delete(`/api/admin/deleteOfficer/${officerId}`);
      fetchOfficers();
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
  };

  return (
    <div className="admin-officers-page">
      <Navbar/>
      <div>
        &nbsp;
        <h3>Add New Officer</h3>
        <label>
          Name:
          <input
            type="text"
            value={newOfficer.name}
            onChange={(e) => setNewOfficer({ ...newOfficer, name: e.target.value })}
          />
        </label>
        <label>
          Post:
          <input
            type="text"
            value={newOfficer.post}
            onChange={(e) => setNewOfficer({ ...newOfficer, post: e.target.value })}
          />
        </label>
        <label>
          Number:
          <input
            type="text"
            value={newOfficer.number}
            onChange={(e) => setNewOfficer({ ...newOfficer, number: e.target.value })}
          />
        </label>
        <label>
          Email:
          <input
            type="text"
            value={newOfficer.email}
            onChange={(e) => setNewOfficer({ ...newOfficer, email: e.target.value })}
          />
        </label>
        <button onClick={handleAddOfficer}>Add Officer</button>
      </div>
        &nbsp;
      <div>
        &nbsp;
        <h3>Officers List</h3>
        <ul>
          {officers.map((officer) => (
            <li key={officer._id}>
              {editingOfficer && editingOfficer._id === officer._id ? (
                <>
                  <input
                    type="text"
                    value={editingOfficer.name}
                    onChange={(e) =>
                      setEditingOfficer({ ...editingOfficer, name: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    value={editingOfficer.post}
                    onChange={(e) =>
                      setEditingOfficer({ ...editingOfficer, post: e.target.value })
                    }
                  />
                   <input
                    type="text"
                    value={editingOfficer.number}
                    onChange={(e) =>
                      setEditingOfficer({ ...editingOfficer, number: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    value={editingOfficer.email}
                    onChange={(e) =>
                      setEditingOfficer({ ...editingOfficer, email: e.target.value })
                    }
                  />
                  <button onClick={handleUpdateOfficer}>Update</button>
                </>
              ) : (
                <>
                  {officer.name} - {officer.post} - {officer.email}-{officer.number}
                  <button onClick={() => setEditingOfficer(officer)}>Edit</button>
                  <button onClick={() => handleDeleteOfficer(officer._id)}>Delete</button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>

      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
};

export default AdminOfficersPage;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import Axios
import * as Iconsio5 from 'react-icons/io5';
import * as icontb from 'react-icons/tb';

const AddDivisionTask = () => {
  const navigate = useNavigate();
  const [divisions, setDivisions] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    divisionIds: [],
  });

  useEffect(() => {
    axios
      .get('http://127.0.0.1:8000/api/v1/divisions') // Fetch divisions
      .then(response => {
        if (response.data && response.data.length > 0) {
          setDivisions(response.data); // Update state with fetched divisions
        }
      })
      .catch(error => {
        console.error('Error fetching division data:', error);
      });
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(f => ({ ...f, [name]: value }));
  };

  const handleDivisionSelect = (divId) => {
    setFormData(prev => ({
      ...prev,
      divisionIds: prev.divisionIds.includes(divId) 
        ? [] // Deselect if already selected
        : [divId] // Select only the clicked division
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (formData.divisionIds.length === 0) {
      alert("Please select at least one division.");
      return;  // Prevent further submission if no division is selected
    }

    const fileInput = document.getElementById('file');
    const file = fileInput.files[0]; // Get the file selected

    const payload = new FormData();
    payload.append('task_name', formData.title); 
    payload.append('description', formData.description);
    payload.append('due_date', formData.startDate); 
    payload.append('fin_date', formData.endDate);
    payload.append('division_id', formData.divisionIds[0]); // Assuming only one division selected
    payload.append('document_path', file); // Append the document file

    axios
      .post('http://127.0.0.1:8000/api/v1/tasks', payload)  // Use Axios for POST request
      .then(response => {
        navigate('/app');
        alert('Task created successfully:');
      })
      .catch(error => {
        console.error('Error creating task:', error);
        alert("Failed to create task. Please check the server logs.");
      });
  };

  return (
    <div className="add-task-container">
      <div className="page-header">
        <h1>
          <icontb.TbListDetails className="header-icon" />
          Add Task for Division
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-section">
          <h2>Task Details</h2>
          <div className="form-group">
            <label>Title*</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter task title"
            />
          </div>
          <div className="form-group">
            <label>Description*</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              placeholder="Describe the task in detail"
            />
          </div>
        </div>
        
        <div className="form-section">
          <h2>Division Assignment</h2>
          <div className="form-group">
            <label>Select Division(s)*</label>
            <div className="division-selector">
              {divisions.map((div) => (
                <div
                  key={div.division_id}
                  className={`division-tag ${
                    formData.divisionIds.includes(div.division_id) ? 'selected' : ''
                  }`}
                  onClick={() => handleDivisionSelect(div.division_id)}
                >
                  {div.division_nom}
                  {formData.divisionIds.includes(div.division_id) && (
                    <>
                      <Iconsio5.IoCheckmark className="check-icon" />
                      <span className="responsable-badge">
                        {div.division_responsable}
                      </span>
                    </>
                  )}
                </div>
              ))}
            </div>
            {/* Validation Error Message */}
            
          </div>
        </div>

        <div className="form-section">
          <h2>Task Timeline</h2>
          <div className="form-row">
            <div className="form-group">
              <label>Start Date*</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="form-group">
              <label>End Date*</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
                min={formData.startDate || new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
        </div>

        <div className='docs form-group'>
          <label>Documentation*</label>
          <input type="file" id="file" name="file" accept=".pdf,.doc,.docx,.txt" required/>
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={() => navigate('/Taches')}>
            Cancel
          </button>
          <button type="submit" className="submit-btn">
            <Iconsio5.IoSaveOutline className="btn-icon" />
            Save Task
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddDivisionTask;

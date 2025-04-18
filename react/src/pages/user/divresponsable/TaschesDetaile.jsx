import React, { useState } from 'react';
import './TachesDetaile.css';
import { Link } from 'react-router-dom';

export default function TaschesDetaile() {
  const [selectedTask, setSelectedTask] = useState(null);

  // Sample data
  const tasks = [
    {
      id: 1,
      name: 'Campaign Design',
      currentStatus: 'In Progress',
      finishDate: '2023-12-01',
      dueDate: '2023-12-15',
      description: 'Design marketing campaign materials',
      priority: 'High'
    },
    {
      id: 2,
      name: 'Market Research',
      currentStatus: 'Completed',
      finishDate: '2023-11-25',
      dueDate: '2023-11-30',
      description: 'Conduct competitor analysis and customer surveys',
      priority: 'Medium'
    },
    {
      id: 3,
      name: 'Client Presentation',
      currentStatus: 'Pending',
      finishDate: null,
      dueDate: '2023-12-10',
      description: 'Prepare quarterly review presentation',
      priority: 'Urgent'
    }
  ];

  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="table-container">
      <table className="task-table">
        <thead>
          <tr>
            <th>Task Name</th>
            <th>Current Status</th>
            <th>Finish Date</th>
            <th>Due Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td>{task.name}</td>
              <td>
                <span className={`status-badge status-${task.currentStatus.toLowerCase().replace(' ', '-')}`}>
                  {task.currentStatus}
                </span>
              </td>
              <td className="date-cell">
                {task.finishDate ? new Date(task.finishDate).toLocaleDateString() : '-'}
              </td>
              <td className="date-cell">
                {new Date(task.dueDate).toLocaleDateString()}
              </td>
              <td>
                <button 
                  className="action-btn btn-details"
                  onClick={() => setSelectedTask(task)}
                >
                  Show Details
                </button>
                <button className="action-btn btn-history">
                  <Link to={`/app/History/${task.id}`}>Show History</Link>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Task Details Modal */}
      {selectedTask && (
        <div className="modal-backdrop" onClick={() => setSelectedTask(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedTask.name}</h2>
              <button className="close-button" onClick={() => setSelectedTask(null)}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-row">
                <span className="detail-label">Status:</span>
                <span className={`status-badge status-${selectedTask.currentStatus.toLowerCase().replace(' ', '-')}`}>
                  {selectedTask.currentStatus}
                </span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">Priority:</span>
                <span className="priority-value">{selectedTask.priority}</span>
              </div>

              <div className="detail-row">
                <span className="detail-label">Due Date:</span>
                <span className="date-value">
                  {new Date(selectedTask.dueDate).toLocaleDateString()}
                </span>
              </div>

              <div className="detail-row">
                <span className="detail-label">Finish Date:</span>
                <span className="date-value">
                  {selectedTask.finishDate 
                    ? new Date(selectedTask.finishDate).toLocaleDateString()
                    : 'Not completed'}
                </span>
              </div>

              <div className="detail-row ">
                <span className="detail-label">Description:</span>
                <p className="task-description">
                  {selectedTask.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
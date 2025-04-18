import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './stylesres/TachesDetaile.css';

export default function TaschesDetaile({ user }) {
  const [selectedTask, setSelectedTask] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = 'http://127.0.0.1:8000/api/v1';

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const [tasksRes, statusesRes] = await Promise.all([
          axios.get(`${apiUrl}/tasks`),
          axios.get(`${apiUrl}/statuses`)
        ]);

        // Process tasks with their latest status
        const tasksWithStatus = tasksRes.data
          .filter(task => task.division_id === user.division_id)
          .map(task => {
            // Find all statuses for this task and get the most recent one
            const taskStatuses = statusesRes.data
              .filter(status => status.task_id === task.task_id)
              .sort((a, b) => new Date(b.date_changed) - new Date(a.date_changed));
            
            const latestStatus = taskStatuses.length > 0 
              ? taskStatuses[0].statut 
              : 'Not Started'; // Default status if none exists

            return {
              ...task,
              status: latestStatus,
              statusHistory: taskStatuses // Store all status history for the task
            };
          });

        setTasks(tasksWithStatus);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTasks();
  }, [user.division_id]);

  const getStatusColor = (status) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    switch(status.toLowerCase()) {
      case 'completed':
      case 'terminé': 
        return 'bg-green-100 text-green-800';
      case 'in progress':
      case 'en cours': 
        return 'bg-blue-100 text-blue-800';
      case 'pending':
      case 'en attente': 
        return 'bg-yellow-100 text-yellow-800';
      default: 
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div className="loading">Loading tasks...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="table-container">
      <table className="task-table">
        <thead>
          <tr>
            <th>Task Name</th>
            <th>Status</th>
            <th>Finish Date</th>
            <th>Due Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.task_id}>
              <td>{task.task_name}</td>
              <td>
                <span className={`status-badge ${getStatusColor(task.status)}`}>
                  {task.status}
                </span>
              </td>
              <td className="date-cell">
                {task.fin_date ? new Date(task.fin_date).toLocaleDateString() : '-'}
              </td>
              <td className="date-cell">
                {new Date(task.due_date).toLocaleDateString()}
              </td>
              <td>
                <button 
                  className="action-btn btn-details"
                  onClick={() => setSelectedTask(task)}
                >
                  Show Details
                </button>
                <button className="action-btn btn-history">
                  <Link to={`/app/History/${task.task_id}`}>Show History</Link>
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
              <h2>{selectedTask.task_name}</h2>
              <button className="close-button" onClick={() => setSelectedTask(null)}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-row">
                <span className="detail-label">Status:</span>
                <span className={`status-badge ${getStatusColor(selectedTask.status)}`}>
                  {selectedTask.status}
                </span>
              </div>

              <div className="detail-row">
                <span className="detail-label">Due Date:</span>
                <span className="date-value">
                  {new Date(selectedTask.due_date).toLocaleDateString()}
                </span>
              </div>

              <div className="detail-row">
                <span className="detail-label">Finish Date:</span>
                <span className="date-value">
                  {selectedTask.fin_date 
                    ? new Date(selectedTask.fin_date).toLocaleDateString()
                    : 'Not completed'}
                </span>
              </div>

              <div className="detail-row">
                <span className="detail-label">Description:</span>
                <p className="task-description">
                  {selectedTask.description}
                </p>
              </div>

              {/* Status History Section */}
              <div className="detail-row">
                <span className="detail-label">Status History:</span>
                <div className="status-history">
                  {selectedTask.statusHistory?.map((status, index) => (
                    <div key={index} className="status-history-item">
                      <span className={`status-badge ${getStatusColor(status.statut)}`}>
                        {status.statut}
                      </span>
                      <span className="status-date">
                        {new Date(status.date_changed).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
import { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { formatDistanceToNow } from 'date-fns';
import './stylesres/dachboarespage.css';

const apiUrl = 'http://127.0.0.1:8000/api/v1';

const DashboardPage = ({user}) => {
  const [divisionData, setDivisionData] = useState({});
  const [tasks, setTasks] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [history, setHistory] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch division data (example for division ID 1)
        const divisionRes = await axios.get(`${apiUrl}/divisions/${user.division_id}`);
        setDivisionData(divisionRes.data);

        // Fetch all tasks and filter by division
        const tasksRes = await axios.get(`${apiUrl}/tasks`);
        const divisionTasks = tasksRes.data.filter(task => task.division_id === user.division_id);
        setTasks(divisionTasks);

        // Fetch related data
        const [statusesRes, documentsRes] = await Promise.all([
          axios.get(`${apiUrl}/statuses`),
          axios.get(`${apiUrl}/documentpaths`)
        ]);

        // Process statuses
        const taskIds = divisionTasks.map(task => task.task_id);
        const filteredStatuses = statusesRes.data.filter(status => 
          taskIds.includes(status.task_id)
        );

        // Calculate status counts
        const tasksWithLatestStatus = divisionTasks.map(task => {
          const taskStatuses = filteredStatuses
            .filter(s => s.task_id === task.task_id)
            .sort((a, b) => new Date(b.date_changed) - new Date(a.date_changed));
          return {
            ...task,
            latestStatus: taskStatuses[0]?.statut || 'En attente'
          };
        });

        const statusCounts = tasksWithLatestStatus.reduce((acc, task) => {
          acc[task.latestStatus] = (acc[task.latestStatus] || 0) + 1;
          return acc;
        }, {});

        setStatuses(Object.entries(statusCounts).map(([statut, count]) => ({
          statut,
          count
        })));

        // Process documents
        const filteredDocuments = documentsRes.data.filter(doc => 
          taskIds.includes(doc.task_id)
        );
        setDocuments(filteredDocuments);

        // Create history timeline
        const taskIdToName = divisionTasks.reduce((acc, task) => {
          acc[task.task_id] = task.task_name;
          return acc;
        }, {});

        const statusHistory = filteredStatuses.map(status => ({
          hist_id: status.status_id,
          description: `Task "${taskIdToName[status.task_id]}" status updated to ${status.statut}`,
          change_date: status.date_changed,
          task_id: status.task_id
        }));

        const documentHistory = filteredDocuments.map(doc => ({
          hist_id: doc.document_id,
          description: `Document "${doc.document_path.split('/').pop()}" uploaded`,
          change_date: doc.upload_date,
          task_id: doc.task_id
        }));

        setHistory([...statusHistory, ...documentHistory]
          .sort((a, b) => new Date(b.change_date) - new Date(a.change_date)));

      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const COLORS = ['lightblue', 'green', 'red'];

  if (loading) return <div className="loading-indicator">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="dashboardContainer">
      <div className="dashboardHeader">
        <div className="headerTop">
          <div>
            <h1 className="dashboardTitle">Division Dashboard</h1>
            <p className="dashboardSubtitle">
              Welcome, {divisionData.division_responsable} ({divisionData.division_nom})
            </p>
          </div>
        </div>
      </div>

      <div className="statsGrid">
        <div className="statCard">
          <p className="statLabel">Total Tasks</p>
          <h2 className="statValue">{tasks.length}</h2>
        </div>

        <div className="statCard">
          <p className="statLabel">In Progress</p>
          <h2 className="statValueYellow">
            {statuses.find(s => s.statut === 'En cours')?.count || 0}
          </h2>
        </div>

        <div className="statCard">
          <p className="statLabel">Completed</p>
          <h2 className="statValueGreen">
            {statuses.find(s => s.statut === 'Terminé')?.count || 0}
          </h2>
        </div>

        <div className="statCard">
          <p className="statLabel">Documents</p>
          <h2 className="statValueBlue">{documents.length}</h2>
        </div>
      </div>

      <div className="mainContent">
        <div className="chartCard">
          <h3 className="sectionTitle">Task Distribution</h3>
          <div className="chartContainer">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statuses}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={1}
                  dataKey="count"
                >
                  {statuses.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="activityCard">
          <h3 className="sectionTitle">Recent Activity</h3>
          <ul className="activityList">
            {history.map(activity => (
              <li key={activity.hist_id} className="activityItem">
                <div className="activityContent">
                  <p className="activityDescription">{activity.description}</p>
                  <time className="activityTime">
                    {formatDistanceToNow(new Date(activity.change_date))} ago
                  </time>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
          
      <div className="documentsCard">
        <h3 className="sectionTitle">Recent Documents</h3>
        <div className="documentGrid">
          {documents.map(document => (
            <div key={document.document_id} className="documentItem">
              <span className="documentIcon">📄</span>
              <div>
                <p className="documentName">{document.document_path.split('/').pop()}</p>
                <p className="documentUploadTime">
                  Uploaded {formatDistanceToNow(new Date(document.upload_date))} ago
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
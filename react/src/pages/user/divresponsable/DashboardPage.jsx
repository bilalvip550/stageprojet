import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { formatDistanceToNow } from 'date-fns';
import './dachboarespage.css'
const DashboardPage = () => {
  const [divisionData, setDivisionData] = useState({
    division_nom: 'Marketing',
    division_responsable: 'John Doe'
  });

  const [tasks, setTasks] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [history, setHistory] = useState([]);
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setTasks([
        { task_id: 1, task_name: 'Campaign Design', due_date: '2023-12-01' },
        { task_id: 2, task_name: 'Market Research', due_date: '2023-11-25' }
      ]);

      setStatuses([
        { statut: 'En cours', count: 5 },
        { statut: 'Terminé', count: 3 },
        { statut: 'En attente', count: 2 }
      ]);

      setHistory([
        {
          hist_id: 1,
          description: 'Document "market_research.pdf" uploaded',
          change_date: '2023-11-20T14:30:00',
          task_id: 2
        },
        {
          hist_id: 2,
          description: 'Task "Campaign Design" status updated',
          change_date: '2023-11-20T10:15:00',
          task_id: 1
        }
      ]);

      setDocuments([
        { document_id: 1, document_path: '/docs/market_research.pdf' },
        { document_id: 2, document_path: '/docs/campaign_brief.docx' }
      ]);
    };

    fetchData();
  }, []);

  const COLORS = ['lightblue', 'green', 'red'];

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
                  Uploaded {formatDistanceToNow(new Date())} ago
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
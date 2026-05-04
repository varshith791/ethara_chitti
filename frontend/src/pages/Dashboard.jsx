import { useEffect, useState } from 'react';
import SummaryCard from '../components/SummaryCard';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/dashboard');
        setStats(response.data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Dashboard</h1>
          <p className="mt-2 text-slate-600">{user?.role} overview of tasks and projects.</p>
        </div>
      </div>

      {error && <div className="rounded-3xl bg-rose-50 p-4 text-rose-700">{error}</div>}

      <div className="grid gap-4 md:grid-cols-4">
        <SummaryCard title="Total Tasks" value={stats?.totalTasks ?? '--'} accent="" />
        <SummaryCard title="Completed" value={stats?.completedTasks ?? '--'} accent="" />
        <SummaryCard title="Pending" value={stats?.pendingTasks ?? '--'} accent="" />
        <SummaryCard title="Overdue" value={stats?.overdueTasks ?? '--'} accent="" />
      </div>

      <div className="mt-8 rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">Projects</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {stats?.projects?.map((project) => (
            <div key={project._id} className="rounded-3xl border border-slate-200 p-5">
              <h3 className="text-lg font-semibold text-slate-900">{project.title}</h3>
              <p className="mt-2 text-slate-600">{project.description || 'No description provided.'}</p>
              <div className="mt-4 text-sm text-slate-500">Team members: {project.teamMembers?.length || 0}</div>
            </div>
          ))}
          {!stats?.projects?.length && <p className="text-slate-500">No projects available yet.</p>}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

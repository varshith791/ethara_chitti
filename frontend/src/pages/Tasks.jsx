import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchTasks, createTask } from '../services/taskService';
import { fetchProjects } from '../services/projectService';
import TaskCard from '../components/TaskCard';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const { user } = useAuth();

  const loadTasks = async () => {
    try {
      const data = await fetchTasks({ status: status || undefined, search: search || undefined });
      setTasks(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const loadProjects = async () => {
    try {
      const data = await fetchProjects();
      setProjects(data);
      if (!projectId && data.length) setProjectId(data[0]._id);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadTasks();
    loadProjects();
  }, []);

  useEffect(() => {
    loadTasks();
  }, [status, search]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      await createTask({ title, description, assignedTo, dueDate, projectId });
      setTitle('');
      setDescription('');
      setAssignedTo('');
      setDueDate('');
      setMessage('Task created successfully');
      loadTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Tasks</h1>
          <p className="mt-2 text-slate-600">Track the status of your assignments and projects.</p>
        </div>
      </div>

      {error && <div className="rounded-3xl bg-rose-50 p-4 text-rose-700">{error}</div>}
      {message && <div className="rounded-3xl bg-emerald-50 p-4 text-emerald-700">{message}</div>}

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div>
          {user.role === 'Admin' && (
            <div className="rounded-3xl bg-white p-6 shadow-sm mb-6">
              <h2 className="text-xl font-semibold text-slate-900">Create Task</h2>
              <form onSubmit={handleCreateTask} className="mt-5 space-y-4">
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Task title"
                  required
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3"
                />
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description"
                  rows={4}
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3"
                />
                <div className="grid gap-4 md:grid-cols-2">
                  <select
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    required
                    className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3"
                  >
                    <option value="">Select project</option>
                    {projects.map((project) => (
                      <option key={project._id} value={project._id}>{project.title}</option>
                    ))}
                  </select>
                  <input
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    placeholder="Assigned user ID"
                    className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3"
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3"
                  />
                  <button className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-white hover:bg-slate-800">Create task</button>
                </div>
              </form>
            </div>
          )}

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Filter tasks</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3">
                <option value="">All statuses</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tasks"
                className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3"
              />
              <button onClick={loadTasks} className="rounded-2xl bg-slate-900 px-4 py-3 text-white hover:bg-slate-800">
                Refresh
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Task list</h2>
          <div className="mt-5 space-y-4">
            {tasks.map((task) => (
              <TaskCard key={task._id} task={task} />
            ))}
            {!tasks.length && <p className="text-slate-500">No tasks found.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tasks;

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchProjects, createProject, addProjectMember, removeProjectMember } from '../services/projectService';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [memberId, setMemberId] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { user } = useAuth();

  const loadProjects = async () => {
    try {
      const data = await fetchProjects();
      setProjects(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      await createProject({ title, description, teamMembers: [] });
      setTitle('');
      setDescription('');
      setMessage('Project created successfully');
      loadProjects();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!selectedProjectId || !memberId) return;
    setError('');
    setMessage('');
    try {
      await addProjectMember(selectedProjectId, { userId: memberId });
      setMemberId('');
      setMessage('Member added successfully');
      loadProjects();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRemoveMember = async () => {
    if (!selectedProjectId || !memberId) return;
    setError('');
    setMessage('');
    try {
      await removeProjectMember(selectedProjectId, { userId: memberId });
      setMemberId('');
      setMessage('Member removed successfully');
      loadProjects();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Projects</h1>
          <p className="mt-2 text-slate-600">Create projects and manage team membership.</p>
        </div>
      </div>

      {error && <div className="rounded-3xl bg-rose-50 p-4 text-rose-700">{error}</div>}
      {message && <div className="rounded-3xl bg-emerald-50 p-4 text-emerald-700">{message}</div>}

      {user.role === 'Admin' && (
        <div className="rounded-3xl bg-white p-6 shadow-sm mb-8">
          <h2 className="text-xl font-semibold text-slate-900">Create New Project</h2>
          <form onSubmit={handleCreateProject} className="mt-5 grid gap-4">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Project title"
              className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Project description"
              rows={4}
              className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3"
            />
            <button className="rounded-2xl bg-slate-900 px-4 py-3 text-white hover:bg-slate-800">Create Project</button>
          </form>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((project) => (
          <div key={project._id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">{project.title}</h3>
                <p className="mt-2 text-slate-600">{project.description || 'No description.'}</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">{project.teamMembers?.length || 0} members</span>
            </div>
            <div className="mt-4 text-sm text-slate-500">
              Created by: {project.createdBy?.name || 'Unknown'}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.teamMembers?.map((member) => (
                <span key={member._id} className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                  {member.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {user.role === 'Admin' && (
        <div className="mt-8 rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Manage Project Members</h2>
          <form onSubmit={handleAddMember} className="mt-5 grid gap-4 md:grid-cols-3">
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3"
            >
              <option value="">Select project</option>
              {projects.map((project) => (
                <option key={project._id} value={project._id}>{project.title}</option>
              ))}
            </select>
            <input
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
              placeholder="Member user ID"
              className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3"
            />
            <div className="flex gap-3">
              <button type="submit" className="rounded-2xl bg-slate-900 px-4 py-3 text-white hover:bg-slate-800">Add member</button>
              <button type="button" onClick={handleRemoveMember} className="rounded-2xl bg-rose-50 px-4 py-3 text-rose-700 hover:bg-rose-100">
                Remove member
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Projects;

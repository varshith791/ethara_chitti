import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchTask, fetchTaskActivity, updateTask, deleteTask } from '../services/taskService';
import { fetchProjects } from '../services/projectService';
import { fetchComments, addComment } from '../services/commentService';
import CommentItem from '../components/CommentItem';
import ActivityItem from '../components/ActivityItem';

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [task, setTask] = useState(null);
  const [projects, setProjects] = useState([]);
  const [comments, setComments] = useState([]);
  const [activities, setActivities] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [status, setStatus] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const loadTask = async () => {
    try {
      const data = await fetchTask(id);
      setTask(data);
      setTitle(data.title);
      setDescription(data.description || '');
      setAssignedTo(data.assignedTo || '');
      setDueDate(data.dueDate ? data.dueDate.slice(0, 10) : '');
      setStatus(data.status);
    } catch (err) {
      setError(err.message);
    }
  };

  const loadProjects = async () => {
    try {
      const data = await fetchProjects();
      setProjects(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const loadComments = async () => {
    try {
      const data = await fetchComments(id);
      setComments(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const loadActivities = async () => {
    try {
      const data = await fetchTaskActivity(id);
      setActivities(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadTask();
    loadProjects();
    loadComments();
    loadActivities();
  }, [id]);

  const canEdit = user.role === 'Admin' || task?.assignedTo === user.id;

  const getProjectMembers = () => {
    if (!task) return [];
    const project = projects.find(p => p.id === task.projectId);
    return project ? project.teamMembers : [];
  };

  const handleSubmitComment = async (event) => {
    event.preventDefault();
    if (!commentText.trim()) return;
    setError('');
    setMessage('');
    try {
      await addComment({ taskId: id, text: commentText });
      setCommentText('');
      setMessage('Comment added');
      loadComments();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateTask = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    try {
      await updateTask(id, { title, description, assignedTo, dueDate, status });
      setMessage('Task updated');
      loadTask();
      loadActivities();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await deleteTask(id);
      navigate('/tasks');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Task details</h1>
          <p className="mt-2 text-slate-600">Collaborate on task updates, comments, and activity.</p>
        </div>
        <button onClick={() => navigate('/tasks')} className="rounded-2xl bg-slate-100 px-5 py-3 text-slate-700 hover:bg-slate-200">
          Back to tasks
        </button>
      </div>

      {error && <div className="rounded-3xl bg-rose-50 p-4 text-rose-700">{error}</div>}
      {message && <div className="rounded-3xl bg-emerald-50 p-4 text-emerald-700">{message}</div>}

      {task ? (
        <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">{task.title}</h2>
                <p className="mt-2 text-slate-500">Project: {task.project?.title}</p>
              </div>
              <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">{task.status}</span>
            </div>
            <div className="mt-6 space-y-4 text-slate-700">
              <p>{task.description || 'No description provided.'}</p>
              <p>Assigned to: {task.assignedToUser?.name || 'Unassigned'}</p>
              <p>Due date: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Not set'}</p>
            </div>

            {canEdit && (
              <form onSubmit={handleUpdateTask} className="mt-8 space-y-4">
                <h3 className="text-lg font-semibold text-slate-900">Update task</h3>
                <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3" />
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3" />
                <div className="grid gap-4 md:grid-cols-2">
                  <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3">
                    <option value="">Unassigned</option>
                    {getProjectMembers().map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.name} ({member.role})
                      </option>
                    ))}
                  </select>
                  <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3" />
                </div>
                <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3">
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
                <div className="flex flex-wrap gap-3">
                  <button type="submit" className="rounded-2xl bg-slate-900 px-4 py-3 text-white hover:bg-slate-800">Save changes</button>
                  {user.role === 'Admin' && (
                    <button type="button" onClick={handleDelete} className="rounded-2xl bg-rose-50 px-4 py-3 text-rose-700 hover:bg-rose-100">
                      Delete task
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-900">Comments</h3>
              <form onSubmit={handleSubmitComment} className="mt-5 space-y-4">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  rows={4}
                  placeholder="Add a comment"
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3"
                />
                <button type="submit" className="rounded-2xl bg-slate-900 px-4 py-3 text-white hover:bg-slate-800">Post comment</button>
              </form>
              <div className="mt-5 space-y-4">
                {comments.map((comment) => <CommentItem key={comment.id} comment={comment} />)}
                {!comments.length && <p className="text-slate-500">No comments yet.</p>}
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-900">Activity timeline</h3>
              <div className="mt-5 space-y-4">
                {activities.map((activity) => <ActivityItem key={activity.id} activity={activity} />)}
                {!activities.length && <p className="text-slate-500">No activity recorded.</p>}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl bg-white p-8 shadow-sm text-slate-500">Loading task details...</div>
      )}
    </div>
  );
};

export default TaskDetails;

import { Link } from 'react-router-dom';

const statusStyles = {
  Pending: 'bg-amber-100 text-amber-700',
  'In Progress': 'bg-sky-100 text-sky-700',
  Completed: 'bg-emerald-100 text-emerald-700',
};

const TaskCard = ({ task }) => {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <Link to={`/tasks/${task._id}`} className="block">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-lg font-semibold text-slate-900">{task.title}</h3>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[task.status] || 'bg-slate-100 text-slate-700'}`}>
            {task.status}
          </span>
        </div>
        <p className="mt-2 text-slate-600 line-clamp-2">{task.description || 'No description.'}</p>
      </Link>
      <div className="mt-4 text-sm text-slate-500">
        Assigned to: {task.assignedTo?.name || 'Unassigned'}
      </div>
      <div className="mt-1 text-sm text-slate-500">
        Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
      </div>
    </div>
  );
};

export default TaskCard;

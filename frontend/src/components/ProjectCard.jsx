import { Link } from 'react-router-dom';

const ProjectCard = ({ project }) => {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-xl font-semibold text-slate-900">{project.title}</h3>
          <p className="mt-2 text-slate-600">{project.description || 'No description provided.'}</p>
        </div>
        <Link to="/tasks" className="text-slate-700 text-sm font-medium hover:text-slate-900">
          View tasks
        </Link>
      </div>
      <div className="mt-4 text-sm text-slate-500">
        Assigned members: {project.teamMembers?.length || 0}
      </div>
    </div>
  );
};

export default ProjectCard;

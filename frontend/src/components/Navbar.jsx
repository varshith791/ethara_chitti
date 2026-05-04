import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
        <div>
          <div className="text-xl font-semibold text-slate-900">Team Task Manager</div>
          <div className="text-sm text-slate-500">{user?.role} Dashboard</div>
        </div>

        <nav className="flex gap-3 items-center">
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'text-slate-900 font-semibold' : 'text-slate-600 hover:text-slate-900'}>
            Dashboard
          </NavLink>
          <NavLink to="/projects" className={({ isActive }) => isActive ? 'text-slate-900 font-semibold' : 'text-slate-600 hover:text-slate-900'}>
            Projects
          </NavLink>
          <NavLink to="/tasks" className={({ isActive }) => isActive ? 'text-slate-900 font-semibold' : 'text-slate-600 hover:text-slate-900'}>
            Tasks
          </NavLink>
          <button onClick={handleLogout} className="rounded-md bg-slate-900 px-4 py-2 text-white hover:bg-slate-700">
            Logout
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;

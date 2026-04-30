import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const linkClass = ({ isActive }) =>
    `rounded-md px-3 py-2 text-sm font-medium ${isActive ? 'bg-blue-50 text-brand' : 'text-slate-600 hover:bg-slate-100'}`;

  return (
    <div className="min-h-screen">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
          <div>
            <h1 className="text-xl font-bold text-ink">Team Task Manager</h1>
            <p className="text-sm text-slate-500">
              {user?.name} · {user?.role}
            </p>
          </div>
          <nav className="flex items-center gap-2">
            <NavLink to="/" className={linkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/projects" className={linkClass}>
              Projects
            </NavLink>
            <NavLink to="/tasks" className={linkClass}>
              Tasks
            </NavLink>
            <button className="button-secondary" onClick={logout}>
              Logout
            </button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
};

export default Layout;

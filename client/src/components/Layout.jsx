import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: 'dashboard' },
    { name: 'Projects', path: '/projects', icon: 'folder_open' },
    { name: 'Tasks', path: '/tasks', icon: 'assignment' },
  ];

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all duration-200 ${
      isActive 
        ? 'bg-primary-50 text-primary-700 shadow-sm border border-primary-100' 
        : 'text-textMuted hover:bg-surfaceHover hover:text-textMain'
    }`;

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-ink/50 backdrop-blur-sm lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-30 w-64 transform flex-col justify-between border-r border-border bg-surface shadow-2xl transition-transform duration-300 lg:static lg:flex lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0 flex' : '-translate-x-full hidden'}`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto">
          <div className="flex h-16 shrink-0 items-center border-b border-border px-6">
            <div className="flex items-center gap-2 text-primary-600">
               <span className="icon text-2xl">task_alt</span>
               <span className="text-xl font-bold tracking-tight">Task Manager</span>
            </div>
          </div>
          <nav className="flex-1 space-y-1.5 px-4 py-6">
            {navItems.map((item) => (
              <NavLink key={item.name} to={item.path} className={linkClass} onClick={() => setSidebarOpen(false)}>
                <span className="icon text-lg">{item.icon}</span>
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
        
        {/* User Profile Area */}
        <div className="border-t border-border p-4">
           <div className="flex items-center gap-3 rounded-lg p-2 mb-2 bg-surfaceHover border border-border/50">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700 font-bold shadow-inner">
                 {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col min-w-0">
                 <span className="truncate text-sm font-semibold text-textMain">{user?.name}</span>
                 <span className="truncate text-xs text-textMuted font-medium">{user?.role}</span>
              </div>
           </div>
           <button 
             onClick={logout}
             className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-ember transition-colors hover:bg-ember/10"
           >
             <span className="icon text-lg">logout</span>
             Sign out
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header (Mobile mainly) */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-surface px-4 shadow-sm lg:hidden">
          <div className="flex items-center gap-2 text-primary-600">
             <span className="icon text-2xl">task_alt</span>
             <span className="text-lg font-bold tracking-tight">Task Manager</span>
          </div>
          <button 
            type="button" 
            className="rounded-lg p-2 text-textMuted hover:bg-surfaceHover hover:text-textMain transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="icon text-2xl">menu</span>
          </button>
        </header>

        <main className="flex-1 overflow-y-auto flex flex-col bg-background">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;

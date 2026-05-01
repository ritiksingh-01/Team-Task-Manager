import React from 'react';
import { useEffect, useMemo, useState } from 'react';
import StatCard from '../components/StatCard.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import PageHeader from '../components/PageHeader.jsx';
import { api } from '../services/api.js';
import { formatDate, isOverdue } from '../utils/date.js';

const DashboardPage = () => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .getTasks()
      .then(setTasks)
      .catch((apiError) => setError(apiError.message));
  }, []);

  const stats = useMemo(
    () => ({
      total: tasks.length,
      completed: tasks.filter((task) => task.status === 'Done').length,
      overdue: tasks.filter(isOverdue).length
    }),
    [tasks]
  );

  return (
    <section className="flex flex-col flex-1 h-full">
      <PageHeader 
        title="Dashboard" 
        description="A quick look at task progress and deadlines."
      >
        <div className="flex items-center gap-2 text-sm font-semibold text-primary-700 bg-primary-50 px-3 py-1.5 rounded-lg border border-primary-100 shadow-sm">
           <span className="icon text-primary-600 text-[18px]">calendar_today</span>
           {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </div>
      </PageHeader>

      <div className="w-full px-4 py-6 lg:px-8 lg:py-8 flex-1">

      {error && (
        <div className="mb-6 flex items-start gap-2 rounded-lg bg-ember/10 px-4 py-3 text-sm text-ember border border-ember/20">
           <span className="icon text-ember mt-0.5">error</span>
           <p>{error}</p>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-3">
        <StatCard label="Total tasks" value={stats.total} tone="primary" icon="list_alt" />
        <StatCard label="Completed tasks" tone="green" value={stats.completed} icon="check_circle" />
        <StatCard label="Overdue tasks" tone="orange" value={stats.overdue} icon="warning" />
      </div>

      <div className="panel mt-8 overflow-hidden border-border bg-surface shadow-sm">
        <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-surfaceHover/50">
          <h3 className="text-lg font-semibold text-textMain flex items-center gap-2">
             <span className="icon text-primary-600">history</span>
             Recent Tasks
          </h3>
        </div>
        
        {tasks.length > 0 ? (
          <div className="divide-y divide-border">
            {tasks.slice(0, 6).map((task) => (
              <div className="grid items-center gap-4 px-6 py-4 transition-colors hover:bg-surfaceHover md:grid-cols-[1fr_auto_auto]" key={task._id}>
                <div className="flex items-start gap-3">
                  <div className={`mt-1 flex h-2 w-2 shrink-0 rounded-full ${task.status === 'Done' ? 'bg-leaf' : isOverdue(task) ? 'bg-ember' : 'bg-primary-500'}`}></div>
                  <div>
                    <p className="font-semibold text-textMain">{task.title}</p>
                    <p className="text-sm font-medium text-textMuted mt-0.5 flex items-center gap-1">
                       <span className="icon text-sm">folder_open</span>
                       {task.projectId?.name || 'No Project'}
                    </p>
                  </div>
                </div>
                <div className="flex justify-start">
                   <StatusBadge status={task.status} />
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${isOverdue(task) && task.status !== 'Done' ? 'text-ember bg-ember/10 px-2 py-1 rounded-md' : 'text-textMuted'}`}>
                  <span className="icon text-base">schedule</span>
                  {formatDate(task.deadline)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
             <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 mb-4 text-slate-400">
                <span className="icon text-3xl">assignment</span>
             </div>
             <p className="text-base font-semibold text-textMain">No tasks found</p>
             <p className="text-sm text-textMuted mt-1 max-w-sm">You don't have any recent tasks. Create a new task to get started.</p>
          </div>
        )}
      </div>
      </div>
    </section>
  );
};

export default DashboardPage;

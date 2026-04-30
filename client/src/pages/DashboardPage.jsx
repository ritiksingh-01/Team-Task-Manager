import React from 'react';
import { useEffect, useMemo, useState } from 'react';
import StatCard from '../components/StatCard.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
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
    <section>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <p className="text-sm text-slate-500">A quick look at task progress and deadlines.</p>
      </div>

      {error && <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total tasks" value={stats.total} />
        <StatCard label="Completed tasks" tone="green" value={stats.completed} />
        <StatCard label="Overdue tasks" tone="orange" value={stats.overdue} />
      </div>

      <div className="panel mt-6 overflow-hidden">
        <div className="border-b border-line px-4 py-3">
          <h3 className="font-semibold">Recent tasks</h3>
        </div>
        <div className="divide-y divide-line">
          {tasks.slice(0, 6).map((task) => (
            <div className="grid gap-2 px-4 py-3 md:grid-cols-[1fr_auto_auto]" key={task._id}>
              <div>
                <p className="font-medium">{task.title}</p>
                <p className="text-sm text-slate-500">{task.projectId?.name}</p>
              </div>
              <StatusBadge status={task.status} />
              <p className={`text-sm ${isOverdue(task) ? 'font-semibold text-ember' : 'text-slate-500'}`}>
                {formatDate(task.deadline)}
              </p>
            </div>
          ))}
          {!tasks.length && <p className="px-4 py-6 text-sm text-slate-500">No tasks yet.</p>}
        </div>
      </div>
    </section>
  );
};

export default DashboardPage;

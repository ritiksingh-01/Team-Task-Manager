import React from 'react';
import { useEffect, useMemo, useState } from 'react';
import StatusBadge from '../components/StatusBadge.jsx';
import PageHeader from '../components/PageHeader.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../services/api.js';
import { formatDate, isOverdue } from '../utils/date.js';

const initialTask = {
  title: '',
  description: '',
  projectId: '',
  assignedTo: '',
  deadline: ''
};

const TasksPage = () => {
  const { isAdmin } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(initialTask);
  const [selectedProject, setSelectedProject] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const loadTasks = (projectId = selectedProject) => api.getTasks(projectId).then(setTasks);

  useEffect(() => {
    api.getProjects().then(setProjects).catch((apiError) => setError(apiError.message));
    loadTasks('').catch((apiError) => setError(apiError.message));
    if (isAdmin) {
      api.getUsers().then(setUsers).catch(console.error);
    }
  }, [isAdmin]);

  const selectedProjectForForm = useMemo(
    () => projects.find((project) => project._id === form.projectId),
    [form.projectId, projects]
  );

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value,
      ...(name === 'projectId' ? { assignedTo: '' } : {})
    }));
  };

  const createTask = async (event) => {
    event.preventDefault();

    if (!form.title.trim() || !form.projectId || !form.assignedTo || !form.deadline) {
      setError('Title, project, assignee, and deadline are required');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const task = await api.createTask(form);
      setTasks((current) => [task, ...current]);
      setForm(initialTask);
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setSaving(false);
    }
  };

  const updateStatus = async (taskId, status) => {
    try {
      const updated = await api.updateTaskStatus(taskId, status);
      setTasks((current) => current.map((task) => (task._id === updated._id ? updated : task)));
    } catch (apiError) {
      setError(apiError.message);
    }
  };

  const filterByProject = async (projectId) => {
    setSelectedProject(projectId);
    setError('');

    try {
      await loadTasks(projectId);
    } catch (apiError) {
      setError(apiError.message);
    }
  };

  return (
    <section>
      <PageHeader 
        title="Tasks" 
        description="Create assignments and update progress."
      >
        <div className="w-48 sm:w-64">
          <div className="relative">
             <span className="icon absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10 text-[18px]">filter_alt</span>
             <select
               className="field pl-9 pr-8 py-1.5 text-sm appearance-none bg-surface border border-border shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500/20 rounded-lg w-full"
               id="project-filter"
               onChange={(event) => filterByProject(event.target.value)}
               value={selectedProject}
             >
               <option value="">All projects</option>
               {projects.map((project) => (
                 <option key={project._id} value={project._id}>
                   {project.name}
                 </option>
               ))}
             </select>
             <span className="icon absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[18px]">expand_more</span>
          </div>
        </div>
      </PageHeader>

      <div className="w-full px-4 py-6 lg:px-8 lg:py-8 flex-1">

      {error && (
        <div className="mb-6 flex items-start gap-2 rounded-lg bg-ember/10 px-4 py-3 text-sm text-ember border border-ember/20">
           <span className="icon text-ember mt-0.5">error</span>
           <p>{error}</p>
        </div>
      )}

      {isAdmin && (
        <details className="panel mb-8 border-border bg-surface shadow-sm group">
          <summary className="flex cursor-pointer items-center justify-between border-b border-border/50 px-6 py-4 bg-surfaceHover/50 list-none">
            <h3 className="text-lg font-semibold text-textMain flex items-center gap-2">
               <span className="icon text-primary-600">add_task</span>
               Create New Task
            </h3>
            <span className="icon transition-transform duration-300 group-open:rotate-180">expand_more</span>
          </summary>
          <form className="grid gap-5 p-6 lg:grid-cols-2" onSubmit={createTask}>
            <div className="relative">
              <label className="label" htmlFor="title">
                Task Title
              </label>
              <div className="relative">
                 <span className="icon absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">title</span>
                 <input className="field pl-10" id="title" name="title" placeholder="e.g. Design Landing Page" onChange={updateField} value={form.title} />
              </div>
            </div>
            <div className="relative">
              <label className="label" htmlFor="deadline">
                Deadline
              </label>
              <div className="relative">
                 <span className="icon absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">event</span>
                 <input className="field pl-10" id="deadline" name="deadline" onChange={updateField} type="date" value={form.deadline} />
              </div>
            </div>
            <div className="relative">
              <label className="label" htmlFor="projectId">
                Project
              </label>
              <div className="relative">
                 <span className="icon absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10">folder</span>
                 <select className="field pl-10 appearance-none" id="projectId" name="projectId" onChange={updateField} value={form.projectId}>
                   <option value="">Select project</option>
                   {projects.map((project) => (
                     <option key={project._id} value={project._id}>
                       {project.name}
                     </option>
                   ))}
                 </select>
                 <span className="icon absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
              </div>
            </div>
            <div className="relative">
              <label className="label" htmlFor="assignedTo">
                Assignee
              </label>
              <div className="relative">
                 <span className="icon absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10">person</span>
                 <select className="field pl-10 appearance-none" id="assignedTo" name="assignedTo" onChange={updateField} value={form.assignedTo}>
                   <option value="">Select member</option>
                   {users.map((member) => (
                     <option key={member._id} value={member._id}>
                       {member.name}
                     </option>
                   ))}
                 </select>
                 <span className="icon absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
              </div>
            </div>
            <div className="lg:col-span-2">
              <label className="label" htmlFor="description">
                Description
              </label>
              <textarea
                className="field min-h-[100px] resize-y"
                id="description"
                name="description"
                placeholder="Add more details about this task..."
                onChange={updateField}
                value={form.description}
              />
            </div>
            <div className="lg:col-span-2 flex justify-end mt-2">
               <button className="button-primary w-full sm:w-auto px-8" disabled={saving} type="submit">
                 <span className="icon">check</span>
                 Create Task
               </button>
            </div>
          </form>
        </details>
      )}

      <div className="panel overflow-hidden border-border shadow-sm">
        <div className="hidden grid-cols-[1.5fr_1fr_1fr_120px_160px] gap-4 border-b border-border bg-surfaceHover/60 px-6 py-4 text-xs font-bold uppercase tracking-wider text-textMuted lg:grid">
          <span>Task Details</span>
          <span>Project</span>
          <span>Assignee</span>
          <span>Deadline</span>
          <span>Status</span>
        </div>
        
        {tasks.length > 0 ? (
          <div className="divide-y divide-border">
            {tasks.map((task) => (
              <article className="grid gap-4 px-6 py-5 transition-colors hover:bg-surfaceHover/40 lg:grid-cols-[1.5fr_1fr_1fr_120px_160px] lg:items-center" key={task._id}>
                <div>
                  <p className="font-semibold text-textMain text-base">{task.title}</p>
                  {task.description && <p className="mt-1 text-sm text-textMuted line-clamp-2">{task.description}</p>}
                </div>
                <div className="flex items-center gap-1.5 text-sm text-textMain">
                   <span className="icon text-[16px] text-slate-400 lg:hidden">folder</span>
                   <span className="font-medium">{task.projectId?.name || '—'}</span>
                </div>
                <div className="flex items-center gap-2">
                   <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 text-[10px] font-bold text-primary-700">
                      {task.assignedTo?.name?.charAt(0).toUpperCase() || '?'}
                   </div>
                   <p className="text-sm font-medium text-textMain">{task.assignedTo?.name || 'Unassigned'}</p>
                </div>
                <div className={`flex items-center gap-1.5 text-sm ${isOverdue(task) && task.status !== 'Done' ? 'font-semibold text-ember bg-ember/10 px-2 py-1 rounded-md inline-flex w-fit' : 'font-medium text-textMuted'}`}>
                  <span className="icon text-[16px] lg:hidden">schedule</span>
                  {formatDate(task.deadline)}
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <StatusBadge status={task.status} />
                  <div className="relative w-full sm:w-auto">
                     <select 
                        className="field py-1.5 pl-3 pr-8 text-xs font-semibold appearance-none bg-surface" 
                        onChange={(event) => updateStatus(task._id, event.target.value)} 
                        value={task.status}
                     >
                       <option>Todo</option>
                       <option>In Progress</option>
                       <option>Done</option>
                     </select>
                     <span className="icon absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[16px]">expand_more</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
             <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 mb-4 text-slate-400">
                <span className="icon text-3xl">task</span>
             </div>
             <p className="text-lg font-bold text-textMain">No tasks found</p>
             <p className="text-sm text-textMuted mt-1 max-w-sm">No tasks match your current filters. {isAdmin && 'Create a new task to get started.'}</p>
          </div>
        )}
      </div>
      </div>
    </section>
  );
};

export default TasksPage;

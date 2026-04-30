import React from 'react';
import { useEffect, useMemo, useState } from 'react';
import StatusBadge from '../components/StatusBadge.jsx';
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
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Tasks</h2>
          <p className="text-sm text-slate-500">Create assignments and update progress.</p>
        </div>
        <div className="w-full sm:w-72">
          <label className="label" htmlFor="project-filter">
            Filter by project
          </label>
          <select
            className="field"
            id="project-filter"
            onChange={(event) => filterByProject(event.target.value)}
            value={selectedProject}
          >
            <option value="">All accessible tasks</option>
            {projects.map((project) => (
              <option key={project._id} value={project._id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      {isAdmin && (
        <form className="panel mb-6 grid gap-4 p-4 lg:grid-cols-2" onSubmit={createTask}>
          <div>
            <label className="label" htmlFor="title">
              Title
            </label>
            <input className="field" id="title" name="title" onChange={updateField} value={form.title} />
          </div>
          <div>
            <label className="label" htmlFor="deadline">
              Deadline
            </label>
            <input className="field" id="deadline" name="deadline" onChange={updateField} type="date" value={form.deadline} />
          </div>
          <div>
            <label className="label" htmlFor="projectId">
              Project
            </label>
            <select className="field" id="projectId" name="projectId" onChange={updateField} value={form.projectId}>
              <option value="">Select project</option>
              {projects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="assignedTo">
              Assignee
            </label>
            <select className="field" id="assignedTo" name="assignedTo" onChange={updateField} value={form.assignedTo}>
              <option value="">Select member</option>
              {users.map((member) => (
                <option key={member._id} value={member._id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>
          <div className="lg:col-span-2">
            <label className="label" htmlFor="description">
              Description
            </label>
            <textarea
              className="field min-h-24"
              id="description"
              name="description"
              onChange={updateField}
              value={form.description}
            />
          </div>
          <button className="button-primary lg:col-span-2" disabled={saving} type="submit">
            Create task
          </button>
        </form>
      )}

      <div className="panel overflow-hidden">
        <div className="hidden grid-cols-[1.3fr_1fr_1fr_130px_160px] gap-4 border-b border-line bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600 md:grid">
          <span>Task</span>
          <span>Project</span>
          <span>Assignee</span>
          <span>Deadline</span>
          <span>Status</span>
        </div>
        <div className="divide-y divide-line">
          {tasks.map((task) => (
            <article className="grid gap-3 px-4 py-4 md:grid-cols-[1.3fr_1fr_1fr_130px_160px]" key={task._id}>
              <div>
                <p className="font-semibold">{task.title}</p>
                {task.description && <p className="mt-1 text-sm text-slate-500">{task.description}</p>}
              </div>
              <p className="text-sm text-slate-600">{task.projectId?.name}</p>
              <p className="text-sm text-slate-600">{task.assignedTo?.name}</p>
              <p className={`text-sm ${isOverdue(task) ? 'font-semibold text-ember' : 'text-slate-600'}`}>
                {formatDate(task.deadline)}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={task.status} />
                <select className="field py-1" onChange={(event) => updateStatus(task._id, event.target.value)} value={task.status}>
                  <option>Todo</option>
                  <option>In Progress</option>
                  <option>Done</option>
                </select>
              </div>
            </article>
          ))}
          {!tasks.length && <p className="px-4 py-6 text-sm text-slate-500">No tasks found.</p>}
        </div>
      </div>
    </section>
  );
};

export default TasksPage;

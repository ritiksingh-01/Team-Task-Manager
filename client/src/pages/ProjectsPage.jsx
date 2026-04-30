import React from 'react';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../services/api.js';

const ProjectsPage = () => {
  const { isAdmin } = useAuth();
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [teamMembers, setTeamMembers] = useState([]);
  const [fullAccessMembers, setFullAccessMembers] = useState([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const loadProjects = () => api.getProjects().then(setProjects);

  useEffect(() => {
    loadProjects().catch((apiError) => setError(apiError.message));

    if (isAdmin) {
      api.getUsers().then(setUsers).catch((apiError) => setError(apiError.message));
    }
  }, [isAdmin]);

  const toggleMember = (id) => {
    setTeamMembers((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      if (!next.includes(id)) {
        setFullAccessMembers((fa) => fa.filter((item) => item !== id));
      }
      return next;
    });
  };

  const toggleFullAccess = (id) => {
    setFullAccessMembers((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  };

  const createProject = async (event) => {
    event.preventDefault();

    if (!name.trim()) {
      setError('Project name is required');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const project = await api.createProject({ name, teamMembers, fullAccessMembers });
      setProjects((current) => [project, ...current]);
      setName('');
      setTeamMembers([]);
      setFullAccessMembers([]);
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setSaving(false);
    }
  };

  const replaceMembers = async (projectId, nextMembers, nextFullAccess) => {
    try {
      const updated = await api.updateProjectMembers(projectId, { teamMembers: nextMembers, fullAccessMembers: nextFullAccess });
      setProjects((current) => current.map((project) => (project._id === updated._id ? updated : project)));
    } catch (apiError) {
      setError(apiError.message);
    }
  };

  return (
    <section>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Projects</h2>
        <p className="text-sm text-slate-500">Create projects and manage the assigned team.</p>
      </div>

      {error && <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      {isAdmin && (
        <form className="panel mb-6 p-4" onSubmit={createProject}>
          <div className="grid gap-4 md:grid-cols-[1fr_auto]">
            <div>
              <label className="label" htmlFor="project-name">
                Project name
              </label>
              <input className="field" id="project-name" onChange={(event) => setName(event.target.value)} value={name} />
            </div>
            <button className="button-primary self-end" disabled={saving} type="submit">
              Create project
            </button>
          </div>

          <div className="mt-4">
            <p className="label">Team members</p>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {users.map((user) => (
                <div key={user._id} className="flex flex-col gap-1 rounded-md border border-line px-3 py-2 text-sm">
                  <label className="flex items-center gap-2">
                    <input checked={teamMembers.includes(user._id)} onChange={() => toggleMember(user._id)} type="checkbox" />
                    <span>
                      {user.name} <span className="text-slate-400">({user.role})</span>
                    </span>
                  </label>
                  {teamMembers.includes(user._id) && (
                    <label className="flex items-center gap-2 pl-6 text-xs text-slate-500">
                      <input checked={fullAccessMembers.includes(user._id)} onChange={() => toggleFullAccess(user._id)} type="checkbox" />
                      Full Visibility
                    </label>
                  )}
                </div>
              ))}
            </div>
          </div>
        </form>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((project) => {
          const memberIds = project.teamMembers.map((member) => member._id);

          return (
            <article className="panel p-4" key={project._id}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold">{project.name}</h3>
                  <p className="text-sm text-slate-500">Created by {project.createdBy?.name}</p>
                </div>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                  {project.teamMembers.length} members
                </span>
              </div>

              <div className="mt-4 space-y-2">
                {project.teamMembers.map((member) => {
                  const hasFullAccess = project.fullAccessMembers?.some((m) => m._id === member._id);
                  return (
                    <div className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2 text-sm" key={member._id}>
                      <div className="flex items-center gap-2">
                        <span>{member.name}</span>
                        {hasFullAccess && <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand">Full Access</span>}
                      </div>
                      <span className="text-slate-500">{member.email}</span>
                    </div>
                  );
                })}
                {!project.teamMembers.length && <p className="text-sm text-slate-500">No members assigned.</p>}
              </div>

              {isAdmin && (
                <div className="mt-4 border-t border-line pt-4">
                  <p className="label">Update members</p>
                  <div className="grid gap-2">
                    {users.map((user) => {
                      const checked = memberIds.includes(user._id);
                      const fullAccessIds = project.fullAccessMembers ? project.fullAccessMembers.map(m => m._id) : [];
                      const hasFullAccess = fullAccessIds.includes(user._id);

                      const nextMembers = checked
                        ? memberIds.filter((id) => id !== user._id)
                        : [...memberIds, user._id];
                      
                      const nextFullAccessForToggle = hasFullAccess
                        ? fullAccessIds.filter((id) => id !== user._id)
                        : [...fullAccessIds, user._id];

                      const nextFullAccessForMemberToggle = checked
                        ? fullAccessIds.filter((id) => id !== user._id)
                        : fullAccessIds;

                      return (
                        <div key={user._id} className="flex flex-col gap-1 text-sm">
                          <label className="flex items-center gap-2">
                            <input
                              checked={checked}
                              onChange={() => replaceMembers(project._id, nextMembers, nextFullAccessForMemberToggle)}
                              type="checkbox"
                            />
                            {user.name}
                          </label>
                          {checked && (
                            <label className="flex items-center gap-2 pl-6 text-xs text-slate-500">
                              <input
                                checked={hasFullAccess}
                                onChange={() => replaceMembers(project._id, memberIds, nextFullAccessForToggle)}
                                type="checkbox"
                              />
                              Full Visibility
                            </label>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>

      {!projects.length && <p className="panel p-6 text-sm text-slate-500">No projects available.</p>}
    </section>
  );
};

export default ProjectsPage;

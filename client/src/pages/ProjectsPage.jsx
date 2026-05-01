import React from 'react';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import PageHeader from '../components/PageHeader.jsx';
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
    <section className="flex flex-col flex-1 h-full">
      <PageHeader 
        title="Projects" 
        description="Create projects and manage the assigned team."
      />

      <div className="w-full px-4 py-6 lg:px-8 lg:py-8 flex-1">

      {error && (
        <div className="mb-6 flex items-start gap-2 rounded-lg bg-ember/10 px-4 py-3 text-sm text-ember border border-ember/20">
           <span className="icon text-ember mt-0.5">error</span>
           <p>{error}</p>
        </div>
      )}

      {isAdmin && (
        <form className="panel mb-8 border-border bg-surface shadow-sm" onSubmit={createProject}>
          <div className="border-b border-border px-6 py-4 bg-surfaceHover/50">
            <h3 className="text-lg font-semibold text-textMain">Create New Project</h3>
          </div>
          <div className="p-6">
            <div className="grid gap-6 md:grid-cols-[1fr_auto]">
              <div className="relative">
                <label className="label" htmlFor="project-name">
                  Project Name
                </label>
                <div className="relative">
                   <span className="icon absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">title</span>
                   <input className="field pl-11" id="project-name" placeholder="e.g. Website Redesign" onChange={(event) => setName(event.target.value)} value={name} />
                </div>
              </div>
              <button className="button-primary self-end" disabled={saving} type="submit">
                <span className="icon">add</span>
                Create Project
              </button>
            </div>

            <div className="mt-8">
              <p className="label flex items-center gap-2 mb-3">
                 <span className="icon text-textMuted">group</span>
                 Assign Team Members
              </p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {users.map((user) => (
                  <div key={user._id} className="flex flex-col gap-2 rounded-lg border border-border bg-surfaceHover/30 p-3 transition-colors hover:bg-surfaceHover/60">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input 
                         className="h-4 w-4 rounded border-border text-primary-600 focus:ring-primary-500"
                         checked={teamMembers.includes(user._id)} 
                         onChange={() => toggleMember(user._id)} 
                         type="checkbox" 
                      />
                      <div className="flex flex-col">
                         <span className="font-semibold text-textMain text-sm">{user.name}</span>
                         <span className="text-xs text-textMuted font-medium">{user.role}</span>
                      </div>
                    </label>
                    {teamMembers.includes(user._id) && (
                      <label className="flex items-center gap-2 pl-7 mt-1 text-xs font-medium text-slate-500 cursor-pointer">
                        <input 
                           className="h-3 w-3 rounded border-border text-leaf focus:ring-leaf"
                           checked={fullAccessMembers.includes(user._id)} 
                           onChange={() => toggleFullAccess(user._id)} 
                           type="checkbox" 
                        />
                        <span className="icon text-[14px]">visibility</span>
                        Full Visibility
                      </label>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </form>
      )}

      {projects.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            const memberIds = project.teamMembers.map((member) => member._id);

            return (
              <article className="panel flex flex-col justify-between" key={project._id}>
                <div className="p-5 border-b border-border/50">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="text-lg font-bold text-textMain leading-tight">{project.name}</h3>
                    <span className="flex items-center gap-1 rounded-full bg-primary-50 border border-primary-100 px-2.5 py-1 text-xs font-bold text-primary-700 whitespace-nowrap">
                      <span className="icon text-[14px]">group</span>
                      {project.teamMembers.length}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-textMuted flex items-center gap-1">
                     <span className="icon text-[14px]">person_add</span>
                     Created by {project.createdBy?.name}
                  </p>
                </div>

                <div className="p-5 flex-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-textMuted mb-3">Team Members</h4>
                  <div className="space-y-2">
                    {project.teamMembers.map((member) => {
                      const hasFullAccess = project.fullAccessMembers?.some((m) => m._id === member._id);
                      return (
                        <div className="flex flex-col rounded-lg bg-surfaceHover px-3 py-2 border border-border/50" key={member._id}>
                          <div className="flex items-center justify-between">
                             <span className="text-sm font-semibold text-textMain">{member.name}</span>
                             {hasFullAccess && <span className="rounded flex items-center gap-0.5 bg-leaf/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-leaf"><span className="icon text-[10px]">visibility</span> Full Access</span>}
                          </div>
                          <span className="text-xs text-textMuted">{member.email}</span>
                        </div>
                      );
                    })}
                    {!project.teamMembers.length && (
                      <div className="flex items-center gap-2 text-sm text-slate-400 italic py-2">
                        <span className="icon">person_off</span>
                        No members assigned.
                      </div>
                    )}
                  </div>
                </div>

                {isAdmin && (
                  <div className="p-5 bg-surfaceHover/50 border-t border-border mt-auto">
                    <details className="group">
                       <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold text-textMain list-none">
                          <span className="flex items-center gap-2">
                             <span className="icon text-primary-600">manage_accounts</span>
                             Update Members
                          </span>
                          <span className="icon transition group-open:rotate-180">expand_more</span>
                       </summary>
                       <div className="mt-4 grid gap-3">
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
                             <div key={user._id} className="flex flex-col gap-1 rounded border border-border/50 bg-surface p-2">
                               <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                                 <input
                                   className="h-4 w-4 rounded border-border text-primary-600 focus:ring-primary-500"
                                   checked={checked}
                                   onChange={() => replaceMembers(project._id, nextMembers, nextFullAccessForMemberToggle)}
                                   type="checkbox"
                                 />
                                 {user.name}
                               </label>
                               {checked && (
                                 <label className="flex items-center gap-2 pl-6 text-xs text-slate-500 cursor-pointer">
                                   <input
                                     className="h-3 w-3 rounded border-border text-leaf focus:ring-leaf"
                                     checked={hasFullAccess}
                                     onChange={() => replaceMembers(project._id, memberIds, nextFullAccessForToggle)}
                                     type="checkbox"
                                   />
                                   <span className="icon text-[14px]">visibility</span>
                                   Full Visibility
                                 </label>
                               )}
                             </div>
                           );
                         })}
                       </div>
                    </details>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      ) : (
        <div className="panel flex flex-col items-center justify-center py-20 px-4 text-center">
           <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 mb-4 text-slate-400">
              <span className="icon text-3xl">folder_off</span>
           </div>
           <p className="text-lg font-bold text-textMain">No projects available</p>
           <p className="text-sm text-textMuted mt-1 max-w-sm">There are currently no projects to display. {isAdmin && 'Create a new project above to get started.'}</p>
        </div>
      )}
      </div>
    </section>
  );
};

export default ProjectsPage;

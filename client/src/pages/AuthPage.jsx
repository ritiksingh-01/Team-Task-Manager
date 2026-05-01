import React from 'react';
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const initialForm = {
  name: '',
  email: '',
  password: '',
  role: 'Member'
};

const AuthPage = () => {
  const { user, authenticate } = useAuth();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) {
    return <Navigate to="/" replace />;
  }

  const updateField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const validate = () => {
    if (mode === 'signup' && !form.name.trim()) {
      return 'Name is required';
    }

    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      return 'Enter a valid email address';
    }

    if (form.password.length < 6) {
      return 'Password must be at least 6 characters';
    }

    return '';
  };

  const submit = async (event) => {
    event.preventDefault();
    const validationError = validate();

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload =
        mode === 'signup'
          ? form
          : {
              email: form.email,
              password: form.password
            };

      await authenticate(mode, payload);
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-background px-4 py-8 overflow-hidden z-0">
      {/* Abstract Background Blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary-300/30 blur-[120px] -z-10"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-300/30 blur-[120px] -z-10"></div>

      <section className="relative z-10 grid w-full max-w-5xl overflow-hidden rounded-2xl border border-white/20 bg-surface/80 shadow-2xl backdrop-blur-xl md:grid-cols-[1fr_1.1fr]">
        <div className="flex flex-col justify-center bg-primary-900/95 p-10 text-white md:p-14">
          <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 shadow-inner">
             <span className="icon text-3xl text-primary-300">task_alt</span>
          </div>
          <p className="text-sm font-semibold uppercase tracking-widest text-primary-300">Team Task Manager</p>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight lg:text-5xl">
            Plan projects, assign work, and track progress.
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-indigo-100/80">
            Admins manage projects and assignments. Members stay focused on the work assigned to them.
          </p>
        </div>

        <form className="flex flex-col justify-center p-8 md:p-14 bg-surface" onSubmit={submit}>
          <div className="mb-8">
             <h2 className="text-2xl font-bold text-textMain tracking-tight">
               {mode === 'login' ? 'Welcome back' : 'Create an account'}
             </h2>
             <p className="text-sm text-textMuted mt-1">
               {mode === 'login' ? 'Enter your details to access your account.' : 'Get started with Team Task Manager today.'}
             </p>
          </div>

          <div className="mb-8 flex rounded-lg bg-surfaceHover p-1 border border-border">
            {['login', 'signup'].map((item) => (
              <button
                className={`flex-1 rounded-md px-4 py-2.5 text-sm font-semibold capitalize transition-all duration-200 ${mode === item ? 'bg-surface text-primary-600 shadow-sm border border-border/50' : 'text-textMuted hover:text-textMain'}`}
                key={item}
                onClick={() => {
                  setMode(item);
                  setError('');
                }}
                type="button"
              >
                {item}
              </button>
            ))}
          </div>

          {mode === 'signup' && (
            <div className="mb-5 relative">
              <label className="label" htmlFor="name">
                Full Name
              </label>
              <div className="relative">
                <span className="icon absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">person</span>
                <input className="field pl-11" id="name" name="name" placeholder="John Doe" onChange={updateField} value={form.name} />
              </div>
            </div>
          )}

          <div className="mb-5 relative">
            <label className="label" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <span className="icon absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">mail</span>
              <input className="field pl-11" id="email" name="email" placeholder="you@example.com" onChange={updateField} type="email" value={form.email} />
            </div>
          </div>

          <div className="mb-5 relative">
            <label className="label" htmlFor="password">
              Password
            </label>
            <div className="relative">
               <span className="icon absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">lock</span>
               <input
                 className="field pl-11"
                 id="password"
                 name="password"
                 placeholder="••••••••"
                 onChange={updateField}
                 type="password"
                 value={form.password}
               />
            </div>
          </div>

          {mode === 'signup' && (
            <div className="mb-6 relative">
              <label className="label" htmlFor="role">
                Account Role
              </label>
              <div className="relative">
                 <span className="icon absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10">badge</span>
                 <select className="field pl-11 appearance-none" id="role" name="role" onChange={updateField} value={form.role}>
                   <option>Member</option>
                   <option>Admin</option>
                 </select>
                 <span className="icon absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 flex items-start gap-2 rounded-lg bg-ember/10 px-4 py-3 text-sm text-ember border border-ember/20">
              <span className="icon text-ember mt-0.5">error</span>
              <p>{error}</p>
            </div>
          )}

          <button className="button-primary w-full mt-2 py-3 text-base" disabled={loading} type="submit">
            {loading ? (
               <>
                 <span className="icon animate-spin">progress_activity</span>
                 Please wait...
               </>
            ) : mode === 'signup' ? (
              'Create account'
            ) : (
              'Log in to account'
            )}
          </button>
        </form>
      </section>
    </main>
  );
};

export default AuthPage;

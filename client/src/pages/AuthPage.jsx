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
    <main className="flex min-h-screen items-center justify-center bg-mist px-4 py-8">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-lg border border-line bg-white shadow-sm md:grid-cols-[1fr_1.1fr]">
        <div className="bg-ink p-8 text-white">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-200">Team Task Manager</p>
          <h1 className="mt-4 text-4xl font-bold leading-tight">Plan projects, assign work, and track progress.</h1>
          <p className="mt-4 max-w-md text-sm leading-6 text-slate-200">
            Admins manage projects and assignments. Members stay focused on the work assigned to them.
          </p>
        </div>

        <form className="p-8" onSubmit={submit}>
          <div className="mb-6 flex rounded-md border border-line bg-slate-50 p-1">
            {['login', 'signup'].map((item) => (
              <button
                className={`flex-1 rounded px-3 py-2 text-sm font-semibold capitalize ${mode === item ? 'bg-white text-brand shadow-sm' : 'text-slate-600'}`}
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
            <div className="mb-4">
              <label className="label" htmlFor="name">
                Name
              </label>
              <input className="field" id="name" name="name" onChange={updateField} value={form.name} />
            </div>
          )}

          <div className="mb-4">
            <label className="label" htmlFor="email">
              Email
            </label>
            <input className="field" id="email" name="email" onChange={updateField} type="email" value={form.email} />
          </div>

          <div className="mb-4">
            <label className="label" htmlFor="password">
              Password
            </label>
            <input
              className="field"
              id="password"
              name="password"
              onChange={updateField}
              type="password"
              value={form.password}
            />
          </div>

          {mode === 'signup' && (
            <div className="mb-4">
              <label className="label" htmlFor="role">
                Role
              </label>
              <select className="field" id="role" name="role" onChange={updateField} value={form.role}>
                <option>Member</option>
                <option>Admin</option>
              </select>
            </div>
          )}

          {error && <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

          <button className="button-primary w-full" disabled={loading} type="submit">
            {loading ? 'Please wait...' : mode === 'signup' ? 'Create account' : 'Login'}
          </button>
        </form>
      </section>
    </main>
  );
};

export default AuthPage;

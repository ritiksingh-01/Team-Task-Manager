import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import { useAuth } from './context/AuthContext.jsx';
import AuthPage from './pages/AuthPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import ProjectsPage from './pages/ProjectsPage.jsx';
import TasksPage from './pages/TasksPage.jsx';

const ProtectedPage = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <Layout>{children}</Layout>;
};

const App = () => (
  <Routes>
    <Route path="/auth" element={<AuthPage />} />
    <Route
      path="/"
      element={
        <ProtectedPage>
          <DashboardPage />
        </ProtectedPage>
      }
    />
    <Route
      path="/projects"
      element={
        <ProtectedPage>
          <ProjectsPage />
        </ProtectedPage>
      }
    />
    <Route
      path="/tasks"
      element={
        <ProtectedPage>
          <TasksPage />
        </ProtectedPage>
      }
    />
  </Routes>
);

export default App;

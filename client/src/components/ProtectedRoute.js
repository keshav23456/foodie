import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function ProtectedRoute({ children, role }) {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return <div className="text-center mt-5"><div className="spinner-border" /></div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role && user?.role !== role) {
    return (
      <div className="text-center mt-5">
        <h2>403 — Forbidden</h2>
        <p>You don't have permission to view this page.</p>
      </div>
    );
  }
  return children;
}

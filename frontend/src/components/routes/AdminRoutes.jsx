import React from 'react';
import { Route } from 'react-router-dom';
import Dashboard from '../admin/Dashboard';
import ProtectedRoute from '../auth/ProtectedRoute';

const AdminRoutes = () => {
  return (
    <>
      <Route
        path="/admin/dashboard"
        element={<ProtectedRoute admin={true}><Dashboard /></ProtectedRoute>}
      />
    </>
  )
}

export default AdminRoutes;
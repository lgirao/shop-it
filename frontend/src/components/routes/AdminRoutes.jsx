import React from 'react';
import { Route } from 'react-router-dom';
import Dashboard from '../admin/Dashboard';
import ProtectedRoute from '../auth/ProtectedRoute';
import ListProducts from '../admin/ListProducts';
import NewProduct from '../admin/NewProduct';

const AdminRoutes = () => {
  return (
    <>
      <Route
        path="/admin/dashboard"
        element={<ProtectedRoute admin={true}><Dashboard /></ProtectedRoute>}
      />
      <Route
        path="/admin/products"
        element={<ProtectedRoute admin={true}><ListProducts /></ProtectedRoute>}
      />
      <Route
        path="/admin/product/new"
        element={<ProtectedRoute admin={true}><NewProduct /></ProtectedRoute>}
      />
    </>
  )
}

export default AdminRoutes;
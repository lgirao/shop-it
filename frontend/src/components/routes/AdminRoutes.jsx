import React from 'react';
import { Route } from 'react-router-dom';
import Dashboard from '../admin/Dashboard';
import ProtectedRoute from '../auth/ProtectedRoute';
import ListProducts from '../admin/ListProducts';
import NewProduct from '../admin/NewProduct';
import UpdateProduct from '../admin/UpdateProduct';

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
      <Route
        path="/admin/products/:id"
        element={<ProtectedRoute admin={true}><UpdateProduct /></ProtectedRoute>}
      />
    </>
  )
}

export default AdminRoutes;
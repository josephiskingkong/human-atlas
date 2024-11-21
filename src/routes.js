import { lazy } from 'react';

const SlidePage = lazy(() => import('./pages/SlidePage'));
const AdminMenu = lazy(() => import('./pages/Admin/AdminMenu'));
const InDevPage = lazy(() => import('./pages/Admin/InDevPage'));
const CategoriesPage = lazy(() => import('./pages/Admin/CategoriesPage'));

const routes = [
  { path: '/slide/:id', element: <SlidePage /> },
  { path: '/admin/', element: <AdminMenu /> },
  { path: '/admin/in-dev/', element: <InDevPage /> },
  { path: '/admin/categories/', element: <CategoriesPage /> },
];

export default routes;
import { lazy } from 'react';

const SlidePage = lazy(() => import('./pages/SlidePage'));
const AdminMenu = lazy(() => import('./pages/Admin/AdminMenu'));
const InDevPage = lazy(() => import('./pages/Admin/InDevPage'));
const CategoriesPage = lazy(() => import('./pages/Admin/CategoriesPage'));
const SlidesListPage = lazy(() => import('./pages/Admin/SlidesListPage'))
const MainPage = lazy(() => import('./pages/MainPage'))

const routes = [
  { path: '/', element: <MainPage /> },
  { path: '/slide/:id', element: <SlidePage /> },
  { path: '/admin/slide/:id', element: <SlidePage /> },
  { path: '/admin/', element: <AdminMenu /> },
  { path: '/admin/in-dev/', element: <InDevPage /> },
  { path: '/admin/categories/', element: <CategoriesPage /> },
  { path: 'admin/categories/:categoryid', element: <SlidesListPage /> },
];

export default routes;
import { lazy } from 'react';

const SlidePage = lazy(() => import('./pages/SlidePage'));
const AdminMenu = lazy(() => import('./pages/Admin/AdminMenu'));
const InDevPage = lazy(() => import('./pages/Admin/InDevPage'));
const CategoriesPage = lazy(() => import('./pages/Admin/CategoriesPage'));
const SlidesListPage = lazy(() => import('./pages/Admin/SlidesListPage'))
const MainPage = lazy(() => import('./pages/MainPage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'));

const routes = [
  { path: '/human-atlas/', element: <MainPage /> },
  { path: '/human-atlas/slide/:id', element: <SlidePage /> },
  { path: '/human-atlas/admin/slide/:id', element: <SlidePage /> },
  { path: '/human-atlas/admin/', element: <AdminMenu /> },
  { path: '/human-atlas/admin/in-dev/', element: <InDevPage /> },
  { path: '/human-atlas/admin/categories/', element: <CategoriesPage /> },
  { path: '/human-atlas/admin/categories/:categoryid', element: <SlidesListPage /> },
  { path: '/human-atlas/profile', element: <ProfilePage /> },
];

export default routes;
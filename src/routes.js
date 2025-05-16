import { lazy } from "react";
import { Provider } from "react-redux";
import atlasStore from "./redux/atlas/atlas-store";

const SlidePage = lazy(() => import("./pages/SlidePage"));
const AdminMenu = lazy(() => import("./pages/Admin/AdminMenu"));
const InDevPage = lazy(() => import("./pages/Admin/InDevPage"));
const CategoriesPage = lazy(() => import("./pages/Admin/CategoriesPage"));
const SlidesListPage = lazy(() => import("./pages/Admin/SlidesListPage"));
const MainPage = lazy(() => import("./pages/MainPage"));
const TestsListPage = lazy(() => import("./pages/Admin/TestsListPage"));
const TestPageAdmin = lazy(() => import("./pages/Admin/TestPageAdmin"));
const HomePage = lazy(() => import("./pages/HomePage"));
const LibraryPage = lazy(() => import("./pages/LibraryPage"));
const TestsPage = lazy(() => import("./pages/TestsPage"));
const TestPage = lazy(() => import("./pages/TestPage"));

const routes = [
  { path: "/human-atlas/", element: <MainPage /> },
  {
    path: "/human-atlas/slide/:id",
    element: (
      <Provider store={atlasStore}>
        <SlidePage />
      </Provider>
    ),
  },
  {
    path: "/human-atlas/admin/slide/:id",
    element: (
      <Provider store={atlasStore}>
        <SlidePage />
      </Provider>
    ),
  },
  { path: "/human-atlas/admin/", element: <AdminMenu /> },
  { path: "/human-atlas/admin/in-dev/", element: <InDevPage /> },
  { path: "/human-atlas/admin/categories/", element: <CategoriesPage /> },
  {
    path: "/human-atlas/admin/categories/:categoryid",
    element: <SlidesListPage />,
  },
  { path: "/human-atlas/admin/tests", element: <CategoriesPage /> },
  { path: "/human-atlas/admin/tests/:categoryid", element: <TestsListPage /> },
  { path: "/human-atlas/admin/test/:id", element: <TestPageAdmin /> },
  { path: "/human-atlas/home", element: <HomePage /> },
  { path: "/human-atlas/library", element: <LibraryPage /> },
  { path: "/human-atlas/tests", element: <TestsPage /> },
  { path: "/human-atlas/tests/:id", element: <TestPage /> },
];

export default routes;

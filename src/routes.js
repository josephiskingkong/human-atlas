import { lazy } from "react";
import { Provider } from "react-redux";
import atlasStore from "./redux/atlas/atlas-store";

const SlidePage = lazy(() => import("./pages/SlidePage"));
const AdminMenu = lazy(() => import("./pages/Admin/AdminMenu"));
const InDevPage = lazy(() => import("./pages/Admin/InDevPage"));
const CategoriesPage = lazy(() => import("./pages/Admin/CategoriesPage"));
const TestCategoriesPage = lazy(() =>
  import("./pages/Admin/TestCategoriesPage")
);
const SlidesListPage = lazy(() => import("./pages/Admin/SlidesListPage"));
const MainPage = lazy(() => import("./pages/MainPage"));
const TestsListPage = lazy(() => import("./pages/Admin/TestsListPage"));
const TestPageAdmin = lazy(() => import("./pages/Admin/TestPageAdmin"));
const HomePage = lazy(() => import("./pages/HomePage"));
const LibraryPage = lazy(() => import("./pages/LibraryPage"));
const TestsPage = lazy(() => import("./pages/TestsPage"));
const TestPage = lazy(() => import("./pages/TestPage"));
const AboutProject = lazy(() => import("./pages/AboutProject"));
const LoginPage = lazy(() => import("./pages/LoginPage"));

const routes = [
  { path: "/", element: <HomePage /> },
  {
    path: "/slide/:id",
    element: (
      <Provider store={atlasStore}>
        <SlidePage />
      </Provider>
    ),
  },
  { path: "/admin/auth", element: <LoginPage /> },
  {
    path: "/admin/slide/:id",
    element: (
      <Provider store={atlasStore}>
        <SlidePage />
      </Provider>
    ),
  },
  { path: "/admin/home", element: <MainPage /> },
  { path: "/admin/", element: <AdminMenu /> },
  { path: "/admin/in-dev/", element: <InDevPage /> },
  { path: "/admin/categories/", element: <CategoriesPage /> },
  {
    path: "/admin/categories/:categoryid/",
    element: <SlidesListPage />,
  },
  {
    path: "/admin/categories/:categoryid/:subcategoryid/",
    element: <SlidesListPage />,
  },
  { path: "/admin/tests", element: <TestCategoriesPage /> },
  { path: "/admin/tests/:categoryId", element: <TestsListPage /> },
  { path: "/admin/test/:id", element: <TestPageAdmin /> },
  { path: "/admin/test/add", element: <TestPageAdmin /> },
  { path: "/library", element: <LibraryPage /> },
  { path: "/tests", element: <TestsPage /> },
  { path: "/tests/:testId", element: <TestPage /> },
  { path: "/about", element: <AboutProject /> },
];

export default routes;

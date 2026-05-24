import { createBrowserRouter } from "react-router-dom";

import Home from "../Pages/Home";
import MainLayout from "../Layouts/MainLayout";
import ErrorPage from "../Pages/ErrorPage";
import LoadingSpinnerCopy from "../Components/LoadingSpinnercopy";

import Login from "../Pages/Login";
import Register from "../Pages/Register";
import AuthLayout from "../Layouts/AuthLayout";
import ForgotPassword from "../Pages/ForgotPassword";

import Profile from "../Pages/Profile";
import PrivatRoute from "../Provider/PrivatRoute";

import AddIssues from "../Pages/AddIssues";
import Issues from "../Pages/Issues";
import MyIssues from "../Pages/MyIssues";
import MyContribution from "../Pages/MyContribution";
import AllIssues from "../Pages/AllIssues";
import IssueDetails from "../Pages/IssueDetails";
import UpdateIssueModal from "../Pages/UpdateIssueModal";

import AboutUsSection from "../Pages/About";
import Contact from "../Pages/Contact";
import Blog from "../Pages/Blog";
import Support from "../Pages/Support";
import PrivacyTerms from "../Pages/PrivacyTerms";

import DashboardLayout from "../Layouts/DashboardLayout";
import DashboardHome from "../Pages/dashboard/DashboardHome";
import ProfileD from "../Pages/dashboard/ProfileD";
import MyContributions from "../Pages/dashboard/MyContributions";
import ManageIssues from "../Pages/dashboard/ManageIssues";
import ManageUsers from "../Pages/dashboard/ManageUsers";
import Reports from "../Pages/dashboard/Reports";

const API_BASE = "https://b12-a10-copy-server.vercel.app";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    hydrateFallbackElement: (
      <div>
        <LoadingSpinnerCopy />
      </div>
    ),
    children: [
      {
        index: true,
        element: <Home />,
        loader: () => fetch(`${API_BASE}/latest-issues`),
        errorElement: <ErrorPage />,
      },
      {
        path: "issues",
        element: <Issues />,
        loader: () => fetch(`${API_BASE}/issues`),
        errorElement: <ErrorPage />,
      },
      {
        path: "issues/:id",
        element: <IssueDetails />,
        errorElement: <ErrorPage />,
      },
      {
        path: "issues-details/:id",
        element: <IssueDetails />,
        errorElement: <ErrorPage />,
      },
      {
        path: "all-issues",
        element: <AllIssues />,
        loader: () => fetch(`${API_BASE}/issues`),
        errorElement: <ErrorPage />,
      },
      {
        path: "my-issues",
        element: (
          <PrivatRoute>
            <MyIssues />
          </PrivatRoute>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: "my-contribution",
        element: (
          <PrivatRoute>
            <MyContribution />
          </PrivatRoute>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: "add-issues",
        element: (
          <PrivatRoute>
            <AddIssues />
          </PrivatRoute>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: "update-issues/:id",
        element: (
          <PrivatRoute>
            <UpdateIssueModal />
          </PrivatRoute>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: "about",
        element: <AboutUsSection />,
        errorElement: <ErrorPage />,
      },
      {
        path: "contact",
        element: <Contact />,
        errorElement: <ErrorPage />,
      },
      {
        path: "blog",
        element: <Blog />,
        errorElement: <ErrorPage />,
      },
      {
        path: "support",
        element: <Support />,
        errorElement: <ErrorPage />,
      },
      {
        path: "privacy-policy",
        element: <PrivacyTerms />,
        errorElement: <ErrorPage />,
      },
      {
        path: "my-profile",
        element: (
          <PrivatRoute>
            <Profile />
          </PrivatRoute>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: "auth",
        element: <AuthLayout />,
        children: [
          {
            path: "login",
            element: <Login />,
          },
          {
            path: "register",
            element: <Register />,
          },
          {
            path: "forgot",
            element: <ForgotPassword />,
          },
        ],
      },
      {
        path: "*",
        element: <ErrorPage />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivatRoute>
        <DashboardLayout />
      </PrivatRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <DashboardHome />,
      },
      {
        path: "profile",
        element: <ProfileD />,
      },
      {
        path: "my-issues",
        element: <MyIssues />,
      },
      {
        path: "my-contributions",
        element: <MyContributions />,
      },
      {
        path: "manage-issues",
        element: <ManageIssues />,
      },
      {
        path: "manage-users",
        element: <ManageUsers />,
      },
      {
        path: "reports",
        element: <Reports />,
      },
    ],
  },
]);

export default router;
import { createBrowserRouter } from "react-router-dom";
// import App from "../App";
import Home from "../Pages/Home";

import MainLayout from "../Layouts/MainLayout";
import ErrorPage from "../Pages/ErrorPage";
// import ProductsDetails from "../Pages/AppDetails";
// import Installation from "../Pages/Installation";
// import AppDetails from "../Pages/AppDetails";
// import LoadingSpinner from "../Components/LoadingSpinner";
import LoadingSpinnerCopy from "../Components/LoadingSpinnercopy";
import Login from "../Pages/Login";
import Register from "../Pages/Register";
import AuthLayout from "../Layouts/AuthLayout";
import Profile from "../Pages/Profile";
import PrivatRoute from "../Provider/PrivatRoute";

import ForgotPassword from "../Pages/ForgotPassword";
import AddIssues from "../Pages/AddIssues";
import Issues from "../Pages/Issues";
import MyIssues from "../Pages/MyIssues";
import MyContribution from "../Pages/MyContribution";
import AllIssues from "../Pages/AllIssues";
import IssueDetails from "../Pages/IssueDetails";
import UpdateIssueModal from "../Pages/UpdateIssueModal";
// <<<<<<< HEAD
import DashboardLayout from "../Layouts/DashboardLayout";
import DashboardHome from "../Pages/dashboard/DashboardHome";
import ProfilePage from "../Pages/dashboard/ProfilePage";
import MyDonationRequests from "../Pages/dashboard/MyDonationRequests";
import CreateDonationRequest from "../Pages/dashboard/CreateDonationRequest";
import EditDonationRequest from "../Pages/dashboard/EditDonationRequest";
import DonationRequestDetails from "../Pages/dashboard/DonationRequestDetails";
import AllUsersPage from "../Pages/dashboard/AllUsersPage";
import AllDonationRequestsPage from "../Pages/dashboard/AllDonationRequestsPage";
import SearchDonors from "../Pages/SearchDonors";
import PublicDonationRequests from "../Pages/PublicDonationRequests";
import BloodDonationRequestDetails from "../Pages/donation/BloodDonationRequestDetails";
import FundingPage from "../Pages/FundingPage";
// import DonationRequestDetails from "../Pages/donation/DonationRequestDetails";
// =======
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
// >>>>>>> a714453 (m)
// import UpdateIssueModal from "../Pages/UpdateIssueModal";
// import UpdateIssueModal from "../Pages/UpdateIssueModal";
// import UpdateIssueModal from "../Pages/UpdateIssueModal";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    hydrateFallbackElement: (
      <div>
        {" "}
        <LoadingSpinnerCopy />{" "}
      </div>
    ),
    children: [
      {
        index: true,
        element: <Home />,
        loader: () =>
          fetch("https://b12-a10-copy-server.vercel.app/latest-issues"),
        errorElement: <ErrorPage />,
      },
      {
        path: "/issues",
        element: <Issues />,
        loader: () => fetch("https://b12-a10-copy-server.vercel.app/issues"),
        errorElement: <ErrorPage />,
      },
      {
        path: "/all-issues",
        element: <AllIssues />,
        loader: () => fetch("https://b12-a10-copy-server.vercel.app/issues"),
        errorElement: <ErrorPage />,
      },
      {
        path: "/search-donors",
        element: <SearchDonors />,
        errorElement: <ErrorPage />,
      },
      { path: "/donation-requests", element: <PublicDonationRequests /> },
      {
        path: "/donation-requests/:id",
        element: (
          <PrivatRoute>
            <BloodDonationRequestDetails />
          </PrivatRoute>
        ),
      },
      {
        path: "/funding",
        element: (
          <PrivatRoute>
            <FundingPage />
          </PrivatRoute>
        ),
      },
      
      {
        path: "/my-issues",
        element: (
          <PrivatRoute>
            <MyIssues />
          </PrivatRoute>
        ),
        loader: ({ params }) =>
          fetch(`https://b12-a10-copy-server.vercel.app/issues/${params.id}`),

        errorElement: <ErrorPage />,
      },
      {
        path: "/update-issues/:id",
        element: (
          <PrivatRoute>
            <UpdateIssueModal />
          </PrivatRoute>
        ),

        errorElement: <ErrorPage />,
      },
      {
        path: "/my-contribution",
        element: (
          <PrivatRoute>
            <MyContribution />
          </PrivatRoute>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: "/add-issues",
        element: (
          <PrivatRoute>
            <AddIssues />
          </PrivatRoute>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: "/about",
        element: <AboutUsSection />,
        errorElement: <ErrorPage />,
      },
      {
        path: "/contact",
        element: <Contact />,
        errorElement: <ErrorPage />,
      },
      {
        path: "/blog",
        element: <Blog />,
        errorElement: <ErrorPage />,
      },
      {
        path: "/support",
        element: <Support />,
        errorElement: <ErrorPage />,
      },
      {
        path: "/privacy-policy",
        element: <PrivacyTerms />,
        errorElement: <ErrorPage />,
      },

      {
        path: "/issues-details/:id",
        element: <IssueDetails />,
        errorElement: <ErrorPage />,
      },

      {
        path: "/*",
        element: <ErrorPage />,
      },
      {
        path: "/my-profile",
        element: <Profile />,
      },

      {
        path: "/auth",
        element: <AuthLayout />,
        children: [
          {
            path: "/auth/login",
            element: <Login />,
          },
          {
            path: "/auth/register",
            element: <Register />,
          },
          {
            path: "/auth/forgot",
            element: <ForgotPassword />,
          },
        ],
      },
    ],
  },
// <<<<<<< HEAD
  {
    path: "/dashboard",
    element: (
      <PrivatRoute>
        <DashboardLayout />
      </PrivatRoute>
    ),
    children: [
      { index: true, element: <DashboardHome /> }, // /dashboard
      { path: "profile", element: <ProfilePage /> },
      { path: "my-donation-requests", element: <MyDonationRequests /> },
      { path: "create-donation-request", element: <CreateDonationRequest /> },
      { path: "edit-donation-request/:id", element: <EditDonationRequest /> },
      { path: "all-users", element: <AllUsersPage /> },
      {
        path: "all-blood-donation-request",
        element: <AllDonationRequestsPage />,
      },

      // { path: "all-users", element: <AllUsersPage /> },
      // admin only
    ],
  },
  {
    path: "/donation-requests/:id",
    element: (
      <PrivatRoute>
        <DonationRequestDetails />
      </PrivatRoute>
    ),
  },
// =======
  // {
  //   path: "*",
  //   element: <ErrorPage />,
  // }
  {
  path: "/dashboard",
  element: <DashboardLayout />, // wrap with PrivateRoute if your dashboard is private
  children: [
    { index: true, element: <DashboardHome /> },
    { path: "profile", element: <Profile /> },

    // user
    { path: "my-issues", element: <MyIssues /> },
    { path: "my-contributions", element: <MyContribution /> },

    // admin
    { path: "manage-issues", element: <ManageIssues /> },
    { path: "manage-users", element: <ManageUsers /> },
    { path: "reports", element: <Reports /> },
  ],
}
// >>>>>>> a714453 (m)
]);

// console.log(router);

export default router;

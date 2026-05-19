import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../layout/MainLayout";

import ProtectedRoute from "../components/ProtectedRoute";

import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import EmployeesPage from "../pages/EmployeesPage";
import VehiclesPage from "../pages/VehiclesPage";
import EntryRequestsPage from "../pages/EntryRequestsPage";
import EntryLogsPage from "../pages/EntryLogsPage";

const router = createBrowserRouter([

    {
        path: "/",
        element: <LoginPage />,
    },

    {
        element: (
            <ProtectedRoute>
                <MainLayout />
            </ProtectedRoute>
        ),

        children: [
            {
                path: "/dashboard",
                element: <DashboardPage />,
            },
            {
                path: "/employees",
                element: <EmployeesPage />,
            },
            {
                path: "/vehicles",
                element: <VehiclesPage />,
            },

            {
                path: "/entry-requests",
                element: <EntryRequestsPage />,
            },

            {
                path: "/entry-logs",
                element: <EntryLogsPage />,
            },
        ],
    },

]);

export default router;
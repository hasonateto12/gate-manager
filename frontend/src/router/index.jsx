import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../layout/MainLayout";

import ProtectedRoute from "../components/ProtectedRoute";
import RoleProtectedRoute from "../components/RoleProtectedRoute";

import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import EmployeesPage from "../pages/EmployeesPage";
import VehiclesPage from "../pages/VehiclesPage";
import EntryRequestsPage from "../pages/EntryRequestsPage";
import EntryLogsPage from "../pages/EntryLogsPage";
import GuardPage from "../pages/GuardPage";

const router = createBrowserRouter([

    // LOGIN
    {
        path: "/",
        element: <LoginPage />,
    },

    // ADMIN ROUTES
    {
        element: (

            <RoleProtectedRoute allowedRoles={["admin"]}>

                <ProtectedRoute>
                    <MainLayout />
                </ProtectedRoute>

            </RoleProtectedRoute>
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

    // GUARD ROUTE
    {
        path: "/guard",

        element: (

            <RoleProtectedRoute allowedRoles={["guard"]}>

                <ProtectedRoute>
                    <GuardPage />
                </ProtectedRoute>

            </RoleProtectedRoute>
        ),
    },

]);

export default router;
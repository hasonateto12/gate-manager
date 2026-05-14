import { createBrowserRouter } from "react-router-dom";

import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import EmployeesPage from "../pages/EmployeesPage";
import VehiclesPage from "../pages/VehiclesPage";

const router = createBrowserRouter([
    {
        path: "/",
        element: <LoginPage />,
    },
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
]);

export default router;
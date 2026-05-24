import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function RoleProtectedRoute({

                                children,
                                allowedRoles,

                            }) {

    const { user } = useAuth();

    // NOT LOGGED IN
    if (!user) {

        return <Navigate to="/" />;
    }

    // ROLE NOT ALLOWED
    if (!allowedRoles.includes(user.role)) {

        // ADMIN TRYING TO ENTER GUARD
        if (user.role === "admin") {

            return <Navigate to="/dashboard" />;
        }

        // GUARD TRYING TO ENTER ADMIN
        if (user.role === "guard") {

            return <Navigate to="/guard" />;
        }

        // DEFAULT
        return <Navigate to="/" />;
    }

    return children;
}

export default RoleProtectedRoute;
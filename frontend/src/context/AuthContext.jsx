import {

    createContext,
    useContext,
    useEffect,
    useState,

} from "react";

import api from "../api/axios";


const AuthContext = createContext();


export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);


    useEffect(() => {

        loadUser();

    }, []);


    const loadUser = async () => {

        try {

            const token = localStorage.getItem("token");

            if (!token) {
                setLoading(false);
                return;
            }

            const response = await api.get("/auth/profile");

            setUser(response.data.user);

        } catch (error) {

            console.error(error);

            localStorage.removeItem("token");
        }

        setLoading(false);
    };


    const login = (token, userData) => {

        localStorage.setItem("token", token);

        setUser(userData);
    };


    const logout = () => {

        localStorage.removeItem("token");

        setUser(null);
    };


    return (

        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                loading,
            }}
        >

            {children}

        </AuthContext.Provider>
    );
}


export function useAuth() {

    return useContext(AuthContext);
}
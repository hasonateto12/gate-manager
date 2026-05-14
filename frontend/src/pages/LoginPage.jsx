import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Box,
    Button,
    Paper,
    TextField,
    Typography,
} from "@mui/material";

import api from "../api/axios";

function LoginPage() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleLogin = async (e) => {

        e.preventDefault();

        try {

            const response = await api.post(
                "/auth/login",
                formData
            );

            console.log(response.data);

            localStorage.setItem(
                "token",
                response.data.token
            );

            navigate("/dashboard");

        } catch (error) {

            console.error(error);

            alert("Login failed");
        }
    };

    return (

        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                backgroundColor: "#f5f5f5",
            }}
        >

            <Paper
                elevation={3}
                sx={{
                    padding: 4,
                    width: 400,
                }}
            >

                <Typography
                    variant="h4"
                    mb={3}
                    textAlign="center"
                >
                    Gate Manager Login
                </Typography>

                <form onSubmit={handleLogin}>

                    <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        margin="normal"
                        onChange={handleChange}
                    />

                    <TextField
                        fullWidth
                        label="Password"
                        name="password"
                        type="password"
                        margin="normal"
                        onChange={handleChange}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 2 }}
                    >
                        Login
                    </Button>

                </form>

            </Paper>

        </Box>
    );
}

export default LoginPage;
import { useState } from "react";

import {
    Box,
    Button,
    Paper,
    TextField,
    Typography,
    Alert,
    CircularProgress,
} from "@mui/material";

import { useNavigate } from "react-router-dom";

import api from "../api/axios";

import { useAuth } from "../context/AuthContext";

function LoginPage() {

    const navigate = useNavigate();

    const { login } = useAuth();

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleLogin = async (e) => {

        e.preventDefault();

        setError("");

        setLoading(true);

        try {

            const response = await api.post(
                "/auth/login",
                formData
            );

            console.log("LOGIN RESPONSE:", response.data);

            // SAVE TOKEN + USER
            login(
                response.data.token,
                response.data.user
            );

            // ROLE BASED REDIRECT
            if (response.data.user?.role === "admin") {

                navigate("/dashboard");

            } else if (response.data.user?.role === "guard") {

                navigate("/guard");

            } else {

                navigate("/");
            }

        } catch (error) {

            console.error("LOGIN ERROR:", error);

            setError(
                error.response?.data?.error ||
                "שגיאה בהתחברות"
            );

        } finally {

            setLoading(false);
        }
    };

    return (

        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#f4f6f8",
            }}
        >

            <Paper
                elevation={4}
                sx={{
                    width: 400,
                    p: 4,
                    borderRadius: 3,
                }}
            >

                <Typography
                    variant="h4"
                    fontWeight="bold"
                    textAlign="center"
                    mb={4}
                >
                    מערכת ניהול שערים
                </Typography>

                {
                    error && (
                        <Alert
                            severity="error"
                            sx={{ mb: 2 }}
                        >
                            {error}
                        </Alert>
                    )
                }

                <Box
                    component="form"
                    onSubmit={handleLogin}
                >

                    <TextField
                        fullWidth
                        label="אימייל"
                        name="email"
                        type="email"
                        margin="normal"
                        value={formData.email}
                        onChange={handleChange}
                    />

                    <TextField
                        fullWidth
                        label="סיסמה"
                        name="password"
                        type="password"
                        margin="normal"
                        value={formData.password}
                        onChange={handleChange}
                    />

                    <Button
                        fullWidth
                        variant="contained"
                        type="submit"
                        size="large"
                        disabled={loading}
                        sx={{
                            mt: 3,
                            py: 1.5,
                        }}
                    >

                        {
                            loading ? (
                                <CircularProgress size={24} />
                            ) : (
                                "התחבר"
                            )
                        }

                    </Button>

                </Box>

            </Paper>

        </Box>
    );
}

export default LoginPage;
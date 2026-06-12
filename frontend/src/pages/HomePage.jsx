// pages/HomePage.jsx

import {
    Box,
    Typography,
    Grid,
    Paper,
    Button,
    Stack
} from "@mui/material";

import {
    People,
    DirectionsCar,
    Assignment,
    FactCheck
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

export default function HomePage() {

    const navigate = useNavigate();

    return (

        <Box>

            <Typography
                variant="h3"
                fontWeight="bold"
                gutterBottom
            >
                ברוך הבא למערכת ניהול שערים
            </Typography>

            <Typography
                variant="h6"
                color="text.secondary"
                mb={5}
            >
                ניהול עובדים, רכבים ובקשות כניסה במקום אחד
            </Typography>

            <Grid container spacing={3}>

                <Grid item xs={12} md={6}>
                    <Paper
                        elevation={4}
                        sx={{
                            p: 4,
                            borderRadius: 4,
                            textAlign: "center"
                        }}
                    >
                        <People sx={{ fontSize: 60 }} />
                        <Typography variant="h5">
                            עובדים
                        </Typography>

                        <Button
                            sx={{ mt: 2 }}
                            variant="contained"
                            onClick={() => navigate("/employees")}
                        >
                            מעבר לעובדים
                        </Button>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper
                        elevation={4}
                        sx={{
                            p: 4,
                            borderRadius: 4,
                            textAlign: "center"
                        }}
                    >
                        <DirectionsCar sx={{ fontSize: 60 }} />
                        <Typography variant="h5">
                            רכבים
                        </Typography>

                        <Button
                            sx={{ mt: 2 }}
                            variant="contained"
                            onClick={() => navigate("/vehicles")}
                        >
                            מעבר לרכבים
                        </Button>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper
                        elevation={4}
                        sx={{
                            p: 4,
                            borderRadius: 4,
                            textAlign: "center"
                        }}
                    >
                        <Assignment sx={{ fontSize: 60 }} />
                        <Typography variant="h5">
                            בקשות כניסה
                        </Typography>

                        <Button
                            sx={{ mt: 2 }}
                            variant="contained"
                            onClick={() => navigate("/entry-requests")}
                        >
                            מעבר לבקשות
                        </Button>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper
                        elevation={4}
                        sx={{
                            p: 4,
                            borderRadius: 4,
                            textAlign: "center"
                        }}
                    >
                        <FactCheck sx={{ fontSize: 60 }} />
                        <Typography variant="h5">
                            לוג כניסות
                        </Typography>

                        <Button
                            sx={{ mt: 2 }}
                            variant="contained"
                            onClick={() => navigate("/entry-logs")}
                        >
                            מעבר ללוגים
                        </Button>
                    </Paper>
                </Grid>

            </Grid>

        </Box>
    );
}
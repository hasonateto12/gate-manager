import {

    useEffect,
    useState,

} from "react";

import api from "../api/axios";

import {

    Grid,
    Paper,
    Typography,
    Box,
    CircularProgress,
    Alert,

} from "@mui/material";


function DashboardPage() {

    const [stats, setStats] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    useEffect(() => {

        fetchStats();

    }, []);


    const fetchStats = async () => {

        try {

            setLoading(true);

            const response =
                await api.get("/dashboard/stats");

            setStats(response.data);

        } catch (error) {

            console.error(error);

            setError("שגיאה בטעינת נתונים");

        } finally {

            setLoading(false);
        }
    };


    if (loading) {

        return (

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    mt: 5,
                }}
            >

                <CircularProgress />

            </Box>
        );
    }


    if (error) {

        return (

            <Alert severity="error">

                {error}

            </Alert>
        );
    }


    return (

        <Box>

            <Typography
                variant="h4"
                fontWeight="bold"
                mb={4}
            >
                לוח בקרה
            </Typography>


            <Grid
                container
                spacing={3}
            >

                {/* TOTAL */}

                <Grid
                    item
                    xs={12}
                    md={3}
                >

                    <Paper
                        elevation={3}
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            textAlign: "center",
                        }}
                    >

                        <Typography
                            variant="h6"
                            mb={1}
                        >
                            סך בקשות
                        </Typography>


                        <Typography
                            variant="h3"
                            fontWeight="bold"
                        >
                            {stats.total}
                        </Typography>

                    </Paper>

                </Grid>


                {/* PENDING */}

                <Grid
                    item
                    xs={12}
                    md={3}
                >

                    <Paper
                        elevation={3}
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            textAlign: "center",
                            backgroundColor: "#fff8e1",
                        }}
                    >

                        <Typography
                            variant="h6"
                            mb={1}
                        >
                            ממתינות
                        </Typography>


                        <Typography
                            variant="h3"
                            fontWeight="bold"
                            color="warning.main"
                        >
                            {stats.pending}
                        </Typography>

                    </Paper>

                </Grid>


                {/* APPROVED */}

                <Grid
                    item
                    xs={12}
                    md={3}
                >

                    <Paper
                        elevation={3}
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            textAlign: "center",
                            backgroundColor: "#e8f5e9",
                        }}
                    >

                        <Typography
                            variant="h6"
                            mb={1}
                        >
                            מאושרות
                        </Typography>


                        <Typography
                            variant="h3"
                            fontWeight="bold"
                            color="success.main"
                        >
                            {stats.approved}
                        </Typography>

                    </Paper>

                </Grid>


                {/* REJECTED */}

                <Grid
                    item
                    xs={12}
                    md={3}
                >

                    <Paper
                        elevation={3}
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            textAlign: "center",
                            backgroundColor: "#ffebee",
                        }}
                    >

                        <Typography
                            variant="h6"
                            mb={1}
                        >
                            נדחו
                        </Typography>


                        <Typography
                            variant="h3"
                            fontWeight="bold"
                            color="error.main"
                        >
                            {stats.rejected}
                        </Typography>

                    </Paper>

                </Grid>

            </Grid>

        </Box>
    );
}

export default DashboardPage;
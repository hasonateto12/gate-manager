import {
    useEffect,
    useState,
    useMemo,
} from "react";

import api from "../api/axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {

    Grid,
    Paper,
    Typography,
    Box,
    Button,
    CircularProgress,
    Alert,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,

} from "@mui/material";

import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Legend,
} from "recharts";


function DashboardPage() {

    const [stats, setStats] = useState(null);

    const [recentRequests, setRecentRequests] =
        useState([]);

    const [vehicles, setVehicles] = useState([]);
    const [logs, setLogs] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    useEffect(() => {

        fetchDashboard();

    }, []);


    const fetchDashboard = async () => {

        try {

            setLoading(true);


            // STATS

            const statsResponse =
                await api.get("/dashboard/stats");


            const vehiclesResponse =
                await api.get("/vehicles");

            setVehicles(vehiclesResponse.data || []);

            const logsResponse =
                await api.get("/entry-logs");

            setLogs(logsResponse.data || []);
            setStats(statsResponse.data);


            // RECENT REQUESTS

            const requestsResponse =
                await api.get("/entry-requests");

            setRecentRequests(

                requestsResponse.data.slice(0, 5)
            );

        } catch (error) {

            console.error(error);

            setError("שגיאה בטעינת נתונים");

        } finally {

            setLoading(false);
        }
    };


    const getStatusChip = (status) => {

        if (status === "approved") {

            return (
                <Chip
                    label="מאושר"
                    color="success"
                />
            );
        }

        if (status === "pending") {

            return (
                <Chip
                    label="ממתין"
                    color="warning"
                />
            );
        }

        if (status === "rejected") {

            return (
                <Chip
                    label="נדחה"
                    color="error"
                />
            );
        }

        return (
            <Chip
                label={status}
            />
        );
    };

    const exportDashboardPDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(20);
        doc.text("Gate Manager - Dashboard Report", 14, 20);

        doc.setFontSize(11);
        doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);

        doc.setFontSize(14);
        doc.text("Summary", 14, 45);

        autoTable(doc, {
            startY: 52,
            head: [["Metric", "Value"]],
            body: [
                ["Total Requests", stats?.total || 0],
                ["Pending Requests", stats?.pending || 0],
                ["Approved Requests", stats?.approved || 0],
                ["Rejected Requests", stats?.rejected || 0],
                ["Total Vehicles", totalVehicles],
                ["Approved Vehicles", approvedVehicles],
                ["Vehicles Inside", insideVehicles],
                ["Vehicles Outside", outsideVehicles],
                ["Today Entries", todayEntries],
            ],
        });

        autoTable(doc, {
            startY: doc.lastAutoTable.finalY + 15,
            head: [["Plate Number", "Driver", "Company", "Entry Time", "Exit Time", "Status"]],
            body: logs.slice(0, 10).map((log) => [
                log.plate_number || "-",
                log.driver_name || "-",
                log.company_name || "-",
                log.entry_time
                    ? new Date(log.entry_time).toLocaleString("he-IL")
                    : "-",
                log.exit_time
                    ? new Date(log.exit_time).toLocaleString("he-IL")
                    : "-",
                log.current_status || "-",
            ]),
        });

        doc.save("dashboard-report.pdf");
    };


    // CHART DATA

    const chartData = [

        {
            name: "מאושרות",
            value: Number(stats?.approved || 0),
            color: "#4caf50",
        },

        {
            name: "ממתינות",
            value: Number(stats?.pending || 0),
            color: "#ff9800",
        },

        {
            name: "נדחו",
            value: Number(stats?.rejected || 0),
            color: "#f44336",
        },
    ];



    const insideVehicles =
        logs.filter(
            (log) => log.current_status === "inside"
        ).length;

    const outsideVehicles =
        logs.filter(
            (log) => log.current_status === "outside"
        ).length;

    const approvedVehicles =
        vehicles.filter(
            (v) => Number(v.is_approved) === 1
        ).length;

    const totalVehicles =
        vehicles.length;

    const todayEntries =
        logs.filter((log) => {
            if (!log.entry_time) return false;

            return (
                new Date(log.entry_time)
                    .toDateString() ===
                new Date().toDateString()
            );
        }).length;


    const vehicleStatusData = [
        {
            name: "בפנים",
            value: insideVehicles,
        },
        {
            name: "בחוץ",
            value: outsideVehicles,
        },
    ];


    const entriesPerDayData = useMemo(() => {

        const grouped = {};

        logs.forEach((log) => {

            if (!log.entry_time) return;

            const day = new Date(log.entry_time)
                .toLocaleDateString("he-IL");

            grouped[day] =
                (grouped[day] || 0) + 1;
        });

        return Object.entries(grouped)
            .map(([date, count]) => ({
                date,
                count,
            }))
            .slice(-7);

    }, [logs]);



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

            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={4}
            >
                <Typography
                    variant="h4"
                    fontWeight="bold"
                >
                    לוח בקרה
                </Typography>

                <Button
                    variant="contained"
                    onClick={exportDashboardPDF}
                >
                    ייצוא דוח PDF
                </Button>
            </Box>


            {/* CARDS */}

            <Grid
                container
                spacing={3}
                mb={4}
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

                    <Paper
                        elevation={3}
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            mb: 4,
                        }}
                    >
                        <Typography
                            variant="h5"
                            fontWeight="bold"
                            mb={3}
                        >
                            מצב רכבים במערכת
                        </Typography>

                        <Box
                            sx={{
                                width: "100%",
                                height: 350,
                            }}
                        >
                            <ResponsiveContainer>
                                <BarChart
                                    data={vehicleStatusData}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />

                                    <XAxis dataKey="name" />

                                    <YAxis />

                                    <Tooltip />

                                    <Legend />

                                    <Bar
                                        dataKey="value"
                                        name="כמות"
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </Box>
                    </Paper>

                    <Paper
                        elevation={3}
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            mb: 4,
                        }}
                    >
                        <Typography
                            variant="h5"
                            fontWeight="bold"
                            mb={3}
                        >
                            כניסות לפי ימים
                        </Typography>

                        <Box
                            sx={{
                                width: "100%",
                                height: 350,
                            }}
                        >
                            <ResponsiveContainer>
                                <BarChart
                                    data={entriesPerDayData}
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                    />

                                    <XAxis
                                        dataKey="date"
                                    />

                                    <YAxis />

                                    <Tooltip />

                                    <Legend />

                                    <Bar
                                        dataKey="count"
                                        name="כניסות"
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </Box>
                    </Paper>

                </Grid>

            </Grid>


            <Grid container spacing={3} mb={4}>

                <Grid item xs={12} md={3}>
                    <Paper sx={{ p: 3, textAlign: "center", borderRadius: 3 }}>
                        <Typography variant="h6">
                            סה״כ רכבים
                        </Typography>

                        <Typography variant="h3" fontWeight="bold">
                            {totalVehicles}
                        </Typography>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Paper
                        sx={{
                            p: 3,
                            textAlign: "center",
                            borderRadius: 3,
                            backgroundColor: "#e8f5e9",
                        }}
                    >
                        <Typography variant="h6">
                            רכבים במפעל
                        </Typography>

                        <Typography
                            variant="h3"
                            fontWeight="bold"
                            color="success.main"
                        >
                            {insideVehicles}
                        </Typography>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Paper
                        sx={{
                            p: 3,
                            textAlign: "center",
                            borderRadius: 3,
                        }}
                    >
                        <Typography variant="h6">
                            רכבים מאושרים
                        </Typography>

                        <Typography
                            variant="h3"
                            fontWeight="bold"
                        >
                            {approvedVehicles}
                        </Typography>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Paper
                        sx={{
                            p: 3,
                            textAlign: "center",
                            borderRadius: 3,
                            backgroundColor: "#e3f2fd",
                        }}
                    >
                        <Typography variant="h6">
                            כניסות היום
                        </Typography>

                        <Typography
                            variant="h3"
                            fontWeight="bold"
                            color="primary"
                        >
                            {todayEntries}
                        </Typography>
                    </Paper>
                </Grid>

            </Grid>

            {/* CHART */}

            <Paper
                elevation={3}
                sx={{
                    p: 3,
                    borderRadius: 3,
                    mb: 4,
                }}
            >

                <Typography
                    variant="h5"
                    fontWeight="bold"
                    mb={3}
                >
                    סטטיסטיקת בקשות
                </Typography>


                <Box
                    sx={{
                        width: "100%",
                        height: 350,
                    }}
                >

                    <ResponsiveContainer>

                        <PieChart>

                            <Pie
                                data={chartData}
                                dataKey="value"
                                nameKey="name"
                                outerRadius={120}
                                label
                            >

                                {chartData.map((entry, index) => (

                                    <Cell
                                        key={index}
                                        fill={entry.color}
                                    />
                                ))}

                            </Pie>


                            <Tooltip />

                        </PieChart>

                    </ResponsiveContainer>

                </Box>

            </Paper>


            {/* RECENT REQUESTS */}

            <Paper
                elevation={3}
                sx={{
                    p: 3,
                    borderRadius: 3,
                }}
            >

                <Typography
                    variant="h5"
                    fontWeight="bold"
                    mb={3}
                >
                    בקשות אחרונות
                </Typography>


                <TableContainer>

                    <Table>

                        <TableHead>

                            <TableRow>

                                <TableCell>
                                    מספר רכב
                                </TableCell>

                                <TableCell>
                                    תאריך
                                </TableCell>

                                <TableCell>
                                    הערות
                                </TableCell>

                                <TableCell>
                                    סטטוס
                                </TableCell>

                            </TableRow>

                        </TableHead>


                        <TableBody>

                            {recentRequests.map((request) => (

                                <TableRow
                                    key={request.id}
                                >

                                    <TableCell>
                                        {request.plate_number}
                                    </TableCell>

                                    <TableCell>

                                        {

                                            new Date(
                                                request.created_at
                                            ).toLocaleString("he-IL")
                                        }

                                    </TableCell>

                                    <TableCell>
                                        {request.notes}
                                    </TableCell>

                                    <TableCell>

                                        {getStatusChip(
                                            request.status
                                        )}

                                    </TableCell>

                                </TableRow>
                            ))}

                        </TableBody>

                    </Table>

                </TableContainer>

            </Paper>

        </Box>
    );
}

export default DashboardPage;